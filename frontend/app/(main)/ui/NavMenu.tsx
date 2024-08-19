'use client'

import Link from "next/link"
import Image from "next/image";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { useUser, UserButton } from "@stackframe/stack";
import { Separator } from "@/components/ui/separator";


function Logo() {
    return (
        <>
        <Image
            src="/logo-black.png"
            width={70}
            height={30}
            alt="logo"
            objectFit="cover"
        />
        <Image 
            src="/logo-green.png" 
            alt="Hover Image" 
            width={70} 
            height={30} 
            objectFit="cover" 
            className="absolute opacity-0 transition-opacity duration-200 hover:opacity-100" 
        />
        </>
    )
}

export default function NavMenu() {
    const user = useUser()
    return (
        <header className="p-10">
            {/* medium screens and larger */}
            <div className="top-0 z-40 w-full bg-background">
                <nav className="hidden place-items-center gap-6 text-sm font-medium md:flex md:justify-between">
                    <div className="flex gap-6 items-center">
                        <Logo />
                        <Link href="/" className="hover:text-green-700">
                            calculator
                        </Link>
                    </div>
                    {user ? (
                        <UserButton />
                    ) : (
                        <div className="flex gap-6">
                            <Link href="/handler/sign-in" className="hover:text-green-700">
                                log in
                            </Link>
                            <Link href="/handler/sign-up" className="hover:text-green-700">
                                sign up
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
            
            {/* mobile devices */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="ghost" className="md:hidden">
                        <HamburgerMenuIcon />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="md:hidden">
                    <nav className="grid gap-2 w-[300px] p-4">
                        {user ? (
                            <>
                                <SheetTrigger asChild>
                                    <Link href="/" className="hover:text-green-700">
                                        calculator
                                    </Link>
                                </SheetTrigger>
                                <Separator />
                                <SheetTrigger asChild>
                                    <Link href="/handler/account-settings" className="hover:text-green-700">
                                        profile
                                    </Link>
                                </SheetTrigger>
                            </>
                        ) : (
                            <>
                                <SheetTrigger asChild>
                                    <Link href="/handler/sign-in" className="hover:text-green-700">
                                        log in
                                    </Link>
                                </SheetTrigger>
                                <SheetTrigger asChild>
                                    <Link href="/handler/sign-up" className="hover:text-green-700">
                                        sign up
                                    </Link>
                                </SheetTrigger>
                                    <Separator />
                                <SheetTrigger asChild>
                                    <Link href="/" className="hover:text-green-700">
                                        calculator
                                    </Link>
                                </SheetTrigger>
                            </>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>
        </header>
    )
}
