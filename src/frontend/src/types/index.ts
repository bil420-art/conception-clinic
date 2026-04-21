export type {
  Assessment,
  Appointment,
  ArticlePublic,
  BlogPostPublic,
  UserProfilePublic,
  ConsultationSlot,
  RiskProfile,
  Recommendation,
  Citation,
  Answer,
  AnswerValue,
  BookAppointmentRequest,
  UpdateProfileRequest,
  SubmitAssessmentRequest,
  CreateArticleRequest,
  CreateBlogPostRequest,
  UpdateBlogPostRequest,
  Timestamp,
  SlotId,
  ArticleId,
  AppointmentId,
  AssessmentId,
  UserId,
} from "../backend";

export {
  AppointmentStatus,
  ArticleCategory,
  BlogPostStatus,
  PlanningTimeline,
  RiskLevel,
} from "../backend";

export interface NavItem {
  label: string;
  href: string;
  requiresAuth?: boolean;
}
