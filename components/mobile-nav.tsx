"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <div className="md:hidden flex">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <div className="px-7">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setOpen(false)}
            >
              <span className="font-bold text-xl">Blogger</span>
            </Link>
          </div>
          <nav className="flex flex-col gap-4 text-lg font-medium mt-8 px-7">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="transition-colors hover:text-foreground/80"
            >
              Home
            </Link>
            <Link
              href="/blog"
              onClick={() => setOpen(false)}
              className="transition-colors hover:text-foreground/80"
            >
              Blog
            </Link>
            {status === "authenticated" && session?.user && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="transition-colors hover:text-foreground/80"
                >
                  Dashboard
                </Link>
              </>
            )}
          </nav>
          <div className="border-t mt-4 pt-4 px-7">
            {status === "authenticated" && session?.user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Link href={`/profile/${session.user.id}`}>
                    {session.user.image && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user.image}
                          alt="User Avatar"
                        />
                        <AvatarFallback>
                          {session.user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </Link>

                  <span className="text-base">{session.user.name}</span>
                </div>
                <Button
                  className="text-base flex gap-2"
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                >
                  <DoorOpen className="h-5 w-5" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => {
                  signIn("google");
                  setOpen(false);
                }}
                className="transition-colors hover:text-foreground/80 flex gap-3"
              >
                <Image
                  src={"/google.svg"}
                  alt="Google Logo"
                  height={20}
                  width={20}
                />
                Sign In
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-bold text-xl">Blogger</span>
      </Link>
    </div>
  );
}
