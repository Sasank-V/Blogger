"use client";
import { PostEditor } from "@/components/post-editor";

export default function NewPostPage() {
  return (
    <div className="px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      <PostEditor />
    </div>
  );
}
