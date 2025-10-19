'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/jpg-to-pdf')
  }, [router])

  return (

      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-10 w-10 animate-spin" />
        </div>
      </div>

  )
}

export default Home