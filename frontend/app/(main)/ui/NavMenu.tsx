'use client'

import Link from "next/link"
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { useUser } from "@stackframe/stack";


export default function NavMenu() {
    const user = useUser()
    return (
        <header className="p-10">
            {/* medium screens and larger */}
            <div className="top-0 z-40 w-full bg-background m-4">
                <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                    {user && (
                        <Link href="/handler/sign-up" className="hover:text-green-700">
                            profile
                        </Link>
                    )}
                    {!user && (
                        <>
                            <Link href="/handler/sign-up" className="hover:text-green-700">
                                log in
                            </Link>
                            <Link href="/handler/sign-up" className="hover:text-green-700">
                                sign up
                            </Link>
                        </>
                    )}
                    <Link href="/" className="hover:text-green-700">
                        calculator
                    </Link>
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
                        <Link href="/handler/sign-up" className="hover:text-green-700">
                            sign up
                        </Link>
                        <Link href="/" className="hover:text-green-700">
                            calculator
                        </Link>
                        <Link href="/handler/account-settings" className="hover:text-green-700">
                            settings
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
        </header>
    )
}
