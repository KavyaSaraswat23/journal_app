import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { PenBox, FolderOpen } from "lucide-react";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import UserMenu from "./usermenu";
import { checkUser } from "@/lib/checkUser";
import logo from "../data/logo.png"
async function Header() {

  return (
    <header className="container mx-auto">
      <nav className="py-0 px-4 flex justify-between items-center">
        <Link href="/" >
          <Image
            src={logo}
            alt="unfold Logo"
            width={500}
            height={20}
            className="h-40 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/dashboard#collections">
              <Button variant="outline" className="flex items-center gap-2">
                <FolderOpen size={18} />
                <span className="hidden md:inline">Collections</span>
              </Button>
            </Link>
          </SignedIn>
          <Link href="/journal/write">
            <Button variant="journal" className="flex items-center gap-2">
              <PenBox size={18} />
              <span className="hidden md:inline">Write New</span>
            </Button>
          </Link>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}

export default Header;