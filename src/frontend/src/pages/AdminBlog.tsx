import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateBlogPost,
  useDeleteBlogPost,
  useListAllBlogPosts,
  useUpdateBlogPost,
} from "@/hooks/useBackend";
import { BlogPostStatus } from "@/types";
import type { BlogPostPublic, CreateBlogPostRequest } from "@/types";
import { loadConfig } from "@caffeineai/core-infrastructure";
import { StorageClient } from "@caffeineai/object-storage";
import { HttpAgent } from "@icp-sdk/core/agent";
import {
  ImageIcon,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ADMIN_PASSWORD = "ConceptionAdmin2024";
const SESSION_KEY = "admin_blog_auth";

// ── Password Gate ──────────────────────────────────────────────────────────────

function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      onAuth();
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-xl p-8 shadow-clinical">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h1 className="font-display text-xl font-semibold text-foreground">
              Blog Admin
            </h1>
            <p className="text-sm text-muted-foreground font-body mt-1">
              Enter your admin password to continue
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="font-body text-sm">
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter admin password"
                autoFocus
                data-ocid="admin.password_input"
              />
              {error && (
                <p
                  className="text-xs text-destructive font-body"
                  data-ocid="admin.password_error"
                >
                  {error}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              data-ocid="admin.login_button"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Post Form ──────────────────────────────────────────────────────────────────

interface PostFormState {
  title: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  published: boolean;
}

const emptyForm: PostFormState = {
  title: "",
  excerpt: "",
  content: "",
  featuredImageUrl: "",
  published: false,
};

function fromPost(post: BlogPostPublic): PostFormState {
  return {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    featuredImageUrl: post.featuredImageUrl ?? "",
    published: post.status === BlogPostStatus.published,
  };
}

interface PostFormProps {
  open: boolean;
  editPost: BlogPostPublic | null;
  onClose: () => void;
}

function PostFormDialog({ open, editPost, onClose }: PostFormProps) {
  const [form, setForm] = useState<PostFormState>(emptyForm);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();

  const isEdit = editPost !== null;
  const isPending = createPost.isPending || updatePost.isPending;

  useEffect(() => {
    if (open) {
      if (editPost) {
        const state = fromPost(editPost);
        setForm(state);
        setImagePreview(state.featuredImageUrl);
      } else {
        setForm(emptyForm);
        setImagePreview("");
      }
    }
  }, [open, editPost]);

  const handleField = useCallback(
    (field: keyof PostFormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
      },
    [],
  );

  async function handleImageFile(file: File) {
    setImageUploading(true);
    // Show a local blob preview while upload is in progress
    const localPreviewUrl = URL.createObjectURL(file);
    setImagePreview(localPreviewUrl);
    try {
      const config = await loadConfig();
      const agent = new HttpAgent({ host: config.backend_host });
      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {});
      }
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes);
      const publicUrl = await storageClient.getDirectURL(hash);
      URL.revokeObjectURL(localPreviewUrl);
      setImagePreview(publicUrl);
      setForm((prev) => ({ ...prev, featuredImageUrl: publicUrl }));
    } catch {
      URL.revokeObjectURL(localPreviewUrl);
      toast.error("Failed to upload image. Please try again.");
      setImagePreview("");
      setForm((prev) => ({ ...prev, featuredImageUrl: "" }));
    } finally {
      setImageUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) handleImageFile(file);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    const status = form.published
      ? BlogPostStatus.published
      : BlogPostStatus.draft;
    const imageUrl = form.featuredImageUrl.trim() || undefined;

    try {
      if (isEdit && editPost) {
        await updatePost.mutateAsync({
          id: editPost.id,
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          status,
          featuredImageUrl: imageUrl,
        });
        toast.success("Post updated successfully");
      } else {
        const req: CreateBlogPostRequest = {
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          status,
          featuredImageUrl: imageUrl,
        };
        await createPost.mutateAsync(req);
        toast.success("Post created successfully");
      }
      onClose();
    } catch {
      toast.error("Failed to save post. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="admin.post_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {isEdit ? "Edit Post" : "New Post"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="post-title" className="font-body text-sm">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="post-title"
              value={form.title}
              onChange={handleField("title")}
              placeholder="Post title"
              data-ocid="admin.post_title_input"
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <Label htmlFor="post-excerpt" className="font-body text-sm">
              Excerpt
            </Label>
            <Textarea
              id="post-excerpt"
              value={form.excerpt}
              onChange={handleField("excerpt")}
              placeholder="Short summary shown in post listings…"
              rows={2}
              data-ocid="admin.post_excerpt_textarea"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label htmlFor="post-content" className="font-body text-sm">
              Content
            </Label>
            <Textarea
              id="post-content"
              value={form.content}
              onChange={handleField("content")}
              placeholder="Write your article content here…"
              rows={8}
              data-ocid="admin.post_content_textarea"
            />
          </div>

          {/* Featured Photo */}
          <div className="space-y-1.5">
            <Label className="font-body text-sm">Featured Photo</Label>
            <button
              type="button"
              className="w-full border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-smooth bg-muted/20"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload featured photo"
              data-ocid="admin.post_image_dropzone"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                data-ocid="admin.post_image_upload_button"
              />
              {imageUploading ? (
                <div className="flex items-center justify-center gap-2 py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground font-body">
                    Processing…
                  </span>
                </div>
              ) : imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Selected featured post hero"
                    className="max-h-48 mx-auto rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview("");
                      setForm((prev) => ({ ...prev, featuredImageUrl: "" }));
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 p-1 bg-card rounded-full border border-border shadow-clinical hover:bg-muted transition-smooth"
                    aria-label="Remove selected photo"
                    data-ocid="admin.post_image_remove_button"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <p className="text-xs text-muted-foreground mt-2 font-body">
                    Click to replace
                  </p>
                </div>
              ) : (
                <div className="py-4 space-y-2">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground font-body">
                    Drop a file here or{" "}
                    <span className="text-primary underline">
                      click to upload
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    PNG, JPG, WEBP up to 10 MB
                  </p>
                </div>
              )}
            </button>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center gap-3 pt-1">
            <Switch
              id="post-published"
              checked={form.published}
              onCheckedChange={(v) =>
                setForm((prev) => ({ ...prev, published: v }))
              }
              data-ocid="admin.post_publish_toggle"
            />
            <Label
              htmlFor="post-published"
              className="font-body text-sm cursor-pointer"
            >
              {form.published ? "Published" : "Save as Draft"}
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin.post_cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            data-ocid="admin.post_save_button"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating…" : "Creating…"}
              </>
            ) : isEdit ? (
              "Update Post"
            ) : (
              "Create Post"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete Confirm ─────────────────────────────────────────────────────────────

function DeleteDialog({
  post,
  onClose,
}: {
  post: BlogPostPublic | null;
  onClose: () => void;
}) {
  const deletePost = useDeleteBlogPost();

  async function handleDelete() {
    if (!post) return;
    try {
      await deletePost.mutateAsync(post.id);
      toast.success("Post deleted");
      onClose();
    } catch {
      toast.error("Failed to delete post");
    }
  }

  return (
    <Dialog open={!!post} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md" data-ocid="admin.delete_dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Delete Post
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground font-body py-2">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-foreground">"{post?.title}"</span>
          ? This action cannot be undone.
        </p>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin.delete_cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deletePost.isPending}
            data-ocid="admin.delete_confirm_button"
          >
            {deletePost.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete Post"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Admin Dashboard ────────────────────────────────────────────────────────────

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { data: posts, isLoading } = useListAllBlogPosts();
  const [formOpen, setFormOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPostPublic | null>(null);
  const [deletePost, setDeletePost] = useState<BlogPostPublic | null>(null);

  function openNewPost() {
    setEditPost(null);
    setFormOpen(true);
  }

  function openEditPost(post: BlogPostPublic) {
    setEditPost(post);
    setFormOpen(true);
  }

  function formatDate(ts: bigint) {
    return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-clinical sticky top-0 z-10">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-semibold text-foreground">
              Blog Admin
            </h1>
            <p className="text-xs text-muted-foreground font-body">
              Conception Clinic · Content Management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={openNewPost}
              className="gap-2"
              data-ocid="admin.new_post_button"
            >
              <Plus className="h-4 w-4" />
              New Post
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              aria-label="Logout"
              data-ocid="admin.logout_button"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-3" data-ocid="admin.posts_loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          <div
            className="text-center py-20 bg-card border border-dashed border-border rounded-xl"
            data-ocid="admin.posts_empty_state"
          >
            <p className="text-4xl mb-3">📝</p>
            <h2 className="font-display text-lg font-semibold text-foreground mb-1">
              No posts yet
            </h2>
            <p className="text-muted-foreground text-sm font-body mb-4">
              Create your first blog post to get started.
            </p>
            <Button
              onClick={openNewPost}
              data-ocid="admin.empty_new_post_button"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block bg-card border border-border rounded-xl overflow-hidden shadow-clinical">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="font-body font-semibold text-foreground w-full">
                      Title
                    </TableHead>
                    <TableHead className="font-body font-semibold text-foreground whitespace-nowrap">
                      Status
                    </TableHead>
                    <TableHead className="font-body font-semibold text-foreground whitespace-nowrap">
                      Date
                    </TableHead>
                    <TableHead className="font-body font-semibold text-foreground w-24 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post, i) => (
                    <TableRow
                      key={post.id.toString()}
                      className="group hover:bg-muted/20 transition-smooth"
                      data-ocid={`admin.post_row.${i + 1}`}
                    >
                      <TableCell className="font-body">
                        <div className="flex items-center gap-3">
                          {post.featuredImageUrl && (
                            <img
                              src={post.featuredImageUrl}
                              alt=""
                              className="w-8 h-8 rounded object-cover shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {post.title}
                            </p>
                            {post.excerpt && (
                              <p className="text-xs text-muted-foreground truncate max-w-xs">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            post.status === BlogPostStatus.published
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                          data-ocid={`admin.post_status.${i + 1}`}
                        >
                          {post.status === BlogPostStatus.published
                            ? "Published"
                            : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-body whitespace-nowrap">
                        {formatDate(post.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditPost(post)}
                            aria-label="Edit post"
                            data-ocid={`admin.post_edit_button.${i + 1}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeletePost(post)}
                            aria-label="Delete post"
                            data-ocid={`admin.post_delete_button.${i + 1}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
              {posts.map((post, i) => (
                <div
                  key={post.id.toString()}
                  className="bg-card border border-border rounded-xl p-4 shadow-clinical"
                  data-ocid={`admin.post_card.${i + 1}`}
                >
                  <div className="flex items-start gap-3">
                    {post.featuredImageUrl && (
                      <img
                        src={post.featuredImageUrl}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-medium text-sm text-foreground truncate">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            post.status === BlogPostStatus.published
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {post.status === BlogPostStatus.published
                            ? "Published"
                            : "Draft"}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-body">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => openEditPost(post)}
                      data-ocid={`admin.post_mobile_edit_button.${i + 1}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => setDeletePost(post)}
                      data-ocid={`admin.post_mobile_delete_button.${i + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Dialogs */}
      <PostFormDialog
        open={formOpen}
        editPost={editPost}
        onClose={() => setFormOpen(false)}
      />
      <DeleteDialog post={deletePost} onClose={() => setDeletePost(null)} />
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export function AdminBlogPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true",
  );

  function handleAuth() {
    setIsAuthenticated(true);
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return <PasswordGate onAuth={handleAuth} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
