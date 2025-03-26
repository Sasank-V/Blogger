"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export function PostEditor() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    customCategory: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
      customCategory: value === "custom" ? prev.customCategory : "",
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent,
    status: "draft" | "published"
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get category from user input or default
    const finalCategory =
      formData.category === "custom"
        ? formData.customCategory
        : formData.category;

    if (!session?.user.id) {
      toast.warn("Sign in to create blogs");
      setIsSubmitting(false);
      return;
    }

    // Convert DraftJS editor content to HTML
    const contentHTML = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    // Prepare post data
    const postData = {
      title: formData.title,
      content: contentHTML, // HTML content
      author: session.user.id, // User ID
      categories: [finalCategory],
      tags: formData.tags.split(",").map((tag) => tag.trim()),
<<<<<<< HEAD
<<<<<<< HEAD
      images: [formData.coverImage],
      isPublished: status === "published" ? true : false,
=======
      images: formData.coverImage ? [formData.coverImage] : [], // Array of images
      isPublished: status === "published",
>>>>>>> 494c3ecefe62217bc8bcd76e4d9954d65be71322
=======

      images: formData.coverImage ? [formData.coverImage] : [], // Array of images
      isPublished: status === "published",
>>>>>>> 746348e26f9de2d1e8e86f68b24c3da2f2f85f35
    };

    try {
      // Save draft to local storage (always do this for drafts)
      if (status === "draft") {
<<<<<<< HEAD
<<<<<<< HEAD
        const draftData = {
          ...postData,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(
          `draft-${session.user.id}`,
          JSON.stringify(draftData)
        );
=======
=======

>>>>>>> 746348e26f9de2d1e8e86f68b24c3da2f2f85f35
        if (!navigator.onLine) {
          // Save draft locally
          const draftData = {
            ...postData,
            savedAt: new Date().toISOString(),
          };
          localStorage.setItem(
            `draft-${session.user.id}`,
            JSON.stringify(draftData)
          );
          toast.success("Draft saved offline successfully!");
          router.push("/dashboard");
        } else {
          toast.warn("You must be offline to save a draft.");
        }
      } else {
        // Save as published
        const response = await fetch("/api/post/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          throw new Error("Failed to save post");
        }

        toast.success("Post published successfully!");
        router.push("/dashboard");
<<<<<<< HEAD
>>>>>>> 494c3ecefe62217bc8bcd76e4d9954d65be71322
=======
>>>>>>> 746348e26f9de2d1e8e86f68b24c3da2f2f85f35
      }

      // Send the post data to the API
      const response = await fetch("/api/post/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      toast.success(
        status === "published"
          ? "Post published successfully!"
          : "Draft saved successfully!"
      );
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save your post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
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
                {predefinedCategories.map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </SelectItem>
                ))}
                <SelectItem value="custom">+ Add New Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.category === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customCategory">New Category</Label>
              <Input
                id="customCategory"
                name="customCategory"
                placeholder="Enter custom category"
                value={formData.customCategory}
                onChange={handleChange}
                required
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
              <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={onEditorStateChange}
                toolbarClassName="rdw-editor-toolbar"
                editorStyle={{
                  height: "300px",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#1a1a1a",
                  color: "#fff",
                  border: "1px solid #2e2e2e",
                }}
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
