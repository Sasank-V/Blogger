"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeroSection } from "@/components/hero-section";
import { FeaturedPosts } from "@/components/featured-posts";
import { ArrowRight, Edit, Users, BarChart3 } from "lucide-react";
import type { Post } from "@/lib/types";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();
  const handleGetStarted = () => {
    if (status === "authenticated") {
      toast.success("You are already signed In");
      return;
    } else {
      signIn("google");
    }
  };

  useEffect(() => {
    async function fetchPopularPosts() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/featured`
        );
        if (!response.ok) throw new Error("Failed to fetch featured posts");
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching popular posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPopularPosts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col w-full items-center">
      <HeroSection />

      <main className="flex-1">
        {/* Featured Posts Section */}
        <section className="px-4 py-20 md:py-32">
          <FeaturedPosts posts={posts} />
          <div className="flex justify-center mt-12">
            <Button
              size="lg"
              className="rounded-full px-8 shadow-lg shadow-primary/20 transition-transform hover:translate-y-[-2px]"
              asChild
            >
              <Link href="/blog">
                View All Posts <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20 bg-muted/30">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] z-0"></div>
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>

          <div className="container px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our platform provides all the tools you need to create, grow,
                and monetize your blog.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-background/70 backdrop-blur-sm border-2 border-border/50 hover:border-primary/20 transition-all hover:shadow-xl group">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Edit className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Create & Publish</CardTitle>
                  <CardDescription className="text-base">
                    Write and publish your thoughts with our intuitive editor.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our rich text editor makes it easy to format your posts with
                    images, links, and more. Schedule posts, collaborate with
                    others, and publish across multiple platforms.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 mt-4 group-hover:text-primary transition-colors"
                    asChild
                  >
                    <Link href="/features/editor">
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-background/70 backdrop-blur-sm border-2 border-border/50 hover:border-primary/20 transition-all hover:shadow-xl group">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Engage & Connect</CardTitle>
                  <CardDescription className="text-base">
                    Build a community around your content.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Readers can comment on your posts, like your content, and
                    share it across social media. Build a loyal following with
                    our engagement tools and community features.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 mt-4 group-hover:text-primary transition-colors"
                    asChild
                  >
                    <Link href="/features/community">
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-background/70 backdrop-blur-sm border-2 border-border/50 hover:border-primary/20 transition-all hover:shadow-xl group">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Track & Analyze</CardTitle>
                  <CardDescription className="text-base">
                    Understand your audience with analytics.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get insights into post performance, reader demographics, and
                    engagement metrics. Use data to optimize your content
                    strategy and grow your audience.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 mt-4 group-hover:text-primary transition-colors"
                    asChild
                  >
                    <Link href="/features/analytics">
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        {/* <section className="container px-4 py-20 md:py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Content Creators
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of writers who trust our platform for their
              blogging needs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-muted/30 p-6 rounded-xl border border-border"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=48&width=48&text=User${i}`}
                      alt={`User ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">
                      Travel Blogger
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "This platform has transformed my blogging experience. The
                  tools are intuitive, the analytics are insightful, and my
                  audience engagement has increased by 200% since I switched."
                </p>
              </div>
            ))}
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="relative py-20 md:py-32 bg-muted/50 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] z-0"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 z-0"></div>
          <div className="container px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Ready to Start Your Blogging Journey?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join our community of writers and start sharing your ideas with
                the world today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/20 transition-transform hover:translate-y-[-2px]"
                  onClick={handleGetStarted}
                >
                  <span className="flex items-center">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg rounded-full border-2"
                  asChild
                >
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
