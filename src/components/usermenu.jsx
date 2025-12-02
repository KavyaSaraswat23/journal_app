"use client"
import { UserButton, UserProfile } from '@clerk/nextjs'
import { ChartNoAxesGantt } from 'lucide-react'
import React from 'react'

const UserMenu = () => {
  return (
    <div>
      {/* Can change my UI here  Must check*/}
      <UserButton
        appearance={{
          elements: {
            avatarBox: 'w-19 h-19'
          }
        }
        }>
        <UserButton.MenuItems>

          <UserButton.Link
            label="Dashboard"
            labelIcon={<ChartNoAxesGantt size={15} />}
            href='/dashboard'
          />
          <UserButton.Action label="manageAccount" />
        </UserButton.MenuItems>
      </UserButton>
    </div>
  )
}

export default UserMenu
