import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBlogPost } from "@/hooks/useBackend";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function readTime(content: string): string {
  return `${Math.max(2, Math.floor(content.length / 900))} min read`;
}

function ContentRenderer({ content }: { content: string }) {
  return (
    <div className="font-body text-foreground/90 leading-relaxed space-y-4">
      {content.split("\n\n").map((block, i) => {
        const key = `block-${i}`;
        if (block.startsWith("## ")) {
          return (
            <h2
              key={key}
              className="font-display font-semibold text-foreground text-2xl mt-8 mb-3"
            >
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith("### ")) {
          return (
            <h3
              key={key}
              className="font-display font-semibold text-foreground text-lg mt-6 mb-2"
            >
              {block.slice(4)}
            </h3>
          );
        }
        if (block.startsWith("**") && block.endsWith("**")) {
          return (
            <h3
              key={key}
              className="font-display font-semibold text-foreground text-lg mt-6 mb-2"
            >
              {block.slice(2, -2)}
            </h3>
          );
        }
        if (block.startsWith("- ")) {
          return (
            <ul
              key={key}
              className="list-disc list-inside space-y-1.5 text-muted-foreground"
            >
              {block.split("\n").map((item) => (
                <li key={item}>{item.replace(/^- /, "")}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={key} className="text-foreground/80">
            {block}
          </p>
        );
      })}
    </div>
  );
}

export function BlogDetailPage() {
  const { id } = useParams({ from: "/blog/$id" });
  const postId = Number.isNaN(Number(id)) ? null : BigInt(id);
  const { data: post, isLoading, isError } = useGetBlogPost(postId);

  return (
    <Layout>
      {/* Hero / header */}
      <section className="bg-card border-b border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth mb-6 font-body"
            data-ocid="blog_detail.back_link"
          >
            <ArrowLeft size={14} />
            Back to Blog
          </Link>

          {isLoading ? (
            <div className="space-y-3" data-ocid="blog_detail.loading_state">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-48" />
            </div>
          ) : isError || !post ? (
            <div
              className="text-center py-10"
              data-ocid="blog_detail.error_state"
            >
              <p className="font-display font-semibold text-foreground text-lg">
                Post not found
              </p>
              <p className="text-muted-foreground font-body text-sm mt-1">
                This article may have been removed or the link is incorrect.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
                {post.title}
              </h1>
              <p className="text-muted-foreground font-body text-base leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-body pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} />
                  <span>{readTime(post.content)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured image */}
      {!isLoading && post?.featuredImageUrl && (
        <div className="w-full bg-muted" data-ocid="blog_detail.hero_image">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
            <img
              src={post.featuredImageUrl}
              alt={post.title}
              className="w-full rounded-xl object-cover max-h-96 shadow-elevated"
            />
          </div>
        </div>
      )}

      {/* Article content */}
      <section
        className="flex-1 bg-background py-10 px-4 sm:px-6 lg:px-8"
        data-ocid="blog_detail.content_section"
      >
        <div className="container mx-auto max-w-3xl">
          {isLoading ? (
            <div className="space-y-4" data-ocid="blog_detail.loading_state">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Skeleton key={n} className="h-4 w-full" />
              ))}
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : post ? (
            <>
              <ContentRenderer content={post.content} />

              {/* Disclaimer */}
              <div className="mt-10 p-4 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground font-body leading-relaxed">
                <strong className="text-foreground/70">
                  Educational Disclaimer:
                </strong>{" "}
                This article is for informational purposes only and does not
                constitute medical advice. Please consult a qualified healthcare
                provider for guidance specific to your situation.
              </div>

              {/* Back link */}
              <div className="mt-10 pt-6 border-t border-border">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-smooth font-body font-medium"
                  data-ocid="blog_detail.back_to_blog_link"
                >
                  <ArrowLeft size={14} />
                  Back to Blog
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </section>
    </Layout>
  );
}
