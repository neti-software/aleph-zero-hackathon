'use client'

// import { useRouter } from 'next/navigation'
// import { useEffect } from 'react'
// import { useInkathon } from '@scio-labs/use-inkathon'
import AppBar from '@/components/ui/app-bar'

export default function Dashboard() {
  // const router = useRouter()

  // Display `useInkathon` error messages (optional)
  // const { isConnected } = useInkathon()
  // useEffect(() => {
  //   if (!isConnected) {
  //     router.replace('/')
  //   } else {
  //     router.replace('/dashboard')
  //   }
  // }, [!isConnected])

  return (
    <>
      <AppBar></AppBar>
      <div className="container relative flex grow flex-col items-center justify-center">
        dziala
      </div>
    </>
  )
}
