#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod transfer_escrow {
    use ink::env::call::FromAccountId;
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;
    use openbrush::{
        contracts::{
            psp34::{extensions::metadata::psp34metadata_external::PSP34Metadata, Id},
            traits::psp34::psp34_external::PSP34,
        },
        traits::String,
    };
    use phone_numbers::PhoneNumbersRef;

    #[derive(scale::Decode, scale::Encode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub enum ContractError {
        NotFound,
        Unauthorized,
        NotAllowed,
    }

    #[derive(PartialEq, scale::Decode, scale::Encode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub enum RequestStatus {
        PendingApprovals,
        Ready,
        Finalized,
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
        approvals: [bool; 2],
    }

    type CallResult<T> = Result<T, ContractError>;
    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct TransferEscrow {
        transfer_requests: Mapping<u64, Request>,
        phone_numbers_psp34: PhoneNumbersRef,
        next_id: u64,
    }

    impl TransferEscrow {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(phone_numbers_psp34: AccountId) -> Self {
            Self {
                phone_numbers_psp34: PhoneNumbersRef::from_account_id(phone_numbers_psp34),
                next_id: 0,
                transfer_requests: Default::default(),
            }
        }

        #[ink(message)]
        pub fn get_request(&self, id: u64) -> Request {
            self.transfer_requests.get(id).unwrap()
        }

        #[ink(message)]
        pub fn get_request_count(&self) -> u64 {
            self.next_id
        }

        #[ink(message)]
        pub fn register_new_request(&mut self, id: Id, target: AccountId) -> CallResult<()> {
            // 1. Get current owner of the phone number
            let owner = self.phone_numbers_psp34.owner_of(id.clone()).unwrap();
            let owner_key = String::from("owner");
            let user = self
                .phone_numbers_psp34
                .get_attribute(id.clone(), owner_key);

            if Some(hex::encode(self.env().caller())) != user {
                return Err(ContractError::Unauthorized);
            }

            // 2. Register new transfer request
            let request = Request {
                token: id,
                from: owner,
                to: target,
                status: RequestStatus::PendingApprovals,
                approvals: Default::default(),
            };
            self.transfer_requests
                .insert(self.next_id, &request)
                .unwrap();

            self.next_id += 1;
            Ok(())
        }

        /// Approve the
        #[ink(message)]
        pub fn approve_transfer(&mut self, request_id: u64) -> CallResult<()> {
            // 1. Verify request
            let req = self.transfer_requests.get(request_id);
            if req.is_none() {
                return Err(ContractError::NotFound);
            }
            let mut req = req.unwrap();
            if req.status != RequestStatus::PendingApprovals {
                return Err(ContractError::NotAllowed);
            }

            if &self.env().caller() == &req.from {
                req.approvals[0] = true;
            } else if &self.env().caller() == &req.to {
                req.approvals[1] = true;
            } else {
                return Err(ContractError::Unauthorized);
            }

            // 3. Progress if all approvals are given
            if req.approvals.iter().all(|x| x == &true) {
                req.status = RequestStatus::Ready;
            }
            Ok(())
        }

        #[ink(message)]
        pub fn finish_transfer(&mut self, request_id: u64) -> CallResult<()> {
            // 1. Verify request
            let req = self.transfer_requests.get(request_id);
            if req.is_none() {
                return Err(ContractError::NotFound);
            }
            let mut req = req.unwrap();

            if req.status != RequestStatus::Ready {
                return Err(ContractError::NotAllowed);
            }

            self.phone_numbers_psp34
                .transfer(req.to, req.token, Vec::new())
                .unwrap();

            req.status = RequestStatus::Finalized;

            return Ok(());
        }
    }
}
