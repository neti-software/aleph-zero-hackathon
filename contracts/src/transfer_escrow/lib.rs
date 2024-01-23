#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod transfer_escrow {
    use ink::storage::Mapping;
    use openbrush::contracts::{psp34::Id, traits::psp34::psp34_external::PSP34};
    use phone_numbers::PhoneNumbersRef;

    #[derive(scale::Decode, scale::Encode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub enum RequestStatus {
        /// Requested by new operator
        Pending,
        /// Verified by old operator & token transferred to escrow
        TokenTransferred,
        /// Awaiting aproval from both sides
        AprovalPending,
        /// Ready for transfer at given block number
        Ready(u64),
        /// Transferred successfully
        Finalized,
        /// Cancelled or otherwise broken
        Cancelled,
    }

    #[derive(scale::Decode, scale::Encode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Request {
        /// Phone number token id associated with the transfer proposal
        token: Id,
        /// Previous operator
        from: AccountId,
        /// New operator
        to: AccountId,
        /// The current status of the request
        status: RequestStatus,
    }

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct TransferEscrow {
        transfer_requests: Mapping<u64, Request>,
        phone_numbers_psp34: PhoneNumbersRef,
        next_id: u64,
    }

    #[ink(event)]
    pub struct TransferRequested {
        #[ink(topic)]
        from: AccountId,
        #[ink(topic)]
        to: AccountId,
        #[ink(topic)]
        request_id: u64,
    }

    #[ink(event)]
    pub struct TransferCompleted {
        #[ink(topic)]
        from: AccountId,
        #[ink(topic)]
        to: AccountId,
        #[ink(topic)]
        request_id: u64,
    }

    // impl PSP34Receiver for TransferEscrow {
    //     #[ink(message)]
    //     fn before_received(
    //         &mut self,
    //         operator: AccountId,
    //         from: AccountId,
    //         id: openbrush::contracts::psp34::Id,
    //         data: Vec<u8>,
    //     ) -> Result<(), openbrush::contracts::psp34::PSP34ReceiverError> {
    //     }
    // }

    impl TransferEscrow {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(phone_numbers_psp34: Hash) -> Self {
            let contract = PhoneNumbersRef::new()
                .code_hash(phone_numbers_psp34)
                .endowment(0)
                .salt_bytes([0xDE, 0xAD, 0xBE, 0xEF])
                .instantiate();

            Self {
                phone_numbers_psp34: contract,
                next_id: 0,
                transfer_requests: Default::default(),
            }
        }

        /// Simply returns the current value of our `bool`.
        #[ink(message)]
        pub fn get(&self) -> bool {
            true
        }

        /// Register a new transfer request
        pub fn register_new_request(&mut self, token_id: [u8; 12]) -> u64 {
            // 1. Get current owner of the phone number
            let id = Id::Bytes(token_id.to_vec());
            let owner = self.phone_numbers_psp34.owner_of(id.clone());
            let addr: AccountId = owner.unwrap();

            // 2. Register new transfer request
            let request = Request {
                token: id,
                from: addr,
                to: self.env().caller(),
                status: RequestStatus::Pending,
            };
            self.transfer_requests
                .insert(self.next_id, &request)
                .unwrap();

            // 3. Emit transfer registration event
            self.env().emit_event(TransferRequested {
                from: addr,
                to: self.env().caller(),
                request_id: self.next_id,
            });
            let current_id = self.next_id.clone();
            self.next_id += 1;
            current_id
        }
    }

    /// Unit tests in Rust are normally defined within such a `#[cfg(test)]`
    /// module and test functions are marked with a `#[test]` attribute.
    /// The below code is technically just normal Rust code.
    #[cfg(test)]
    mod tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;

        /// We test if the default constructor does its job.
        #[ink::test]
        fn default_works() {
            let transfer_escrow = TransferEscrow::new([0u8; 32].into());
            assert_eq!(transfer_escrow.get(), true);
        }

        /// We test a simple use case of our contract.
        #[ink::test]
        fn it_works() {
            let transfer_escrow = TransferEscrow::new([0u8; 32].into());
            assert_eq!(transfer_escrow.get(), true);
        }
    }

    /// This is how you'd write end-to-end (E2E) or integration tests for ink! contracts.
    ///
    /// When running these you need to make sure that you:
    /// - Compile the tests with the `e2e-tests` feature flag enabled (`--features e2e-tests`)
    /// - Are running a Substrate node which contains `pallet-contracts` in the background
    #[cfg(all(test, feature = "e2e-tests"))]
    mod e2e_tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;

        /// A helper function used for calling contract messages.
        use ink_e2e::build_message;

        /// The End-to-End test `Result` type.
        type E2EResult<T> = std::result::Result<T, Box<dyn std::error::Error>>;

        /// We test that we can upload and instantiate the contract using its default constructor.
        #[ink_e2e::test]
        async fn default_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            // Given
            let constructor = TransferEscrowRef::default();

            // When
            let contract_account_id = client
                .instantiate("transfer_escrow", &ink_e2e::alice(), constructor, 0, None)
                .await
                .expect("instantiate failed")
                .account_id;

            // Then
            let get = build_message::<TransferEscrowRef>(contract_account_id.clone())
                .call(|transfer_escrow| transfer_escrow.get());
            let get_result = client.call_dry_run(&ink_e2e::alice(), &get, 0, None).await;
            assert!(matches!(get_result.return_value(), false));

            Ok(())
        }

        /// We test that we can read and write a value from the on-chain contract contract.
        #[ink_e2e::test]
        async fn it_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            // Given
            let constructor = TransferEscrowRef::new(false);
            let contract_account_id = client
                .instantiate("transfer_escrow", &ink_e2e::bob(), constructor, 0, None)
                .await
                .expect("instantiate failed")
                .account_id;

            let get = build_message::<TransferEscrowRef>(contract_account_id.clone())
                .call(|transfer_escrow| transfer_escrow.get());
            let get_result = client.call_dry_run(&ink_e2e::bob(), &get, 0, None).await;
            assert!(matches!(get_result.return_value(), false));

            // When
            let flip = build_message::<TransferEscrowRef>(contract_account_id.clone())
                .call(|transfer_escrow| transfer_escrow.flip());
            let _flip_result = client
                .call(&ink_e2e::bob(), flip, 0, None)
                .await
                .expect("flip failed");

            // Then
            let get = build_message::<TransferEscrowRef>(contract_account_id.clone())
                .call(|transfer_escrow| transfer_escrow.get());
            let get_result = client.call_dry_run(&ink_e2e::bob(), &get, 0, None).await;
            assert!(matches!(get_result.return_value(), true));

            Ok(())
        }
    }
}
