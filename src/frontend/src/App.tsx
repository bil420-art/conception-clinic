import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy page imports
const HomePage = lazy(() =>
  import("@/pages/Home").then((m) => ({ default: m.HomePage })),
);
const GuidesPage = lazy(() =>
  import("@/pages/Guides").then((m) => ({ default: m.GuidesPage })),
);
const GuideDetailPage = lazy(() =>
  import("@/pages/GuideDetail").then((m) => ({ default: m.GuideDetailPage })),
);
const AssessmentPage = lazy(() =>
  import("@/pages/Assessment").then((m) => ({ default: m.AssessmentPage })),
);
const DashboardPage = lazy(() =>
  import("@/pages/Dashboard").then((m) => ({ default: m.DashboardPage })),
);
const BookingPage = lazy(() =>
  import("@/pages/Booking").then((m) => ({ default: m.BookingPage })),
);
const BlogPage = lazy(() =>
  import("@/pages/Blog").then((m) => ({ default: m.BlogPage })),
);
const BlogDetailPage = lazy(() =>
  import("@/pages/BlogDetail").then((m) => ({ default: m.BlogDetailPage })),
);
const AdminBlogPage = lazy(() =>
  import("@/pages/AdminBlog").then((m) => ({ default: m.AdminBlogPage })),
);
const ClientAreaPage = lazy(() =>
  import("@/pages/ClientArea").then((m) => ({ default: m.ClientAreaPage })),
);

function PageLoader() {
  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-56" />
      </div>
    </Layout>
  );
}

// Route tree
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <HomePage />
    </Suspense>
  ),
});

const guidesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/guides",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <GuidesPage />
    </Suspense>
  ),
});

const guideDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/guides/$id",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <GuideDetailPage />
    </Suspense>
  ),
});

const assessmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/assessment",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <AssessmentPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <DashboardPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/booking",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <BookingPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <BlogPage />
    </Suspense>
  ),
});

const blogDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/$id",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <BlogDetailPage />
    </Suspense>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminBlogPage />
    </Suspense>
  ),
});

const clientAreaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/client-area",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <ClientAreaPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  guidesRoute,
  guideDetailRoute,
  assessmentRoute,
  dashboardRoute,
  bookingRoute,
  blogRoute,
  blogDetailRoute,
  adminRoute,
  clientAreaRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
