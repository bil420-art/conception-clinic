import { j as jsxRuntimeExports, L as Layout, S as Skeleton, a as Link } from "./index-DAu_OpgI.js";
import { k as useListPublishedBlogPosts } from "./useBackend-C2LF4Rc0.js";
import { C as Calendar } from "./calendar-Bay2VeSc.js";
import { C as Clock } from "./clock-BIeCU2FF.js";
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function readTime(content) {
  return `${Math.max(2, Math.floor(content.length / 900))} min read`;
}
function BlogCard({
  post,
  index
}) {
  const id = post.id.toString();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/blog/$id",
      params: { id },
      "data-ocid": `blog.post_card.${index + 1}`,
      className: "group bg-card border border-border rounded-xl overflow-hidden shadow-clinical hover:shadow-elevated transition-smooth flex flex-col",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-44 bg-muted overflow-hidden", children: post.featuredImageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: post.featuredImageUrl,
            alt: post.title,
            className: "w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            viewBox: "0 0 80 80",
            className: "w-16 h-16 text-primary/30",
            fill: "currentColor",
            "aria-hidden": "true",
            role: "img",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Blog post placeholder" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M40 10C23.4 10 10 23.4 10 40s13.4 30 30 30 30-13.4 30-30S56.6 10 40 10zm-4 46v-4H24v-8h12v-4l10 8-10 8zm4-24l-10-8 10-8v4h12v8H40v4z" })
            ]
          }
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 p-5 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-base leading-snug line-clamp-2 group-hover:text-primary transition-smooth", children: post.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body leading-relaxed line-clamp-3 flex-1", children: post.excerpt }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1 border-t border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground font-body", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(post.createdAt) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground font-body", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: readTime(post.content) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-primary font-medium font-body mt-1", children: "Read more →" })
        ] })
      ]
    }
  );
}
function BlogCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 w-full rounded-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-5/6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/3" })
    ] })
  ] });
}
function BlogPage() {
  const { data: posts, isLoading } = useListPublishedBlogPosts();
  const sorted = posts ? [...posts].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-6xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary font-body text-sm font-medium mb-1 uppercase tracking-widest", children: "Clinic Journal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl font-semibold text-foreground mb-3", children: "Blog & Tips" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-base max-w-xl", children: "Expert insights, fertility tips, and clinic updates — published regularly by our care team." })
      ] }),
      !isLoading && sorted.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "hidden sm:block text-sm text-muted-foreground font-body", children: [
        sorted.length,
        " ",
        sorted.length === 1 ? "post" : "posts"
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-background",
        "data-ocid": "blog.posts_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-6xl", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
            "data-ocid": "blog.loading_state",
            children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(BlogCardSkeleton, {}, n))
          }
        ) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-24 gap-4 text-center",
            "data-ocid": "blog.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  viewBox: "0 0 24 24",
                  className: "w-8 h-8 text-primary/60",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "1.5",
                  "aria-hidden": "true",
                  role: "img",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "No posts yet" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      }
                    )
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-lg", children: "No posts yet — check back soon!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm mt-1 max-w-sm", children: "Our team is preparing expert articles and fertility tips. Come back soon for our first post." })
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
            "data-ocid": "blog.posts_list",
            children: sorted.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(BlogCard, { post, index: i }, post.id.toString()))
          }
        ) })
      }
    )
  ] });
}
export {
  BlogPage
};
