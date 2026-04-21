import { u as useParams, j as jsxRuntimeExports, L as Layout, a as Link, S as Skeleton } from "./index-DAu_OpgI.js";
import { l as useGetBlogPost } from "./useBackend-C2LF4Rc0.js";
import { A as ArrowLeft } from "./arrow-left-C7hZD_ms.js";
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
function ContentRenderer({ content }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-body text-foreground/90 leading-relaxed space-y-4", children: content.split("\n\n").map((block, i) => {
    const key = `block-${i}`;
    if (block.startsWith("## ")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h2",
        {
          className: "font-display font-semibold text-foreground text-2xl mt-8 mb-3",
          children: block.slice(3)
        },
        key
      );
    }
    if (block.startsWith("### ")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h3",
        {
          className: "font-display font-semibold text-foreground text-lg mt-6 mb-2",
          children: block.slice(4)
        },
        key
      );
    }
    if (block.startsWith("**") && block.endsWith("**")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h3",
        {
          className: "font-display font-semibold text-foreground text-lg mt-6 mb-2",
          children: block.slice(2, -2)
        },
        key
      );
    }
    if (block.startsWith("- ")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "ul",
        {
          className: "list-disc list-inside space-y-1.5 text-muted-foreground",
          children: block.split("\n").map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: item.replace(/^- /, "") }, item))
        },
        key
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/80", children: block }, key);
  }) });
}
function BlogDetailPage() {
  const { id } = useParams({ from: "/blog/$id" });
  const postId = Number.isNaN(Number(id)) ? null : BigInt(id);
  const { data: post, isLoading, isError } = useGetBlogPost(postId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border py-8 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/blog",
          className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth mb-6 font-body",
          "data-ocid": "blog_detail.back_link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 }),
            "Back to Blog"
          ]
        }
      ),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "blog_detail.loading_state", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48" })
      ] }) : isError || !post ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-10",
          "data-ocid": "blog_detail.error_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-lg", children: "Post not found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm mt-1", children: "This article may have been removed or the link is incorrect." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl font-semibold text-foreground leading-tight", children: post.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-base leading-relaxed", children: post.excerpt }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-body pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 13 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(post.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 13 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: readTime(post.content) })
          ] })
        ] })
      ] })
    ] }) }),
    !isLoading && (post == null ? void 0 : post.featuredImageUrl) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-muted", "data-ocid": "blog_detail.hero_image", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: post.featuredImageUrl,
        alt: post.title,
        className: "w-full rounded-xl object-cover max-h-96 shadow-elevated"
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "flex-1 bg-background py-10 px-4 sm:px-6 lg:px-8",
        "data-ocid": "blog_detail.content_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-3xl", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "blog_detail.loading_state", children: [
          [1, 2, 3, 4, 5, 6].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }, n)),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-2/3" })
        ] }) : post ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ContentRenderer, { content: post.content }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 p-4 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground font-body leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground/70", children: "Educational Disclaimer:" }),
            " ",
            "This article is for informational purposes only and does not constitute medical advice. Please consult a qualified healthcare provider for guidance specific to your situation."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 pt-6 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/blog",
              className: "inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-smooth font-body font-medium",
              "data-ocid": "blog_detail.back_to_blog_link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 }),
                "Back to Blog"
              ]
            }
          ) })
        ] }) : null })
      }
    )
  ] });
}
export {
  BlogDetailPage
};
