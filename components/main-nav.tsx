"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "./ui/button";

export function MainNav() {
  const { data: session, status } = useSession();

  return (
    <section className="hidden md:flex px-5 w-full justify-between">
      <div>
        <Link href="/" className="flex items-center">
          <span className="font-bold text-xl">Blogger</span>
        </Link>
      </div>
      <nav className="flex items-center gap-5 text-sm font-medium">
        <Link
          href="/"
          className="transition-colors hover:text-foreground/80 text-foreground"
        >
          Home
        </Link>
        <Link
          href="/blog"
          className="transition-colors hover:text-foreground/80 text-foreground/60"
        >
          Blog
        </Link>
        <Link
          href="/categories"
          className="transition-colors hover:text-foreground/80 text-foreground/60"
        >
          Categories
        </Link>
        <Link
          href="/about"
          className="transition-colors hover:text-foreground/80 text-foreground/60"
        >
          About
        </Link>
      </nav>
      <div className="flex items-center">
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          {status === "authenticated" && session?.user ? (
            <div className="flex items-center gap-3">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt="User Avatar"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              )}

              <Link
                href="/dashboard"
                className="transition-colors hover:text-foreground/80 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="transition-colors hover:text-foreground/80 text-sm font-medium"
              >
                Profile
              </Link>
              <Button size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => signIn("google")}>
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
    </section>
  );
}
