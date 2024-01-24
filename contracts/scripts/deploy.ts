import { getDeploymentData } from '@/utils/getDeploymentData'
import { initPolkadotJs } from '@/utils/initPolkadotJs'
import { writeContractAddresses } from '@/utils/writeContractAddresses'
import { deployContract } from '@scio-labs/use-inkathon/helpers'

/**
 * Script that deploys the greeter contract and writes its address to a file.
 *
 * Parameters:
 *  - `DIR`: Directory to read contract build artifacts & write addresses to (optional, defaults to `./deployments`)
 *  - `CHAIN`: Chain ID (optional, defaults to `development`)
 *
 * Example usage:
 *  - `pnpm run deploy`
 *  - `CHAIN=alephzero-testnet pnpm run deploy`
 */
const main = async () => {
  const initParams = await initPolkadotJs()
  const { api, chain, account } = initParams

  // dummy deploy for the nft contract
  const { abi, wasm } = await getDeploymentData('phone_numbers')
  const phone_numbers = await deployContract(api, account, abi, wasm, 'new', [])
  let nftHash = phone_numbers.hash

  // deploy the transfer escrow contract
  const te = await getDeploymentData('transfer_escrow')
  const transfer_escrow = await deployContract(api, account, te.abi, te.wasm, 'new', [nftHash])

  // Write contract addresses to `{contract}/{network}.ts` file(s)
  await writeContractAddresses(chain.network, {
    transfer_escrow,
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => process.exit(0))
