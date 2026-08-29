import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Heading1, Heading2, Italic, Link2, List, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const [hasContent, setHasContent] = useState(Boolean(value));
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-56 px-4 py-3 text-sm leading-7 outline-none",
        "aria-label": "Page content",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML();
      setHasContent(html !== "<p></p>");
      onChange(html);
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && value !== "") editor.commands.setContent(value, { emitUpdate: false });
    if (value === "" && current !== "<p></p>") editor.commands.clearContent();
    setHasContent(Boolean(value));
  }, [editor, value]);

  function addLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url.trim() }).run();
  }

  const controls = [
    { label: "Bold", Icon: Bold, active: editor?.isActive("bold"), onClick: () => editor?.chain().focus().toggleBold().run() },
    { label: "Italic", Icon: Italic, active: editor?.isActive("italic"), onClick: () => editor?.chain().focus().toggleItalic().run() },
    { label: "Heading 1", Icon: Heading1, active: editor?.isActive("heading", { level: 1 }), onClick: () => editor?.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: "Heading 2", Icon: Heading2, active: editor?.isActive("heading", { level: 2 }), onClick: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Bulleted list", Icon: List, active: editor?.isActive("bulletList"), onClick: () => editor?.chain().focus().toggleBulletList().run() },
    { label: "Numbered list", Icon: ListOrdered, active: editor?.isActive("orderedList"), onClick: () => editor?.chain().focus().toggleOrderedList().run() },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-input bg-background shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-2">
        {controls.map(({ label, Icon, active, onClick }) => (
          <Button
            key={label}
            type="button"
            variant={active ? "secondary" : "ghost"}
            size="icon"
            aria-label={label}
            aria-pressed={active}
            onClick={onClick}
            disabled={!editor}
          >
            <Icon aria-hidden="true" />
          </Button>
        ))}
        <Button
          type="button"
          variant={editor?.isActive("link") ? "secondary" : "ghost"}
          size="icon"
          aria-label="Add link"
          onClick={addLink}
          disabled={!editor}
        >
          <Link2 aria-hidden="true" />
        </Button>
      </div>
      <div className="relative">
        <EditorContent editor={editor} />
        {!hasContent && <span className="pointer-events-none absolute left-4 top-3 text-sm text-muted-foreground">{placeholder}</span>}
      </div>
    </div>
  );
}