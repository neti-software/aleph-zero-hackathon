'use client'

import { useRouter } from 'next/navigation'

import { useInkathon } from '@scio-labs/use-inkathon'

import AppBar from '@/components/ui/app-bar'
import { ChainInfo } from '@/components/web3/chain-info'
import { GreeterContractInteractions } from '@/components/web3/greeter-contract-interactions'

export default function HomePage() {
  const router = useRouter()

  // Display `useInkathon` error messages (optional)
  const { error } = useInkathon()
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     router.replace('/admin/associations')
  //   } else {
  //     router.replace('/auth/login')
  //   }
  // }, [isLoggedIn])

  return (
    <>
      <AppBar></AppBar>
      <div className="container relative flex grow flex-col items-center justify-center">
        <div className="mt-12 flex w-full flex-wrap items-start justify-center gap-4">
          {/* Chain Metadata Information */}
          <ChainInfo />

          {/* Greeter Read/Write Contract Interactions */}
          <GreeterContractInteractions />
        </div>
      </div>
    </>
  )
}
