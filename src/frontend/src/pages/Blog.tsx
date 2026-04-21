import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useListPublishedBlogPosts } from "@/hooks/useBackend";
import type { BlogPostPublic } from "@/types";
import { Link } from "@tanstack/react-router";
import { Calendar, Clock } from "lucide-react";

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

function BlogCard({
  post,
  index,
}: {
  post: BlogPostPublic;
  index: number;
}) {
  const id = post.id.toString();
  return (
    <Link
      to="/blog/$id"
      params={{ id }}
      data-ocid={`blog.post_card.${index + 1}`}
      className="group bg-card border border-border rounded-xl overflow-hidden shadow-clinical hover:shadow-elevated transition-smooth flex flex-col"
    >
      {/* Featured image */}
      <div className="relative h-44 bg-muted overflow-hidden">
        {post.featuredImageUrl ? (
          <img
            src={post.featuredImageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <svg
              viewBox="0 0 80 80"
              className="w-16 h-16 text-primary/30"
              fill="currentColor"
              aria-hidden="true"
              role="img"
            >
              <title>Blog post placeholder</title>
              <path d="M40 10C23.4 10 10 23.4 10 40s13.4 30 30 30 30-13.4 30-30S56.6 10 40 10zm-4 46v-4H24v-8h12v-4l10 8-10 8zm4-24l-10-8 10-8v4h12v8H40v4z" />
            </svg>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h2 className="font-display font-semibold text-foreground text-base leading-snug line-clamp-2 group-hover:text-primary transition-smooth">
          {post.title}
        </h2>
        <p className="text-muted-foreground text-sm font-body leading-relaxed line-clamp-3 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-1 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
            <Calendar size={12} />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
            <Clock size={12} />
            <span>{readTime(post.content)}</span>
          </div>
        </div>
        <span className="text-xs text-primary font-medium font-body mt-1">
          Read more →
        </span>
      </div>
    </Link>
  );
}

function BlogCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function BlogPage() {
  const { data: posts, isLoading } = useListPublishedBlogPosts();

  const sorted = posts
    ? [...posts].sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    : [];

  return (
    <Layout>
      {/* Page header */}
      <section className="bg-card border-b border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-primary font-body text-sm font-medium mb-1 uppercase tracking-widest">
                Clinic Journal
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-3">
                Blog &amp; Tips
              </h1>
              <p className="text-muted-foreground font-body text-base max-w-xl">
                Expert insights, fertility tips, and clinic updates — published
                regularly by our care team.
              </p>
            </div>
            {!isLoading && sorted.length > 0 && (
              <p className="hidden sm:block text-sm text-muted-foreground font-body">
                {sorted.length} {sorted.length === 1 ? "post" : "posts"}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section
        className="flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-background"
        data-ocid="blog.posts_section"
      >
        <div className="container mx-auto max-w-6xl">
          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="blog.loading_state"
            >
              {[1, 2, 3].map((n) => (
                <BlogCardSkeleton key={n} />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-24 gap-4 text-center"
              data-ocid="blog.empty_state"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-primary/60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                  role="img"
                >
                  <title>No posts yet</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <p className="font-display font-semibold text-foreground text-lg">
                  No posts yet — check back soon!
                </p>
                <p className="text-muted-foreground font-body text-sm mt-1 max-w-sm">
                  Our team is preparing expert articles and fertility tips. Come
                  back soon for our first post.
                </p>
              </div>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="blog.posts_list"
            >
              {sorted.map((post, i) => (
                <BlogCard key={post.id.toString()} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
