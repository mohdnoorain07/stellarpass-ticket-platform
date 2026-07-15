#![cfg_attr(not(test), no_std)]
#![allow(clippy::needless_borrow)]

use soroban_sdk::{contract, contracterror, contractimpl, contracttype, Address, Env};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RoyaltyConfig {
    pub creator_share_bps: u32,
    pub platform_share_bps: u32,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Config,
    Creator,
    Platform,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum Error {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    Unauthorized = 3,
    InvalidConfig = 4,
    ArithmeticOverflow = 5,
}

#[contract]
pub struct RoyaltyContract;

#[contractimpl]
impl RoyaltyContract {
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        let storage = env.storage().instance();
        if storage.has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }

        admin.require_auth();
        storage.set(&DataKey::Admin, &admin);
        storage.set(
            &DataKey::Config,
            &RoyaltyConfig {
                creator_share_bps: 8000,
                platform_share_bps: 2000,
            },
        );
        // A safe default for development. Production deployments must configure
        // the actual creator and platform recipients immediately after setup.
        storage.set(&DataKey::Creator, &admin);
        storage.set(&DataKey::Platform, &admin);
        Ok(())
    }

    pub fn configure(
        env: Env,
        admin: Address,
        creator: Address,
        platform: Address,
        creator_share_bps: u32,
        platform_share_bps: u32,
    ) -> Result<(), Error> {
        let storage = env.storage().instance();
        let stored_admin: Address = storage.get(&DataKey::Admin).ok_or(Error::NotInitialized)?;
        if admin != stored_admin {
            return Err(Error::Unauthorized);
        }
        if creator_share_bps.checked_add(platform_share_bps) != Some(10_000) {
            return Err(Error::InvalidConfig);
        }

        admin.require_auth();
        storage.set(
            &DataKey::Config,
            &RoyaltyConfig {
                creator_share_bps,
                platform_share_bps,
            },
        );
        storage.set(&DataKey::Creator, &creator);
        storage.set(&DataKey::Platform, &platform);
        Ok(())
    }

    pub fn get_config(env: Env) -> Result<RoyaltyConfig, Error> {
        env.storage()
            .instance()
            .get(&DataKey::Config)
            .ok_or(Error::NotInitialized)
    }

    pub fn calculate_payouts(env: Env, sale_price: u128) -> Result<(u128, u128), Error> {
        let config = Self::get_config(env)?;
        let creator_amount = sale_price
            .checked_mul(config.creator_share_bps as u128)
            .ok_or(Error::ArithmeticOverflow)?
            / 10_000u128;
        let platform_amount = sale_price
            .checked_sub(creator_amount)
            .ok_or(Error::ArithmeticOverflow)?;
        Ok((creator_amount, platform_amount))
    }

    pub fn get_recipients(env: Env) -> Result<(Address, Address), Error> {
        let storage = env.storage().instance();
        let creator = storage.get(&DataKey::Creator).ok_or(Error::NotInitialized)?;
        let platform = storage.get(&DataKey::Platform).ok_or(Error::NotInitialized)?;
        Ok((creator, platform))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn calculates_royalty_split() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, RoyaltyContract);
        let client = RoyaltyContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin).unwrap();

        let (creator, platform) = client.calculate_payouts(&1000u128).unwrap();
        assert_eq!(creator, 800);
        assert_eq!(platform, 200);
    }

    #[test]
    fn configures_recipients_and_rejects_invalid_share_total() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, RoyaltyContract);
        let client = RoyaltyContractClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        let creator = Address::generate(&env);
        let platform = Address::generate(&env);
        client.initialize(&admin).unwrap();

        client
            .configure(&admin, &creator, &platform, &7_500u32, &2_500u32)
            .unwrap();
        assert_eq!(client.get_recipients().unwrap(), (creator.clone(), platform.clone()));

        let error = client
            .configure(&admin, &creator, &platform, &7_500u32, &2_400u32)
            .unwrap_err();
        assert_eq!(error, Error::InvalidConfig);
    }
}
