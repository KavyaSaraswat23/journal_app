import Link from 'next/link'
import React from 'react'
import { SignInButton, SignedOut, SignedIn, UserButton, SignUpButton } from '@clerk/nextjs'
import { Button } from './ui/button'
import { FolderOpen, PenBox, PenBoxIcon } from 'lucide-react'
import UserMenu from './usermenu';
import { checkUser } from '@/lib/checkUser'
const Header = async () => {
  await checkUser();
  return (
    <div className=' bg-zinc-500 h-15'>
        <header className='flex justify-between'>
            <nav>
                <Link href={'/'} className=' h-2 w-3 bg-amber-600 text-2xl font-bold'> My Journal</Link>
            </nav>
            <div className='flex justify-end'>
                {/* Can change UI here */}
                <SignedIn>
                    <Link href="/dashboard#colletions">
                        <Button variant="outline">
                            <FolderOpen />
                            <span className='hidden md:inline'>Collections</span>
                        </Button>
                    </Link>
                    
                </SignedIn>
                <Link href="/journal/write">
                    <Button>
                        <PenBoxIcon />
                        <span className='hidden md:inline'>Write new Journal</span>
                    </Button>
                </Link>
                <SignedIn >
                    <UserMenu />
                </SignedIn>
                <SignedOut>
                    <SignInButton> 
                        <Button variant="secondary">Login</Button>
                    </SignInButton>
                    <SignUpButton>
                        <Button>Sign Up</Button>
                    </SignUpButton>
                </SignedOut>
            </div>
        </header>
    </div>
  )
}

export default Header
