import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
      <div className="px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Share Your Ideas With The World
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Create, publish, and grow your audience with our modern blogging
              platform.
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/blog">Explore Blogs</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
