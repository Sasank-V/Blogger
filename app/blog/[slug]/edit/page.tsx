import type { Metadata } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getPostById, updatePost } from "@/lib/data";

interface EditBlogProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: EditBlogProps): Promise<Metadata> {
  const post = await getPostById(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `Edit: ${post.title}`,
    description: post.excerpt,
  };
}

export default function EditBlog({ params }: EditBlogProps) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      const fetchedPost = await getPostById(params.slug);
      if (fetchedPost) {
        setPost(fetchedPost);
        setTitle(fetchedPost.title);
        setContent(fetchedPost.content);
        setCategories(fetchedPost.categories);
      }
    }
    fetchPost();
  }, [params.slug]);

  const handleSave = async () => {
    setIsSaving(true);
    await updatePost(post.id, { title, content, categories });
    setIsSaving(false);
    router.push(`/blog/${post.id}`);
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="px-4 py-12">
      <article className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Edit Blog Post</h1>
        <div className="flex items-center gap-4 mb-6">
          <Avatar>
            <AvatarImage src={post.author.avatar} alt={post.author.username} />
            <AvatarFallback>{post.author.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.author.username}</p>
          </div>
        </div>

        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title"
          className="mb-4"
        />

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content here..."
          className="mb-4 min-h-[200px]"
        />

        <div className="flex gap-2 mb-4">
          {categories.map((category, index) => (
            <Badge key={index}>{category}</Badge>
          ))}
        </div>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </article>
    </div>
  );
}
