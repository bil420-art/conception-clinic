import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useListArticles } from "@/hooks/useBackend";
import { ArticleCategory } from "@/types";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  [ArticleCategory.general]: "General",
  [ArticleCategory.nutrition]: "Nutrition",
  [ArticleCategory.lifestyle]: "Lifestyle",
  [ArticleCategory.stress]: "Stress & Wellness",
  [ArticleCategory.sexualHealth]: "Sexual Health",
  [ArticleCategory.reproductiveTesting]: "Reproductive Testing",
};

const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  [ArticleCategory.general]: "bg-muted text-muted-foreground",
  [ArticleCategory.nutrition]: "bg-secondary/20 text-secondary-foreground",
  [ArticleCategory.lifestyle]: "bg-accent/20 text-accent-foreground",
  [ArticleCategory.stress]: "bg-primary/10 text-primary",
  [ArticleCategory.sexualHealth]: "bg-secondary/20 text-secondary-foreground",
  [ArticleCategory.reproductiveTesting]: "bg-primary/10 text-primary",
};

const FALLBACK_ARTICLES = [
  {
    id: "1",
    title: "Understanding Your Menstrual Cycle",
    category: ArticleCategory.general,
    summary:
      "A comprehensive guide to understanding the phases of your menstrual cycle and what they mean for fertility.",
    readTime: "5 min",
  },
  {
    id: "2",
    title: "Nutrition for Conception",
    category: ArticleCategory.nutrition,
    summary:
      "Key nutrients and dietary patterns that support reproductive health and improve fertility outcomes.",
    readTime: "7 min",
  },
  {
    id: "3",
    title: "Managing Stress During Fertility Planning",
    category: ArticleCategory.stress,
    summary:
      "Evidence-based strategies for reducing stress and supporting hormonal balance while planning pregnancy.",
    readTime: "6 min",
  },
  {
    id: "4",
    title: "Lifestyle Factors That Affect Fertility",
    category: ArticleCategory.lifestyle,
    summary:
      "How exercise, sleep, and daily habits influence your reproductive health and what you can change today.",
    readTime: "8 min",
  },
  {
    id: "5",
    title: "When to Consider Reproductive Testing",
    category: ArticleCategory.reproductiveTesting,
    summary:
      "A guide to understanding fertility testing options and when to discuss them with your healthcare provider.",
    readTime: "6 min",
  },
  {
    id: "6",
    title: "Sexual Health and Fertility Basics",
    category: ArticleCategory.sexualHealth,
    summary:
      "Foundational knowledge about sexual health and its relationship to reproductive success.",
    readTime: "5 min",
  },
];

export function GuidesPage() {
  const { data: articles, isLoading } = useListArticles();
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | "all">(
    "all",
  );

  const displayArticles =
    articles && articles.length > 0
      ? articles.map((a) => ({
          id: a.id.toString(),
          title: a.title,
          category: a.category,
          summary: `${a.content.slice(0, 140)}…`,
          readTime: `${Math.max(3, Math.floor(a.content.length / 800))} min`,
        }))
      : FALLBACK_ARTICLES;

  const filtered =
    activeCategory === "all"
      ? displayArticles
      : displayArticles.filter((a) => a.category === activeCategory);

  const categories = Object.values(ArticleCategory);

  return (
    <Layout>
      {/* Header */}
      <section className="bg-card border-b border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-3">
            Health Guides
          </h1>
          <p className="text-muted-foreground font-body text-base max-w-xl">
            Evidence-informed articles on reproductive health, fertility, and
            preconception care — reviewed by clinical specialists.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="bg-background border-b border-border sticky top-16 z-10 py-3 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            data-ocid="guides.filter_all_tab"
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-smooth ${activeCategory === "all" ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}
          >
            All Topics
          </button>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              data-ocid={`guides.filter_${cat}_tab`}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-smooth ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </section>

      {/* Plan a Boy Callout */}
      <section className="px-4 sm:px-6 lg:px-8 bg-background pt-8 pb-2">
        <div className="container mx-auto max-w-6xl">
          <div
            className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-secondary/40 bg-secondary/10 px-6 py-5 shadow-clinical"
            data-ocid="guides.plan_a_boy_callout"
          >
            <span className="text-2xl select-none" aria-hidden="true">
              👶
            </span>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-display text-base font-semibold text-foreground mb-0.5">
                Trying for a Boy?
              </h2>
              <p className="text-sm font-body text-muted-foreground leading-relaxed">
                Our clinically guided{" "}
                <span className="text-secondary-foreground font-medium">
                  Plan a Boy
                </span>{" "}
                programme offers couples a proven approach with a{" "}
                <span className="font-semibold text-foreground">
                  99% success rate
                </span>{" "}
                — backed by science, personalised to you.
              </p>
            </div>
            <a
              href="/#plan-a-boy"
              data-ocid="guides.plan_a_boy_cta_button"
              className="flex-shrink-0 inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-body font-medium transition-smooth hover:opacity-90 shadow-clinical"
            >
              Learn More →
            </a>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section
        className="py-10 px-4 sm:px-6 lg:px-8 bg-background flex-1"
        data-ocid="guides.articles_section"
      >
        <div className="container mx-auto max-w-6xl">
          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="guides.loading_state"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-card border border-border rounded-lg p-5 space-y-3"
                >
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16" data-ocid="guides.empty_state">
              <p className="text-muted-foreground font-body">
                No articles in this category yet.
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="guides.articles_list"
            >
              {filtered.map((article, i) => (
                <Link
                  key={article.id}
                  to="/guides/$id"
                  params={{ id: article.id }}
                  data-ocid={`guides.article_card.${i + 1}`}
                  className="bg-card border border-border rounded-lg p-5 shadow-clinical hover:shadow-elevated transition-smooth flex flex-col gap-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-body font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[article.category]}`}
                    >
                      {CATEGORY_LABELS[article.category]}
                    </span>
                    <span className="text-xs text-muted-foreground font-body">
                      {article.readTime} read
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-base group-hover:text-primary transition-smooth line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-body leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                  <span className="mt-auto text-xs text-primary font-medium font-body">
                    Read more →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
