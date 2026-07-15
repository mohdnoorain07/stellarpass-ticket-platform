#![cfg_attr(not(test), no_std)]
#![allow(clippy::needless_borrow)]

use soroban_sdk::{contract, contracterror, contractimpl, contracttype, symbol_short, token, Address, Env, IntoVal, String, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Ticket {
    pub id: u32,
    pub event_id: u32,
    pub owner: Address,
    pub used: bool,
    pub metadata: String,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ResaleListing {
    pub seller: Address,
    pub sale_price: u128,
}

/// Mirrors the Event contract return type for cross-contract decoding.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EventSnapshot {
    pub id: u32,
    pub title: String,
    pub organizer: Address,
    pub price: u128,
    pub total_supply: u32,
    pub sold_supply: u32,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    NextTicketId,
    Ticket(u32),
    Listing(u32),
    RoyaltyContract,
    PaymentToken,
    EventContract,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum Error {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    Unauthorized = 3,
    TicketNotFound = 4,
    AlreadyUsed = 5,
    TicketUsed = 6,
    RoyaltyFailure = 7,
    InvalidSale = 8,
    ArithmeticOverflow = 9,
    ListingNotFound = 10,
    ListingAlreadyExists = 11,
}

#[contract]
pub struct TicketContract;

#[contractimpl]
impl TicketContract {
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        let storage = env.storage().instance();
        if storage.has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }

        admin.require_auth();
        storage.set(&DataKey::Admin, &admin);
        storage.set(&DataKey::NextTicketId, &1u32);
        Ok(())
    }

    pub fn mint_ticket(
        env: Env,
        admin: Address,
        event_id: u32,
        owner: Address,
        metadata: String,
    ) -> Result<u32, Error> {
        let storage = env.storage().instance();
        let stored_admin: Address = storage.get(&DataKey::Admin).ok_or(Error::NotInitialized)?;
        if admin != stored_admin {
            return Err(Error::Unauthorized);
        }

        admin.require_auth();
        owner.require_auth();

        let ticket_id: u32 = storage.get(&DataKey::NextTicketId).unwrap_or(1u32);
        let ticket = Ticket {
            id: ticket_id,
            event_id,
            owner: owner.clone(),
            used: false,
            metadata,
        };

        env.storage().persistent().set(&DataKey::Ticket(ticket_id), &ticket);
        storage.set(&DataKey::NextTicketId, &(ticket_id + 1));
        env.events().publish((symbol_short!("mint"), ticket_id), ticket);

        Ok(ticket_id)
    }

    pub fn get_ticket(env: Env, ticket_id: u32) -> Result<Ticket, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Ticket(ticket_id))
            .ok_or(Error::TicketNotFound)
    }

    pub fn use_ticket(env: Env, ticket_id: u32, caller: Address) -> Result<(), Error> {
        let mut ticket: Ticket = env
            .storage()
            .persistent()
            .get(&DataKey::Ticket(ticket_id))
            .ok_or(Error::TicketNotFound)?;

        if ticket.used {
            return Err(Error::AlreadyUsed);
        }

        if caller != ticket.owner {
            return Err(Error::Unauthorized);
        }

        caller.require_auth();
        ticket.used = true;
        env.storage().persistent().set(&DataKey::Ticket(ticket_id), &ticket);
        env.events().publish((symbol_short!("used"), ticket_id), ticket);

        Ok(())
    }

    pub fn transfer_ticket(
        env: Env,
        ticket_id: u32,
        current_owner: Address,
        new_owner: Address,
    ) -> Result<(), Error> {
        let mut ticket: Ticket = env
            .storage()
            .persistent()
            .get(&DataKey::Ticket(ticket_id))
            .ok_or(Error::TicketNotFound)?;

        if ticket.used {
            return Err(Error::TicketUsed);
        }

        if current_owner != ticket.owner {
            return Err(Error::Unauthorized);
        }

        current_owner.require_auth();
        new_owner.require_auth();
        ticket.owner = new_owner;
        env.storage().persistent().set(&DataKey::Ticket(ticket_id), &ticket);
        env.storage().persistent().remove(&DataKey::Listing(ticket_id));
        env.events().publish((symbol_short!("xfer"), ticket_id), ticket);

        Ok(())
    }

    pub fn set_royalty_contract(env: Env, royalty_contract: Address) -> Result<(), Error> {
        let storage = env.storage().instance();
        let admin: Address = storage.get(&DataKey::Admin).ok_or(Error::NotInitialized)?;
        admin.require_auth();
        storage.set(&DataKey::RoyaltyContract, &royalty_contract);
        Ok(())
    }

    /// Marks a ticket as used from an event gate. Only the ticket-contract
    /// administrator may perform this operation, so an attendee cannot check
    /// in somebody else's ticket from a browser.
    pub fn check_in_ticket(env: Env, ticket_id: u32, admin: Address) -> Result<(), Error> {
        let stored_admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(Error::NotInitialized)?;
        if admin != stored_admin {
            return Err(Error::Unauthorized);
        }

        let mut ticket: Ticket = env
            .storage()
            .persistent()
            .get(&DataKey::Ticket(ticket_id))
            .ok_or(Error::TicketNotFound)?;
        if ticket.used {
            return Err(Error::AlreadyUsed);
        }

        admin.require_auth();
        ticket.used = true;
        env.storage().persistent().set(&DataKey::Ticket(ticket_id), &ticket);
        env.events().publish((symbol_short!("checkin"), ticket_id), ticket);
        Ok(())
    }

    pub fn set_payment_token(env: Env, payment_token: Address) -> Result<(), Error> {
        let storage = env.storage().instance();
        let admin: Address = storage.get(&DataKey::Admin).ok_or(Error::NotInitialized)?;
        admin.require_auth();
        storage.set(&DataKey::PaymentToken, &payment_token);
        Ok(())
    }

    pub fn set_event_contract(env: Env, event_contract: Address) -> Result<(), Error> {
        let storage = env.storage().instance();
        let admin: Address = storage.get(&DataKey::Admin).ok_or(Error::NotInitialized)?;
        admin.require_auth();
        storage.set(&DataKey::EventContract, &event_contract);
        Ok(())
    }

    /// Purchases a primary ticket. Event capacity reservation, payment, and
    /// ticket minting are one transaction and therefore either all succeed or
    /// all revert.
    pub fn purchase_ticket(
        env: Env,
        event_id: u32,
        buyer: Address,
        metadata: String,
    ) -> Result<u32, Error> {
        buyer.require_auth();
        let event_contract: Address = env
            .storage()
            .instance()
            .get(&DataKey::EventContract)
            .ok_or(Error::NotInitialized)?;
        let event: EventSnapshot = env.invoke_contract(
            &event_contract,
            &Symbol::new(&env, "get_event"),
            (event_id,).into_val(&env),
        );
        let payment_token: Address = env
            .storage()
            .instance()
            .get(&DataKey::PaymentToken)
            .ok_or(Error::NotInitialized)?;
        let amount = i128::try_from(event.price).map_err(|_| Error::ArithmeticOverflow)?;
        if amount <= 0 {
            return Err(Error::InvalidSale);
        }

        env.invoke_contract::<()>(
            &event_contract,
            &Symbol::new(&env, "reserve_ticket"),
            (event_id, buyer.clone()).into_val(&env),
        );
        token::Client::new(&env, &payment_token).transfer(&buyer, &event.organizer, &amount);

        let storage = env.storage().instance();
        let ticket_id: u32 = storage.get(&DataKey::NextTicketId).unwrap_or(1u32);
        let ticket = Ticket {
            id: ticket_id,
            event_id,
            owner: buyer,
            used: false,
            metadata,
        };
        env.storage().persistent().set(&DataKey::Ticket(ticket_id), &ticket);
        storage.set(&DataKey::NextTicketId, &(ticket_id + 1));
        env.events().publish((symbol_short!("primary"), ticket_id), ticket);
        Ok(ticket_id)
    }

    /// Creates a seller-authorized listing. The ticket remains in the seller's
    /// wallet until a buyer settles it, so no off-chain escrow is required.
    pub fn list_for_resale(
        env: Env,
        ticket_id: u32,
        seller: Address,
        sale_price: u128,
    ) -> Result<(), Error> {
        let ticket: Ticket = env
            .storage()
            .persistent()
            .get(&DataKey::Ticket(ticket_id))
            .ok_or(Error::TicketNotFound)?;
        if ticket.used {
            return Err(Error::TicketUsed);
        }
        if ticket.owner != seller {
            return Err(Error::Unauthorized);
        }
        if sale_price == 0 {
            return Err(Error::InvalidSale);
        }
        if env.storage().persistent().has(&DataKey::Listing(ticket_id)) {
            return Err(Error::ListingAlreadyExists);
        }

        seller.require_auth();
        env.storage().persistent().set(
            &DataKey::Listing(ticket_id),
            &ResaleListing { seller, sale_price },
        );
        env.events().publish((symbol_short!("listed"), ticket_id), sale_price);
        Ok(())
    }

    /// Buyer-authorized purchase for an existing listing. Token transfers,
    /// royalty distribution, listing removal, and ownership transfer are one
    /// Soroban transaction, so partial settlement cannot occur.
    pub fn buy_listed_ticket(env: Env, ticket_id: u32, buyer: Address) -> Result<(u128, u128), Error> {
        let mut ticket: Ticket = env
            .storage()
            .persistent()
            .get(&DataKey::Ticket(ticket_id))
            .ok_or(Error::TicketNotFound)?;
        let listing: ResaleListing = env
            .storage()
            .persistent()
            .get(&DataKey::Listing(ticket_id))
            .ok_or(Error::ListingNotFound)?;
        if ticket.used {
            return Err(Error::TicketUsed);
        }
        if ticket.owner != listing.seller {
            return Err(Error::Unauthorized);
        }
        if buyer == listing.seller {
            return Err(Error::InvalidSale);
        }

        buyer.require_auth();
        let royalties = Self::settle_resale_payment(
            &env,
            &listing.seller,
            &buyer,
            listing.sale_price,
        )?;
        ticket.owner = buyer;
        env.storage().persistent().set(&DataKey::Ticket(ticket_id), &ticket);
        env.storage().persistent().remove(&DataKey::Listing(ticket_id));
        env.events().publish((symbol_short!("sold"), ticket_id), ticket);
        Ok(royalties)
    }

    /// Legacy resale — kept for on-chain backwards compatibility.
    ///
    /// Prefer the two-step listing flow (`list_for_resale` + `buy_listed_ticket`)
    /// which avoids asking both seller and buyer to authorise the same
    /// transaction and supports discoverable listings.
    ///
    /// This method requires both seller and buyer to sign, does not emit
    /// listing events, and does not enforce that the listing is current.
    /// It will be removed in a future upgrade.
    #[deprecated(note = "Use list_for_resale + buy_listed_ticket instead")]
    pub fn resale_ticket(
        env: Env,
        ticket_id: u32,
        seller: Address,
        buyer: Address,
        sale_price: u128,
    ) -> Result<(u128, u128), Error> {
        let mut ticket: Ticket = env
            .storage()
            .persistent()
            .get(&DataKey::Ticket(ticket_id))
            .ok_or(Error::TicketNotFound)?;

        if ticket.used {
            return Err(Error::TicketUsed);
        }

        if seller != ticket.owner {
            return Err(Error::Unauthorized);
        }
        if seller == buyer || sale_price == 0 {
            return Err(Error::InvalidSale);
        }

        seller.require_auth();
        buyer.require_auth();

        let royalties = Self::settle_resale_payment(&env, &seller, &buyer, sale_price)?;

        ticket.owner = buyer;
        env.storage().persistent().set(&DataKey::Ticket(ticket_id), &ticket);

        Ok(royalties)
    }

    fn settle_resale_payment(
        env: &Env,
        seller: &Address,
        buyer: &Address,
        sale_price: u128,
    ) -> Result<(u128, u128), Error> {
        let royalty_contract: Address = env
            .storage()
            .instance()
            .get(&DataKey::RoyaltyContract)
            .ok_or(Error::NotInitialized)?;
        let royalties: (u128, u128) = env.invoke_contract(
            &royalty_contract,
            &Symbol::new(env, "calculate_payouts"),
            (sale_price,).into_val(env),
        );
        let (creator, platform): (Address, Address) = env.invoke_contract(
            &royalty_contract,
            &Symbol::new(env, "get_recipients"),
            ().into_val(env),
        );
        let payment_token: Address = env
            .storage()
            .instance()
            .get(&DataKey::PaymentToken)
            .ok_or(Error::NotInitialized)?;
        let seller_amount = sale_price
            .checked_sub(royalties.0)
            .and_then(|amount| amount.checked_sub(royalties.1))
            .ok_or(Error::ArithmeticOverflow)?;
        let seller_amount = i128::try_from(seller_amount).map_err(|_| Error::ArithmeticOverflow)?;
        let creator_amount = i128::try_from(royalties.0).map_err(|_| Error::ArithmeticOverflow)?;
        let platform_amount = i128::try_from(royalties.1).map_err(|_| Error::ArithmeticOverflow)?;
        let payment = token::Client::new(env, &payment_token);
        payment.transfer(buyer, seller, &seller_amount);
        payment.transfer(&buyer, &creator, &creator_amount);
        payment.transfer(&buyer, &platform, &platform_amount);
        Ok(royalties)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, String as SorobanString};

    #[test]
    fn mint_and_read_ticket() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, TicketContract);
        let client = TicketContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let owner = Address::generate(&env);
        client.initialize(&admin).unwrap();

        let metadata = String::from_str(&env, "General Admission");
        let ticket_id = client
            .mint_ticket(&admin, &7u32, &owner, &metadata)
            .unwrap();

        let ticket = client.get_ticket(&ticket_id).unwrap();
        assert_eq!(ticket.id, 1);
        assert_eq!(ticket.event_id, 7u32);
        assert_eq!(ticket.owner, owner);
        assert_eq!(ticket.used, false);
        assert_eq!(ticket.metadata, metadata);
    }

    #[test]
    fn use_ticket_marks_it_used() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, TicketContract);
        let client = TicketContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let owner = Address::generate(&env);
        client.initialize(&admin).unwrap();

        let metadata = String::from_str(&env, "VIP");
        let ticket_id = client
            .mint_ticket(&admin, &10u32, &owner, &metadata)
            .unwrap();

        client.use_ticket(&ticket_id, &owner).unwrap();
        let ticket = client.get_ticket(&ticket_id).unwrap();
        assert!(ticket.used);
    }

    #[test]
    fn using_twice_returns_error() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, TicketContract);
        let client = TicketContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let owner = Address::generate(&env);
        client.initialize(&admin).unwrap();

        let metadata = String::from_str(&env, "VIP");
        let ticket_id = client
            .mint_ticket(&admin, &10u32, &owner, &metadata)
            .unwrap();

        client.use_ticket(&ticket_id, &owner).unwrap();
        let error = client.use_ticket(&ticket_id, &owner).unwrap_err();
        assert_eq!(error, Error::AlreadyUsed);
    }

    #[test]
    fn administrator_can_check_in_ticket_once() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, TicketContract);
        let client = TicketContractClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        let owner = Address::generate(&env);
        client.initialize(&admin).unwrap();
        let ticket_id = client
            .mint_ticket(&admin, &10u32, &owner, &String::from_str(&env, "Gate ticket"))
            .unwrap();

        client.check_in_ticket(&ticket_id, &admin).unwrap();
        assert!(client.get_ticket(&ticket_id).unwrap().used);
        let error = client.check_in_ticket(&ticket_id, &admin).unwrap_err();
        assert_eq!(error, Error::AlreadyUsed);
    }

    #[test]
    fn transfer_ticket_updates_owner() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, TicketContract);
        let client = TicketContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let owner = Address::generate(&env);
        let new_owner = Address::generate(&env);
        client.initialize(&admin).unwrap();

        let metadata = String::from_str(&env, "Transferable");
        let ticket_id = client
            .mint_ticket(&admin, &12u32, &owner, &metadata)
            .unwrap();

        client.transfer_ticket(&ticket_id, &owner, &new_owner).unwrap();
        let ticket = client.get_ticket(&ticket_id).unwrap();
        assert_eq!(ticket.owner, new_owner);
    }

    #[test]
    fn transfer_used_ticket_returns_error() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, TicketContract);
        let client = TicketContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let owner = Address::generate(&env);
        let new_owner = Address::generate(&env);
        client.initialize(&admin).unwrap();

        let metadata = String::from_str(&env, "Used Ticket");
        let ticket_id = client
            .mint_ticket(&admin, &13u32, &owner, &metadata)
            .unwrap();

        client.use_ticket(&ticket_id, &owner).unwrap();
        let error = client.transfer_ticket(&ticket_id, &owner, &new_owner).unwrap_err();
        assert_eq!(error, Error::TicketUsed);
    }

    #[test]
    fn listed_resale_transfers_ownership_and_distributes_payment() {
        let env = Env::default();
        env.mock_all_auths();

        let ticket_contract_id = env.register_contract(None, TicketContract);
        let ticket_client = TicketContractClient::new(&env, &ticket_contract_id);

        let royalty_contract_id = env.register_contract(None, RoyaltyContract);
        let royalty_client = RoyaltyContractClient::new(&env, &royalty_contract_id);

        let admin = Address::generate(&env);
        let seller = Address::generate(&env);
        let buyer = Address::generate(&env);
        let creator = Address::generate(&env);
        let platform = Address::generate(&env);
        ticket_client.initialize(&admin).unwrap();
        royalty_client.initialize(&admin).unwrap();
        royalty_client
            .configure(&admin, &creator, &platform, &8000u32, &2000u32)
            .unwrap();
        ticket_client.set_royalty_contract(&royalty_contract_id).unwrap();
        let payment_token_id = env.register_stellar_asset_contract(admin.clone());
        let payment_token = token::StellarAssetClient::new(&env, &payment_token_id);
        payment_token.mint(&buyer, &1000i128);
        ticket_client.set_payment_token(&payment_token_id).unwrap();

        let metadata = String::from_str(&env, "Resaleable");
        let ticket_id = ticket_client
            .mint_ticket(&admin, &14u32, &seller, &metadata)
            .unwrap();

        ticket_client
            .list_for_resale(&ticket_id, &seller, &1000u128)
            .unwrap();
        let (creator_amount, platform_amount) = ticket_client
            .buy_listed_ticket(&ticket_id, &buyer)
            .unwrap();

        let ticket = ticket_client.get_ticket(&ticket_id).unwrap();
        assert_eq!(ticket.owner, buyer);
        assert_eq!(creator_amount, 800u128);
        assert_eq!(platform_amount, 200u128);
        assert_eq!(payment_token.balance(&buyer), 0i128);
        assert_eq!(payment_token.balance(&creator), 800i128);
        assert_eq!(payment_token.balance(&platform), 200i128);
    }
}
