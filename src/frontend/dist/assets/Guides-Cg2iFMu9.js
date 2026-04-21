import { r as reactExports, j as jsxRuntimeExports, L as Layout, S as Skeleton, a as Link } from "./index-DAu_OpgI.js";
import { u as useListArticles, A as ArticleCategory } from "./useBackend-C2LF4Rc0.js";
const CATEGORY_LABELS = {
  [ArticleCategory.general]: "General",
  [ArticleCategory.nutrition]: "Nutrition",
  [ArticleCategory.lifestyle]: "Lifestyle",
  [ArticleCategory.stress]: "Stress & Wellness",
  [ArticleCategory.sexualHealth]: "Sexual Health",
  [ArticleCategory.reproductiveTesting]: "Reproductive Testing"
};
const CATEGORY_COLORS = {
  [ArticleCategory.general]: "bg-muted text-muted-foreground",
  [ArticleCategory.nutrition]: "bg-secondary/20 text-secondary-foreground",
  [ArticleCategory.lifestyle]: "bg-accent/20 text-accent-foreground",
  [ArticleCategory.stress]: "bg-primary/10 text-primary",
  [ArticleCategory.sexualHealth]: "bg-secondary/20 text-secondary-foreground",
  [ArticleCategory.reproductiveTesting]: "bg-primary/10 text-primary"
};
const FALLBACK_ARTICLES = [
  {
    id: "1",
    title: "Understanding Your Menstrual Cycle",
    category: ArticleCategory.general,
    summary: "A comprehensive guide to understanding the phases of your menstrual cycle and what they mean for fertility.",
    readTime: "5 min"
  },
  {
    id: "2",
    title: "Nutrition for Conception",
    category: ArticleCategory.nutrition,
    summary: "Key nutrients and dietary patterns that support reproductive health and improve fertility outcomes.",
    readTime: "7 min"
  },
  {
    id: "3",
    title: "Managing Stress During Fertility Planning",
    category: ArticleCategory.stress,
    summary: "Evidence-based strategies for reducing stress and supporting hormonal balance while planning pregnancy.",
    readTime: "6 min"
  },
  {
    id: "4",
    title: "Lifestyle Factors That Affect Fertility",
    category: ArticleCategory.lifestyle,
    summary: "How exercise, sleep, and daily habits influence your reproductive health and what you can change today.",
    readTime: "8 min"
  },
  {
    id: "5",
    title: "When to Consider Reproductive Testing",
    category: ArticleCategory.reproductiveTesting,
    summary: "A guide to understanding fertility testing options and when to discuss them with your healthcare provider.",
    readTime: "6 min"
  },
  {
    id: "6",
    title: "Sexual Health and Fertility Basics",
    category: ArticleCategory.sexualHealth,
    summary: "Foundational knowledge about sexual health and its relationship to reproductive success.",
    readTime: "5 min"
  }
];
function GuidesPage() {
  const { data: articles, isLoading } = useListArticles();
  const [activeCategory, setActiveCategory] = reactExports.useState(
    "all"
  );
  const displayArticles = articles && articles.length > 0 ? articles.map((a) => ({
    id: a.id.toString(),
    title: a.title,
    category: a.category,
    summary: `${a.content.slice(0, 140)}…`,
    readTime: `${Math.max(3, Math.floor(a.content.length / 800))} min`
  })) : FALLBACK_ARTICLES;
  const filtered = activeCategory === "all" ? displayArticles : displayArticles.filter((a) => a.category === activeCategory);
  const categories = Object.values(ArticleCategory);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border py-12 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl font-semibold text-foreground mb-3", children: "Health Guides" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-base max-w-xl", children: "Evidence-informed articles on reproductive health, fertility, and preconception care — reviewed by clinical specialists." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background border-b border-border sticky top-16 z-10 py-3 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl flex items-center gap-2 overflow-x-auto pb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setActiveCategory("all"),
          "data-ocid": "guides.filter_all_tab",
          className: `flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-smooth ${activeCategory === "all" ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`,
          children: "All Topics"
        }
      ),
      categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setActiveCategory(cat),
          "data-ocid": `guides.filter_${cat}_tab`,
          className: `flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-smooth ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`,
          children: CATEGORY_LABELS[cat]
        },
        cat
      ))
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 sm:px-6 lg:px-8 bg-background pt-8 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-6xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-secondary/40 bg-secondary/10 px-6 py-5 shadow-clinical",
        "data-ocid": "guides.plan_a_boy_callout",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl select-none", "aria-hidden": "true", children: "👶" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center sm:text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground mb-0.5", children: "Trying for a Boy?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-body text-muted-foreground leading-relaxed", children: [
              "Our clinically guided",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary-foreground font-medium", children: "Plan a Boy" }),
              " ",
              "programme offers couples a proven approach with a",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "99% success rate" }),
              " ",
              "— backed by science, personalised to you."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "/#plan-a-boy",
              "data-ocid": "guides.plan_a_boy_cta_button",
              className: "flex-shrink-0 inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-body font-medium transition-smooth hover:opacity-90 shadow-clinical",
              children: "Learn More →"
            }
          )
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-10 px-4 sm:px-6 lg:px-8 bg-background flex-1",
        "data-ocid": "guides.articles_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-6xl", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
            "data-ocid": "guides.loading_state",
            children: [1, 2, 3, 4, 5, 6].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-card border border-border rounded-lg p-5 space-y-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-full" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" })
                ]
              },
              n
            ))
          }
        ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-16", "data-ocid": "guides.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body", children: "No articles in this category yet." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
            "data-ocid": "guides.articles_list",
            children: filtered.map((article, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/guides/$id",
                params: { id: article.id },
                "data-ocid": `guides.article_card.${i + 1}`,
                className: "bg-card border border-border rounded-lg p-5 shadow-clinical hover:shadow-elevated transition-smooth flex flex-col gap-3 group",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-[11px] font-body font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[article.category]}`,
                        children: CATEGORY_LABELS[article.category]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-body", children: [
                      article.readTime,
                      " read"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-base group-hover:text-primary transition-smooth line-clamp-2", children: article.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body leading-relaxed line-clamp-3", children: article.summary }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-auto text-xs text-primary font-medium font-body", children: "Read more →" })
                ]
              },
              article.id
            ))
          }
        ) })
      }
    )
  ] });
}
export {
  GuidesPage
};
