import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetArticle } from "@/hooks/useBackend";
import { ArticleCategory } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar } from "lucide-react";

const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  [ArticleCategory.general]: "General",
  [ArticleCategory.nutrition]: "Nutrition",
  [ArticleCategory.lifestyle]: "Lifestyle",
  [ArticleCategory.stress]: "Stress & Wellness",
  [ArticleCategory.sexualHealth]: "Sexual Health",
  [ArticleCategory.reproductiveTesting]: "Reproductive Testing",
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
  publishedAt: new Date().toISOString(),
  citations: [
    {
      authors: "Johnson K, et al.",
      title: "Recommendations to Improve Preconception Health and Health Care",
      source: "MMWR",
      year: 2006,
    },
    {
      authors: "World Health Organization",
      title:
        "Preconception Care: Maximizing the Gains for Maternal and Child Health",
      source: "WHO",
      year: 2013,
    },
  ],
};

export function GuideDetailPage() {
  const { id } = useParams({ from: "/guides/$id" });
  const articleId = Number.isNaN(Number(id)) ? null : BigInt(id);
  const { data: article, isLoading } = useGetArticle(articleId);

  const display = article
    ? {
        title: article.title,
        category: article.category,
        content: article.content,
        publishedAt: new Date(
          Number(article.publishedAt) / 1_000_000,
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        citations: article.citations.map((c) => ({
          ...c,
          year: Number(c.year),
        })),
      }
    : {
        ...FALLBACK_CONTENT,
        publishedAt: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        citations: FALLBACK_CONTENT.citations,
      };

  return (
    <Layout>
      <div className="bg-card border-b border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth mb-6 font-body"
            data-ocid="guide_detail.back_link"
          >
            <ArrowLeft size={14} />
            Back to Guides
          </Link>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-4 w-48" />
            </div>
          ) : (
            <div className="space-y-3">
              <Badge variant="secondary" className="text-xs font-body">
                {CATEGORY_LABELS[display.category]}
              </Badge>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
                {display.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                <Calendar size={13} />
                <span>Published {display.publishedAt}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className="bg-background flex-1 py-10 px-4 sm:px-6 lg:px-8"
        data-ocid="guide_detail.content_section"
      >
        <div className="container mx-auto max-w-3xl">
          {isLoading ? (
            <div className="space-y-4" data-ocid="guide_detail.loading_state">
              {[1, 2, 3, 4, 5].map((n) => (
                <Skeleton key={n} className="h-4 w-full" />
              ))}
            </div>
          ) : (
            <div className="prose prose-sm max-w-none font-body text-foreground/90 leading-relaxed">
              {display.content.split("\n\n").map((paragraph, i) => {
                const key = `para-${i}`;
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return (
                    <h3
                      key={key}
                      className="font-display font-semibold text-foreground text-lg mt-6 mb-3"
                    >
                      {paragraph.slice(2, -2)}
                    </h3>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  return (
                    <ul
                      key={key}
                      className="list-disc list-inside space-y-1.5 my-3 text-muted-foreground"
                    >
                      {paragraph.split("\n").map((item) => (
                        <li key={item}>{item.replace(/^- /, "")}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={key} className="mb-4 text-foreground/80">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          )}

          {/* Citations */}
          {!isLoading && display.citations.length > 0 && (
            <div
              className="mt-10 pt-6 border-t border-border"
              data-ocid="guide_detail.citations_section"
            >
              <h4 className="font-display font-semibold text-foreground text-sm mb-3">
                References
              </h4>
              <ol className="space-y-2">
                {display.citations.map((c) => (
                  <li
                    key={`${c.authors}-${c.year}`}
                    className="text-xs text-muted-foreground font-body leading-relaxed"
                  >
                    {c.authors} ({c.year}). {c.title}. <em>{c.source}</em>.
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-8 p-4 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground font-body leading-relaxed">
            <strong className="text-foreground/70">
              Educational Disclaimer:
            </strong>{" "}
            This article is for informational purposes only and does not
            constitute medical advice. Please consult a qualified healthcare
            provider for guidance specific to your situation.
          </div>
        </div>
      </div>
    </Layout>
  );
}
