import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  Appointment,
  ArticleCategory,
  ArticlePublic,
  Assessment,
  BlogPostPublic,
  BookAppointmentRequest,
  ConsultationSlot,
  CreateBlogPostRequest,
  SubmitAssessmentRequest,
  UpdateBlogPostRequest,
  UpdateProfileRequest,
  UserProfilePublic,
} from "../types";

// ── Articles ──────────────────────────────────────────────────────────────────

export function useListArticles() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ArticlePublic[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListArticlesByCategory(category: ArticleCategory) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ArticlePublic[]>({
    queryKey: ["articles", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listArticlesByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArticle(articleId: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ArticlePublic | null>({
    queryKey: ["article", articleId?.toString()],
    queryFn: async () => {
      if (!actor || articleId === null) return null;
      return actor.getArticle(articleId);
    },
    enabled: !!actor && !isFetching && articleId !== null,
  });
}

// ── Profile ───────────────────────────────────────────────────────────────────

export function useGetMyProfile() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserProfilePublic | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpsertMyProfile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<UserProfilePublic, Error, UpdateProfileRequest>({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.upsertMyProfile(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// ── Assessment ────────────────────────────────────────────────────────────────

export function useGetMyLatestAssessment() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Assessment | null>({
    queryKey: ["assessment"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyLatestAssessment();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCanRetakeAssessment() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<boolean>({
    queryKey: ["assessment", "canRetake"],
    queryFn: async () => {
      if (!actor) return true;
      return actor.canRetakeAssessment();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitAssessment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<Assessment, Error, SubmitAssessmentRequest>({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitAssessment(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment"] });
    },
  });
}

// ── Booking ───────────────────────────────────────────────────────────────────

export function useListAvailableSlots() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ConsultationSlot[]>({
    queryKey: ["slots"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAvailableSlots();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyAppointments() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookAppointment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<Appointment, Error, BookAppointmentRequest>({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.bookAppointment(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
}

export function useCancelAppointment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, bigint>({
    mutationFn: async (appointmentId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.cancelAppointment(appointmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

// ── Blog ──────────────────────────────────────────────────────────────────────

export function useListPublishedBlogPosts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<BlogPostPublic[]>({
    queryKey: ["blog", "published"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPublishedBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogPost(postId: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<BlogPostPublic | null>({
    queryKey: ["blog", "post", postId?.toString()],
    queryFn: async () => {
      if (!actor || postId === null) return null;
      return actor.getBlogPost(postId);
    },
    enabled: !!actor && !isFetching && postId !== null,
  });
}

// ── Blog Admin ────────────────────────────────────────────────────────────────

export function useListAllBlogPosts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<BlogPostPublic[]>({
    queryKey: ["blog", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<BlogPostPublic, Error, CreateBlogPostRequest>({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createBlogPost(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<BlogPostPublic | null, Error, UpdateBlogPostRequest>({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateBlogPost(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, bigint>({
    mutationFn: async (postId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteBlogPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
}
