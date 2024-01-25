'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useInkathon } from '@scio-labs/use-inkathon'

import { ConnectButton } from '@/components/web3/connect-button'

export default function HomePage() {
  const router = useRouter()

  // Display `useInkathon` error messages (optional)
  const { connect } = useInkathon()
  useEffect(() => {
    if (connect) {
      router.replace('/dashboard')
    } else {
      router.replace('/')
    }
  }, [connect])

  return (
    <>
      <div className="container relative flex grow flex-col items-center justify-center">
        <ConnectButton />
      </div>
    </>
  )
}
