#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod transfer_escrow {
    use ink::storage::Mapping;

    #[ink::storage_item]
    pub enum RequestStatus {
        /// Requested by new operator
        Pending,
        /// Some(1) - Verified by old operator & token transferred to escrow
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

    #[ink::storage_item]
    pub struct Request {
        /// Status of the request
        status: RequestStatus,
        /// Phone number token id associated with the transfer proposal
        token: String,
        /// Previous operator
        from: AccountId,
        /// New operator
        to: AccountId,
    }

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    #[derive(Default)]
    pub struct TransferEscrow {
        phone_numbers_psp34: AccountId,
        transfer_requests: Mapping<u64, Request>,
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

    impl TransferEscrow {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(phone_numbers_psp34: AccountId) -> Self {
            Self {
                phone_numbers_psp34,
                ..Default::default()
            }
        }

        /// Simply returns the current value of our `bool`.
        #[ink(message)]
        pub fn get(&self) -> bool {
            true
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
            let transfer_escrow = TransferEscrow::default();
            assert_eq!(transfer_escrow.get(), true);
        }

        /// We test a simple use case of our contract.
        #[ink::test]
        fn it_works() {
            let mut transfer_escrow = TransferEscrow::default();
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