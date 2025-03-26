"use client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

export function SiteHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center md:justify-between w-full">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-4 md:hidden">
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            {status === "authenticated" && session?.user ? (
              <>
                <div className="flex items-center space-x-2">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt="User Avatar"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signIn("google")}
              >
                <Image
                  src={"/google.svg"}
                  alt="Google Logo"
                  height={15}
                  width={15}
                />
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
