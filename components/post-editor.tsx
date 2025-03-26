"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import TiptapEditor from "@/components/tiptap-editor";
import { useSession } from "next-auth/react";

export function PostEditor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    customCategory: "", // New field for custom category
    tags: "",
    coverImage: "",
  });

  const predefinedCategories = [
    "Technology",
    "Lifestyle",
    "Travel",
    "Food",
    "Health",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
      customCategory: value === "custom" ? prev.customCategory : "", // Reset if not custom
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent,
    status: "draft" | "published"
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalCategory =
      formData.category === "custom"
        ? formData.customCategory
        : formData.category;

    try {
      if (!session?.user.id) {
        toast.warn("Signin to Creat Blogs");
        return;
      }
      const response = await fetch("/api/post/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          author: session?.user.id,
          categories: [finalCategory], // Send the final category (predefined or custom)
          tags: formData.tags.split(",").map((tag) => tag.trim()),
          images: [formData.coverImage],
          isPublished: status === "published",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      toast.success(
        status === "published" ? "Post published successfully!" : "Draft saved!"
      );
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Failed to save your post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8">
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter post title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            placeholder="Brief summary of your post"
            value={formData.excerpt}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {predefinedCategories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
                <SelectItem value="custom">+ Add New Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Category Input (Only Show When "Custom" is Selected) */}
          {formData.category === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customCategory">New Category</Label>
              <Input
                id="customCategory"
                name="customCategory"
                placeholder="Enter custom category"
                value={formData.customCategory}
                onChange={handleChange}
                required={formData.category === "custom"}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="Enter tags separated by commas"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input
            id="coverImage"
            name="coverImage"
            placeholder="Enter image URL"
            value={formData.coverImage}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Card>
            <CardContent className="p-4">
              <TiptapEditor
                initialContent={formData.content}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, content }))
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={(e) => handleSubmit(e, "draft")}
          disabled={isSubmitting}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          onClick={(e) => handleSubmit(e, "published")}
          disabled={isSubmitting}
        >
          Publish
        </Button>
      </div>
    </form>
  );
}
