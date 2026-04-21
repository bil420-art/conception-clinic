import type { backendInterface } from "../backend";
import {
  AppointmentStatus,
  ArticleCategory,
  BlogPostStatus,
  PlanningTimeline,
  RiskLevel,
} from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);

export const mockBackend: backendInterface = {
  bookAppointment: async (req) => ({
    id: BigInt(1),
    status: AppointmentStatus.pending,
    reasonForVisit: req.reasonForVisit,
    userId: { _isPrincipal: true, toText: () => "mock-principal" } as any,
    name: req.name,
    createdAt: now,
    email: req.email,
    slotId: req.slotId,
    slotStartTime: now + BigInt(86400 * 1_000_000_000),
    phone: req.phone,
  }),

  canRetakeAssessment: async () => true,

  cancelAppointment: async (_appointmentId) => true,

  createArticle: async (req) => ({
    id: BigInt(99),
    title: req.title,
    content: req.content,
    publishedAt: now,
    updatedAt: now,
    category: req.category,
    citations: req.citations,
  }),

  getArticle: async (_articleId) => ({
    id: BigInt(0),
    title: "Preconception Nutrition: Building the Foundation for a Healthy Pregnancy",
    content:
      "Good nutrition before conception is one of the most impactful steps you can take for reproductive health. A balanced preconception diet supports hormonal regulation, egg and sperm quality, and early embryonic development.",
    publishedAt: now,
    updatedAt: now,
    category: ArticleCategory.nutrition,
    citations: [
      {
        authors: "Gaskins AJ, Chavarro JE",
        title: "Diet and fertility: a review",
        source: "Am J Obstet Gynecol. 2018;218(4):379-389",
        year: BigInt(2018),
      },
    ],
  }),

  getMyAppointments: async () => [
    {
      id: BigInt(1),
      status: AppointmentStatus.confirmed,
      reasonForVisit: "Initial fertility consultation",
      userId: { _isPrincipal: true, toText: () => "mock-principal" } as any,
      name: "Sarah Johnson",
      createdAt: now,
      email: "sarah@example.com",
      slotId: BigInt(1),
      slotStartTime: now + BigInt(86400 * 1_000_000_000 * 3),
      phone: "+1 555-0100",
    },
  ],

  getMyLatestAssessment: async () => ({
    id: BigInt(1),
    userId: { _isPrincipal: true, toText: () => "mock-principal" } as any,
    answers: [],
    createdAt: now,
    riskProfile: {
      completedAt: now,
      recommendations: [
        {
          title: "Improve Diet Quality",
          description:
            "Incorporate more whole foods, leafy greens, and omega-3 rich foods to support reproductive health.",
          category: "Nutrition",
        },
        {
          title: "Manage Stress Levels",
          description:
            "Consider mindfulness-based stress reduction techniques to support hormonal balance.",
          category: "Stress",
        },
      ],
      overallRisk: RiskLevel.areasToImprove,
    },
  }),

  getMyProfile: async () => ({
    id: { _isPrincipal: true, toText: () => "mock-principal" } as any,
    age: BigInt(32),
    healthHistoryConsent: true,
    planningTimeline: PlanningTimeline.within6Months,
    displayName: "Sarah Johnson",
    createdAt: now,
    updatedAt: now,
  }),

  listArticles: async () => [
    {
      id: BigInt(0),
      title: "Preconception Nutrition: Building the Foundation for a Healthy Pregnancy",
      content:
        "Good nutrition before conception is one of the most impactful steps you can take for reproductive health. A balanced preconception diet supports hormonal regulation, egg and sperm quality, and early embryonic development.",
      publishedAt: now,
      updatedAt: now,
      category: ArticleCategory.nutrition,
      citations: [
        {
          authors: "Gaskins AJ, Chavarro JE",
          title: "Diet and fertility: a review",
          source: "Am J Obstet Gynecol. 2018;218(4):379-389",
          year: BigInt(2018),
        },
      ],
    },
    {
      id: BigInt(1),
      title: "Male Fertility Nutrition: How Diet Impacts Sperm Health",
      content:
        "Male factor infertility contributes to approximately 40–50% of all infertility cases, yet is often overlooked in preconception planning. Diet significantly influences sperm concentration, motility, morphology, and DNA integrity.",
      publishedAt: now,
      updatedAt: now,
      category: ArticleCategory.nutrition,
      citations: [],
    },
    {
      id: BigInt(2),
      title: "Exercise and Fertility: Finding the Right Balance",
      content:
        "Physical activity has a nuanced relationship with reproductive health — too little or too much can both negatively affect fertility, while regular moderate exercise supports hormonal balance.",
      publishedAt: now,
      updatedAt: now,
      category: ArticleCategory.lifestyle,
      citations: [],
    },
    {
      id: BigInt(3),
      title: "Sleep and Reproductive Health: Why Rest Matters for Fertility",
      content:
        "Sleep is a biological necessity, not a luxury — and its importance for reproductive health is increasingly recognised in the scientific literature.",
      publishedAt: now,
      updatedAt: now,
      category: ArticleCategory.lifestyle,
      citations: [],
    },
    {
      id: BigInt(4),
      title: "Stress, Cortisol, and Fertility: Understanding the Mind-Body Connection",
      content:
        "The relationship between stress and fertility is complex and bidirectional — infertility causes stress, and stress may, in turn, affect fertility.",
      publishedAt: now,
      updatedAt: now,
      category: ArticleCategory.stress,
      citations: [],
    },
    {
      id: BigInt(5),
      title: "Managing Fertility-Related Anxiety: A Compassionate Guide",
      content:
        "The emotional journey of trying to conceive can be one of the most challenging experiences a person or couple faces.",
      publishedAt: now,
      updatedAt: now,
      category: ArticleCategory.stress,
      citations: [],
    },
  ],

  listArticlesByCategory: async (_category) => [
    {
      id: BigInt(0),
      title: "Preconception Nutrition: Building the Foundation for a Healthy Pregnancy",
      content:
        "Good nutrition before conception is one of the most impactful steps you can take for reproductive health.",
      publishedAt: now,
      updatedAt: now,
      category: ArticleCategory.nutrition,
      citations: [],
    },
  ],

  listAvailableSlots: async () => [
    {
      id: BigInt(0),
      startTime: now + BigInt(86400 * 1_000_000_000),
      isAvailable: true,
      durationMinutes: BigInt(30),
    },
    {
      id: BigInt(1),
      startTime: now + BigInt(86400 * 1_000_000_000 * 2),
      isAvailable: true,
      durationMinutes: BigInt(30),
    },
    {
      id: BigInt(2),
      startTime: now + BigInt(86400 * 1_000_000_000 * 3),
      isAvailable: true,
      durationMinutes: BigInt(30),
    },
  ],

  submitAssessment: async (_req) => ({
    id: BigInt(1),
    userId: { _isPrincipal: true, toText: () => "mock-principal" } as any,
    answers: _req.answers,
    createdAt: now,
    riskProfile: {
      completedAt: now,
      recommendations: [
        {
          title: "Improve Diet Quality",
          description:
            "Incorporate more whole foods, leafy greens, and omega-3 rich foods to support reproductive health.",
          category: "Nutrition",
        },
      ],
      overallRisk: RiskLevel.areasToImprove,
    },
  }),

  upsertMyProfile: async (req) => ({
    id: { _isPrincipal: true, toText: () => "mock-principal" } as any,
    age: req.age,
    healthHistoryConsent: req.healthHistoryConsent,
    planningTimeline: req.planningTimeline,
    displayName: req.displayName,
    createdAt: now,
    updatedAt: now,
  }),

  // ── Blog ────────────────────────────────────────────────────────────────────

  createBlogPost: async (req) => ({
    id: BigInt(1),
    status: req.status,
    title: req.title,
    content: req.content,
    featuredImageUrl: req.featuredImageUrl,
    excerpt: req.excerpt,
    createdAt: now,
    updatedAt: now,
  }),

  deleteBlogPost: async (_postId) => true,

  getBlogPost: async (_postId) => ({
    id: BigInt(1),
    status: BlogPostStatus.published,
    title: "Planning for a Boy: Understanding the Science Behind Gender Selection",
    content:
      "At Conception Clinic, we provide couples with evidence-based guidance on natural gender selection strategies. Our 99% guarantee is grounded in clinical protocols developed over years of research and real-world outcomes.\n\n**Understanding Timing and Biology**\n\nThe sex of a baby is determined by the sperm cell that fertilises the egg. Sperm carrying the Y chromosome (which produces boys) tend to be lighter and faster but shorter-lived than X-bearing sperm. Our timing protocols leverage these biological differences to maximise the probability of Y-sperm fertilisation.\n\n**The Shettles Method and Beyond**\n\nWhile the Shettles method provides a foundational framework, our clinic combines it with advanced ovulation tracking, dietary guidance, and positioning recommendations to achieve superior outcomes.\n\n**Your Personalised Plan**\n\nEvery couple receives a personalised consultation to assess their cycle, health status, and readiness. Our clinical team will guide you through each step with compassion and precision.",
    featuredImageUrl: undefined,
    excerpt:
      "Discover our evidence-based approach to gender selection with a 99% success rate. Learn how timing, biology, and personalised guidance work together to help you plan for a boy.",
    createdAt: now,
    updatedAt: now,
  }),

  listAllBlogPosts: async () => [
    {
      id: BigInt(1),
      status: BlogPostStatus.published,
      title: "Planning for a Boy: Understanding the Science Behind Gender Selection",
      content: "At Conception Clinic, we provide couples with evidence-based guidance on natural gender selection strategies.",
      featuredImageUrl: undefined,
      excerpt: "Discover our evidence-based approach to gender selection with a 99% success rate.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: BigInt(2),
      status: BlogPostStatus.draft,
      title: "5 Nutrition Tips to Boost Your Fertility Naturally",
      content: "What you eat directly impacts your reproductive health. Here are five dietary changes that can make a real difference.",
      featuredImageUrl: undefined,
      excerpt: "Five dietary changes that can make a real difference to your fertility journey.",
      createdAt: now - BigInt(86400 * 1_000_000_000),
      updatedAt: now - BigInt(86400 * 1_000_000_000),
    },
  ],

  listPublishedBlogPosts: async () => [
    {
      id: BigInt(1),
      status: BlogPostStatus.published,
      title: "Planning for a Boy: Understanding the Science Behind Gender Selection",
      content: "At Conception Clinic, we provide couples with evidence-based guidance on natural gender selection strategies. Our 99% guarantee is grounded in clinical protocols.",
      featuredImageUrl: undefined,
      excerpt: "Discover our evidence-based approach to gender selection with a 99% success rate. Learn how timing, biology, and personalised guidance work together.",
      createdAt: now,
      updatedAt: now,
    },
  ],

  updateBlogPost: async (req) => ({
    id: req.id,
    status: req.status,
    title: req.title,
    content: req.content,
    featuredImageUrl: req.featuredImageUrl,
    excerpt: req.excerpt,
    createdAt: now,
    updatedAt: now,
  }),
};
