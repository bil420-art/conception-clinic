import { u as useParams, j as jsxRuntimeExports, L as Layout, a as Link, S as Skeleton } from "./index-DAu_OpgI.js";
import { B as Badge } from "./badge-CgnUsyW4.js";
import { a as useGetArticle, A as ArticleCategory } from "./useBackend-C2LF4Rc0.js";
import { A as ArrowLeft } from "./arrow-left-C7hZD_ms.js";
import { C as Calendar } from "./calendar-Bay2VeSc.js";
const CATEGORY_LABELS = {
  [ArticleCategory.general]: "General",
  [ArticleCategory.nutrition]: "Nutrition",
  [ArticleCategory.lifestyle]: "Lifestyle",
  [ArticleCategory.stress]: "Stress & Wellness",
  [ArticleCategory.sexualHealth]: "Sexual Health",
  [ArticleCategory.reproductiveTesting]: "Reproductive Testing"
};
const FALLBACK_CONTENT = {
  title: "Understanding Your Reproductive Health Journey",
  category: ArticleCategory.general,
  content: `Taking control of your reproductive health begins with understanding the basics. Whether you're just starting to think about family planning or have been on this journey for some time, knowledge is your most powerful tool.

**The Foundations of Preconception Health**

Preconception care encompasses the health interventions a person receives before and between pregnancies. These interventions aim to identify and modify biomedical, behavioral, and social risks to a woman's health or pregnancy outcome.

Key areas to focus on include:
- Nutritional optimization, particularly folic acid supplementation
- Managing chronic health conditions
- Reviewing medications for pregnancy safety
- Achieving a healthy weight
- Reducing exposure to environmental toxins

**When to Seek Professional Guidance**

If you've been trying to conceive for 12 months (or 6 months if over 35) without success, it's appropriate to consult a specialist. Early evaluation can identify treatable conditions and help personalize your path forward.

**A Note on Emotional Wellbeing**

The fertility journey can be emotionally challenging. It's important to acknowledge these feelings and seek support when needed. Our platform is here to provide evidence-based information and connect you with qualified specialists who approach your care with empathy and clinical expertise.`,
  publishedAt: (/* @__PURE__ */ new Date()).toISOString(),
  citations: [
    {
      authors: "Johnson K, et al.",
      title: "Recommendations to Improve Preconception Health and Health Care",
      source: "MMWR",
      year: 2006
    },
    {
      authors: "World Health Organization",
      title: "Preconception Care: Maximizing the Gains for Maternal and Child Health",
      source: "WHO",
      year: 2013
    }
  ]
};
function GuideDetailPage() {
  const { id } = useParams({ from: "/guides/$id" });
  const articleId = Number.isNaN(Number(id)) ? null : BigInt(id);
  const { data: article, isLoading } = useGetArticle(articleId);
  const display = article ? {
    title: article.title,
    category: article.category,
    content: article.content,
    publishedAt: new Date(
      Number(article.publishedAt) / 1e6
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }),
    citations: article.citations.map((c) => ({
      ...c,
      year: Number(c.year)
    }))
  } : {
    ...FALLBACK_CONTENT,
    publishedAt: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }),
    citations: FALLBACK_CONTENT.citations
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border py-8 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/guides",
          className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth mb-6 font-body",
          "data-ocid": "guide_detail.back_link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 }),
            "Back to Guides"
          ]
        }
      ),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs font-body", children: CATEGORY_LABELS[display.category] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl font-semibold text-foreground leading-tight", children: display.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground font-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 13 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Published ",
            display.publishedAt
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-background flex-1 py-10 px-4 sm:px-6 lg:px-8",
        "data-ocid": "guide_detail.content_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-3xl", children: [
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-ocid": "guide_detail.loading_state", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }, n)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose prose-sm max-w-none font-body text-foreground/90 leading-relaxed", children: display.content.split("\n\n").map((paragraph, i) => {
            const key = `para-${i}`;
            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h3",
                {
                  className: "font-display font-semibold text-foreground text-lg mt-6 mb-3",
                  children: paragraph.slice(2, -2)
                },
                key
              );
            }
            if (paragraph.startsWith("- ")) {
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "ul",
                {
                  className: "list-disc list-inside space-y-1.5 my-3 text-muted-foreground",
                  children: paragraph.split("\n").map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: item.replace(/^- /, "") }, item))
                },
                key
              );
            }
            return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-foreground/80", children: paragraph }, key);
          }) }),
          !isLoading && display.citations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mt-10 pt-6 border-t border-border",
              "data-ocid": "guide_detail.citations_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-semibold text-foreground text-sm mb-3", children: "References" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-2", children: display.citations.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    className: "text-xs text-muted-foreground font-body leading-relaxed",
                    children: [
                      c.authors,
                      " (",
                      c.year,
                      "). ",
                      c.title,
                      ". ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: c.source }),
                      "."
                    ]
                  },
                  `${c.authors}-${c.year}`
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 p-4 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground font-body leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground/70", children: "Educational Disclaimer:" }),
            " ",
            "This article is for informational purposes only and does not constitute medical advice. Please consult a qualified healthcare provider for guidance specific to your situation."
          ] })
        ] })
      }
    )
  ] });
}
export {
  GuideDetailPage
};
