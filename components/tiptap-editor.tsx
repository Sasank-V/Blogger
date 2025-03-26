"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Button } from "@/components/ui/button";

interface TipTapProps {
  initialContent: string;
  onChange: (content: string) => void;
}

export default function TiptapEditor({
  initialContent,
  onChange,
}: TipTapProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2">
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          Underline
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          Strike
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          Left
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          Center
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          Right
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().unsetTextAlign().run()}
        >
          Unset Align
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().setColor("#FF0000").run()}
        >
          Red
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().unsetColor().run()}
        >
          Reset Color
        </Button>
      </div>
      {/* Editor */}
      <div className="border border-gray-300 rounded p-4 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
