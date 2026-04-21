import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export type SlotId = bigint;
export type AppointmentId = bigint;
export type ArticleId = bigint;
export interface SubmitAssessmentRequest {
    answers: Array<Answer>;
}
export type AssessmentId = bigint;
export interface UpdateProfileRequest {
    age?: bigint;
    healthHistoryConsent: boolean;
    planningTimeline?: PlanningTimeline;
    displayName: string;
}
export interface BookAppointmentRequest {
    reasonForVisit: string;
    name: string;
    email: string;
    slotId: SlotId;
    phone: string;
}
export interface UpdateBlogPostRequest {
    id: bigint;
    status: BlogPostStatus;
    title: string;
    content: string;
    featuredImageUrl?: string;
    excerpt: string;
}
export interface Citation {
    title: string;
    source: string;
    year: bigint;
    authors: string;
}
export interface Recommendation {
    title: string;
    description: string;
    category: string;
}
export interface ConsultationSlot {
    id: SlotId;
    startTime: Timestamp;
    isAvailable: boolean;
    durationMinutes: bigint;
}
export interface Assessment {
    id: AssessmentId;
    userId: UserId;
    answers: Array<Answer>;
    createdAt: Timestamp;
    riskProfile: RiskProfile;
}
export type QuestionId = bigint;
export interface UserProfilePublic {
    id: UserId;
    age?: bigint;
    healthHistoryConsent: boolean;
    planningTimeline?: PlanningTimeline;
    displayName: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
export type AnswerValue = {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "text";
    text: string;
};
export type UserId = Principal;
export interface RiskProfile {
    completedAt: Timestamp;
    recommendations: Array<Recommendation>;
    overallRisk: RiskLevel;
}
export interface CreateBlogPostRequest {
    status: BlogPostStatus;
    title: string;
    content: string;
    featuredImageUrl?: string;
    excerpt: string;
}
export interface CreateArticleRequest {
    title: string;
    content: string;
    category: ArticleCategory;
    citations: Array<Citation>;
}
export interface Answer {
    value: AnswerValue;
    questionId: QuestionId;
}
export interface Appointment {
    id: AppointmentId;
    status: AppointmentStatus;
    reasonForVisit: string;
    userId: UserId;
    name: string;
    createdAt: Timestamp;
    email: string;
    slotId: SlotId;
    slotStartTime: Timestamp;
    phone: string;
}
export interface ArticlePublic {
    id: ArticleId;
    title: string;
    content: string;
    publishedAt: Timestamp;
    updatedAt: Timestamp;
    category: ArticleCategory;
    citations: Array<Citation>;
}
export interface BlogPostPublic {
    id: bigint;
    status: BlogPostStatus;
    title: string;
    content: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    featuredImageUrl?: string;
    excerpt: string;
}
export enum AppointmentStatus {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum ArticleCategory {
    reproductiveTesting = "reproductiveTesting",
    stress = "stress",
    sexualHealth = "sexualHealth",
    general = "general",
    lifestyle = "lifestyle",
    nutrition = "nutrition"
}
export enum BlogPostStatus {
    published = "published",
    draft = "draft"
}
export enum PlanningTimeline {
    within1Year = "within1Year",
    moreThan1Year = "moreThan1Year",
    notSure = "notSure",
    within3Months = "within3Months",
    within6Months = "within6Months"
}
export enum RiskLevel {
    areasToImprove = "areasToImprove",
    optimized = "optimized",
    consultSpecialist = "consultSpecialist"
}
export interface backendInterface {
    bookAppointment(req: BookAppointmentRequest): Promise<Appointment>;
    canRetakeAssessment(): Promise<boolean>;
    cancelAppointment(appointmentId: AppointmentId): Promise<boolean>;
    createArticle(req: CreateArticleRequest): Promise<ArticlePublic>;
    createBlogPost(req: CreateBlogPostRequest): Promise<BlogPostPublic>;
    deleteBlogPost(postId: bigint): Promise<boolean>;
    getArticle(articleId: ArticleId): Promise<ArticlePublic | null>;
    getBlogPost(postId: bigint): Promise<BlogPostPublic | null>;
    getMyAppointments(): Promise<Array<Appointment>>;
    getMyLatestAssessment(): Promise<Assessment | null>;
    getMyProfile(): Promise<UserProfilePublic | null>;
    listAllBlogPosts(): Promise<Array<BlogPostPublic>>;
    listArticles(): Promise<Array<ArticlePublic>>;
    listArticlesByCategory(category: ArticleCategory): Promise<Array<ArticlePublic>>;
    listAvailableSlots(): Promise<Array<ConsultationSlot>>;
    listPublishedBlogPosts(): Promise<Array<BlogPostPublic>>;
    submitAssessment(req: SubmitAssessmentRequest): Promise<Assessment>;
    updateBlogPost(req: UpdateBlogPostRequest): Promise<BlogPostPublic | null>;
    upsertMyProfile(req: UpdateProfileRequest): Promise<UserProfilePublic>;
}
