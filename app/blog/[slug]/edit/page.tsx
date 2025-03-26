
"use client";

import React, { useEffect, useState, use } from "react";
import type { Metadata } from "next";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPostById, updatePost } from "@/lib/data";
import type { Post } from "@/lib/types";
import TiptapEditor from "@/components/tiptap-editor";

interface EditBlogProps {
  params: Promise<{ slug: string }>;
}

export default function EditBlog({ params }: EditBlogProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  // Unwrap the promise for params using React.use()
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      const fetchedPost = await getPostById(slug);
      if (fetchedPost) {
        // Check if the current user is the post's author.
        // Adjust this check based on your data structure.
        if (
          session &&
          session.user &&
          typeof fetchedPost.author === "object" &&
          fetchedPost.author._id !== session.user.id
        ) {
          router.push(`/blog/${fetchedPost._id}/view`);
          return;
        }
        setPost(fetchedPost);
        setTitle(fetchedPost.title);
        setContent(fetchedPost.content);
        setCategories(fetchedPost.categories);
      }
    }
    if (status !== "loading") {
      fetchPost();
    }
  }, [slug, session, status, router]);

  const handleSave = async () => {
    if (!post) return;
    setIsSaving(true);
    try {
      // Send the updated data via the PATCH route
      await updatePost(post._id, { title, content, categories });
      router.push(`/blog/${post._id}/view`);
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="px-4 py-12">
      <article className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Edit Blog Post</h1>
        <div className="flex items-center gap-4 mb-6">
          <Avatar>
            <AvatarImage src={post.author.avatar} alt={post.author.username} />
            <AvatarFallback>
              {typeof post.author === "object"
                ? post.author.username.charAt(0)
                : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {typeof post.author === "object" ? post.author.username : "User"}
            </p>
          </div>
        </div>

        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title"
          className="mb-4"
        />

        <div className="mb-4">
          <TiptapEditor
            initialContent={content}
            onChange={(data) => setContent(data)}
          />
        </div>

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
