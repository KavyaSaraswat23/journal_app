import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div>
      <h1>404</h1>
      <h3>Oops this page is not available
      </h3>
      <Link href="/">
        <Button variant="default">
            Return Home
        </Button>
      </Link>
    </div>
  )
}

export default NotFound
