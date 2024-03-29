#![cfg_attr(not(feature = "std"), no_std, no_main)]

pub use phone_numbers::PhoneNumbersRef;

#[openbrush::implementation(PSP34, AccessControl, PSP34Metadata, PSP34Enumerable)]
#[openbrush::contract]
pub mod phone_numbers {
    use openbrush::{modifiers, traits::Storage};

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct PhoneNumbers {
        #[storage_field]
        psp34: psp34::Data,
        #[storage_field]
        access: access_control::Data,
        #[storage_field]
        metadata: metadata::Data,
        #[storage_field]
        enumerable: enumerable::Data,
    }

    const CENTRAL_AUTHORITY: RoleType = ink::selector_id!("CENTRAL_AUTHORITY");
    impl PhoneNumbers {
        #[ink(constructor)]
        pub fn new() -> Self {
            let mut instance = Self::default();
            let caller = instance.env().caller();
            access_control::Internal::_init_with_admin(&mut instance, Some(caller));
            AccessControl::grant_role(&mut instance, CENTRAL_AUTHORITY, Some(caller))
                .expect("Should grant CENTRAL_AUTHORITY role");
            instance
        }

        #[ink(message)]
        #[modifiers(only_role(CENTRAL_AUTHORITY))]
        pub fn mint(&mut self, phone_number: Vec<u8>) -> Result<(), PSP34Error> {
            psp34::Internal::_mint_to(self, Self::env().caller(), Id::Bytes(phone_number))?;
            Ok(())
        }

        #[ink(message)]
        pub fn set_metadata(&mut self, owner: AccountId, id: Id) -> Result<(), PSP34Error> {
            let caller = Self::env().caller();
            let owner_option = psp34::Internal::_owner_of(self, &id);
            if owner_option != Some(caller) {
                return Err(PSP34Error::Custom(String::from(
                    "Ownership error: Caller is not the owner",
                )));
            }

            metadata::Internal::_set_attribute(self, id, "owner".into(), hex::encode(owner));
            Ok(())
        }
    }
}
