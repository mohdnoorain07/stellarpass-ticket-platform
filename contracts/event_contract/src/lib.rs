#![cfg_attr(not(test), no_std)]
#![allow(clippy::needless_borrow)]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, Address, Env, String,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Event {
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
    NextEventId,
    Event(u32),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    EventNotFound = 3,
    Unauthorized = 4,
    SoldOut = 5,
}

#[contract]
pub struct EventContract;

#[contractimpl]
impl EventContract {
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        let storage = env.storage().instance();

        if storage.has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }

        admin.require_auth();
        storage.set(&DataKey::Admin, &admin);
        storage.set(&DataKey::NextEventId, &1u32);
        Ok(())
    }

    pub fn create_event(
        env: Env,
        organizer: Address,
        title: String,
        price: u128,
        total_supply: u32,
    ) -> Result<u32, Error> {
        let storage = env.storage().instance();
        if !storage.has(&DataKey::Admin) {
            return Err(Error::NotInitialized);
        }
        organizer.require_auth();

        let event_id: u32 = storage.get(&DataKey::NextEventId).unwrap_or(1u32);
        let event = Event {
            id: event_id,
            title,
            organizer: organizer.clone(),
            price,
            total_supply,
            sold_supply: 0,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Event(event_id), &event);
        storage.set(&DataKey::NextEventId, &(event_id + 1));
        env.events()
            .publish((symbol_short!("event"), event_id), event);

        Ok(event_id)
    }

    pub fn get_event(env: Env, event_id: u32) -> Result<Event, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Event(event_id))
            .ok_or(Error::EventNotFound)
    }

    /// Reserves capacity during a ticket purchase. This is invoked by the
    /// ticket contract in the same transaction as payment and minting.
    pub fn reserve_ticket(env: Env, event_id: u32, buyer: Address) -> Result<(), Error> {
        let mut event: Event = env
            .storage()
            .persistent()
            .get(&DataKey::Event(event_id))
            .ok_or(Error::EventNotFound)?;
        if event.sold_supply >= event.total_supply {
            return Err(Error::SoldOut);
        }

        buyer.require_auth();
        event.sold_supply = event.sold_supply.checked_add(1).ok_or(Error::SoldOut)?;
        env.storage()
            .persistent()
            .set(&DataKey::Event(event_id), &event);
        env.events()
            .publish((symbol_short!("reserved"), event_id), event.sold_supply);
        Ok(())
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn create_and_read_event() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, EventContract);
        let client = EventContractClient::new(&env, &contract_id);

        let organizer = Address::generate(&env);
        client.initialize(&organizer);

        let title = String::from_str(&env, "Launch Night");
        let event_id = client.create_event(&organizer, &title, &1000u128, &200u32);

        let event = client.get_event(&event_id);

        assert_eq!(event.id, 1);
        assert_eq!(event.title, title);
        assert_eq!(event.organizer, organizer);
        assert_eq!(event.price, 1000u128);
        assert_eq!(event.total_supply, 200u32);
        assert_eq!(event.sold_supply, 0u32);
    }

    #[test]
    fn get_missing_event_returns_error() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EventContract);
        let client = EventContractClient::new(&env, &contract_id);

        let result = client.try_get_event(&999);
        assert_eq!(result, Err(Ok(Error::EventNotFound)));
    }

    #[test]
    fn test_multiple_events() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, EventContract);
        let client = EventContractClient::new(&env, &contract_id);
        let organizer = Address::generate(&env);
        client.initialize(&organizer);

        let first = client.create_event(
            &organizer,
            &String::from_str(&env, "First Night"),
            &100u128,
            &50u32,
        );
        let second = client.create_event(
            &organizer,
            &String::from_str(&env, "Second Night"),
            &200u128,
            &100u32,
        );
        let third = client.create_event(
            &organizer,
            &String::from_str(&env, "Third Night"),
            &300u128,
            &150u32,
        );

        // IDs are auto-incremented per event, mirroring the feedback-contract
        // `test_multiple_feedbacks` pattern.
        assert_eq!(first, 1);
        assert_eq!(second, 2);
        assert_eq!(third, 3);
        assert_eq!(
            client.get_event(&first).title,
            String::from_str(&env, "First Night")
        );
        assert_eq!(
            client.get_event(&second).title,
            String::from_str(&env, "Second Night")
        );
        assert_eq!(
            client.get_event(&third).title,
            String::from_str(&env, "Third Night")
        );
    }

    #[test]
    fn reservation_enforces_event_supply() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, EventContract);
        let client = EventContractClient::new(&env, &contract_id);
        let organizer = Address::generate(&env);
        let buyer = Address::generate(&env);
        client.initialize(&organizer);
        let event_id = client.create_event(
            &organizer,
            &String::from_str(&env, "One seat"),
            &1u128,
            &1u32,
        );

        client.reserve_ticket(&event_id, &buyer);
        assert_eq!(client.get_event(&event_id).sold_supply, 1u32);
        let result = client.try_reserve_ticket(&event_id, &buyer);
        assert_eq!(result, Err(Ok(Error::SoldOut)));
    }
}
