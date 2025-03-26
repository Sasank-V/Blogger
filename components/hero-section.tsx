"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, PenLine } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-toastify";

export function HeroSection() {
  const { data: session, status } = useSession();
  const handleGetStarted = () => {
    if (status === "authenticated") {
      toast.success("You are already signed In");
      return;
    } else {
      signIn("google");
    }
  };
  return (
    <section className="relative w-full overflow-hidden py-10 md:py-14 lg:py-20">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted z-0"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] z-0"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Unleash your creativity with our blogging platform</span>
          </div>

          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Share Your Ideas With The World
            </h1>
            <p className="mx-auto max-w-[800px] text-xl text-muted-foreground md:text-2xl leading-relaxed">
              Create, publish, and grow your audience with our modern blogging
              platform designed for creators like you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
            <Button
              size="lg"
              className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/20 transition-transform hover:translate-y-[-2px]"
              asChild
              onClick={handleGetStarted}
            >
              <span>
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary/10"
              asChild
            >
              <Link href="/blog">
                <PenLine className="mr-2 h-5 w-5" /> Explore Blogs
              </Link>
            </Button>
          </div>

          {/* Featured stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-border w-full max-w-4xl">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">10K+</span>
              <span className="text-muted-foreground">Active Writers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">50K+</span>
              <span className="text-muted-foreground">Articles</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">2M+</span>
              <span className="text-muted-foreground">Monthly Readers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">150+</span>
              <span className="text-muted-foreground">Countries</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
