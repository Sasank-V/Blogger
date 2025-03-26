import Link from "next/link";
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
import { getPosts } from "@/lib/data";

export default async function Home() {
  const posts = await getPosts({ featured: true, limit: 3 });

  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <main className="flex-1">
        <section className=" px-4 py-12 md:py-24 lg:py-32">
          <FeaturedPosts posts={posts} />
          <div className="flex justify-center mt-10">
            <Button asChild size="lg">
              <Link href="/blog">View All Posts</Link>
            </Button>
          </div>
        </section>

        <section className=" px-4 py-12 bg-muted/50">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Create & Publish</CardTitle>
                <CardDescription>
                  Write and publish your thoughts with our intuitive editor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our rich text editor makes it easy to format your posts with
                  images, links, and more.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Engage & Connect</CardTitle>
                <CardDescription>
                  Build a community around your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Readers can comment on your posts, like your content, and
                  share it across social media.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Track & Analyze</CardTitle>
                <CardDescription>
                  Understand your audience with analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Get insights into post performance, reader demographics, and
                  engagement metrics.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
