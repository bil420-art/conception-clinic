import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useGetMyProfile } from "@/hooks/useBackend";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  Heart,
  LayoutDashboard,
  Sparkles,
  User,
} from "lucide-react";

interface QuickAction {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  label: string;
  ocid: string;
  accent: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: <User size={24} />,
    title: "My Profile",
    description:
      "Update your personal details, health history, and planning goals.",
    href: "/dashboard",
    label: "Edit Profile",
    ocid: "client_area.profile_card",
    accent: "from-rose-500/10 to-pink-500/10 border-rose-200/60",
  },
  {
    icon: <ClipboardList size={24} />,
    title: "Health Assessment",
    description:
      "Take or retake your fertility readiness assessment to get personalized guidance.",
    href: "/assessment",
    label: "Start Assessment",
    ocid: "client_area.assessment_card",
    accent: "from-primary/10 to-accent/10 border-primary/20",
  },
  {
    icon: <LayoutDashboard size={24} />,
    title: "My Dashboard",
    description:
      "View your full health overview, appointments, and progress summary.",
    href: "/dashboard",
    label: "Go to Dashboard",
    ocid: "client_area.dashboard_card",
    accent: "from-secondary/10 to-accent/10 border-secondary/20",
  },
  {
    icon: <CalendarCheck size={24} />,
    title: "Book Consultation",
    description:
      "Schedule a 30-minute one-on-one consultation with our fertility specialists.",
    href: "/booking",
    label: "Book Now",
    ocid: "client_area.booking_card",
    accent: "from-rose-400/10 to-primary/10 border-rose-300/40",
  },
  {
    icon: <BookOpen size={24} />,
    title: "Read the Blog",
    description:
      "Browse our latest articles, tips, and evidence-based fertility insights.",
    href: "/blog",
    label: "Read Articles",
    ocid: "client_area.blog_card",
    accent: "from-accent/10 to-secondary/10 border-accent/20",
  },
];

export function ClientAreaPage() {
  const { data: profile, isLoading: profileLoading } = useGetMyProfile();
  const { isAuthenticated } = useAuth();

  const displayName =
    profile?.displayName?.trim() || (isAuthenticated ? "there" : "there");

  return (
    <Layout>
      {/* Hero Banner */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-background to-primary/5 border-b border-border"
        data-ocid="client_area.hero_section"
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-rose-200/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="flex flex-col items-start gap-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-700 text-xs font-body font-medium">
              <Heart size={12} className="fill-rose-500 text-rose-500" />
              Client Area
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {profileLoading ? (
                <Skeleton
                  className="h-12 w-72"
                  data-ocid="client_area.name_loading"
                />
              ) : (
                <>
                  Welcome back,{" "}
                  <span className="text-primary capitalize">{displayName}</span>
                  &nbsp;
                  <Sparkles
                    size={28}
                    className="inline text-rose-400 align-middle"
                    aria-hidden="true"
                  />
                </>
              )}
            </h1>

            <p className="text-muted-foreground font-body text-base md:text-lg leading-relaxed">
              This is your personal space at Conception Clinic. Everything you
              need — your profile, assessment, appointments, and resources — is
              one click away.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section
        className="bg-background py-12 md:py-16"
        data-ocid="client_area.actions_section"
      >
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground">
              Quick Actions
            </h2>
            <p className="text-muted-foreground font-body text-sm mt-1">
              Jump directly to any part of your journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {QUICK_ACTIONS.map((action) => (
              <Card
                key={action.ocid}
                className={`group relative overflow-hidden border bg-gradient-to-br ${action.accent} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
                data-ocid={action.ocid}
              >
                <CardContent className="p-6 flex flex-col gap-4 h-full">
                  <div className="w-11 h-11 rounded-xl bg-card flex items-center justify-center text-primary shadow-sm border border-border/60 flex-shrink-0">
                    {action.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-foreground text-base mb-1.5">
                      {action.title}
                    </h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed line-clamp-3">
                      {action.description}
                    </p>
                  </div>

                  <Link
                    to={action.href}
                    data-ocid={`${action.ocid}.link`}
                    className="inline-flex items-center gap-1.5 text-sm font-body font-medium text-primary hover:text-primary/80 transition-colors group-hover:gap-2.5 duration-200"
                  >
                    {action.label}
                    <ChevronRight size={15} aria-hidden="true" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="bg-muted/40 border-t border-border py-10 md:py-14"
        data-ocid="client_area.cta_section"
      >
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 border border-rose-200 mb-4">
            <Heart size={22} className="text-rose-500 fill-rose-200" />
          </div>
          <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-2">
            Need personalised support?
          </h2>
          <p className="text-muted-foreground font-body text-sm md:text-base mb-6 max-w-lg mx-auto">
            Our specialists are here to guide you every step of the way — from
            fertility assessments to your Plan a Boy consultation.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
            data-ocid="client_area.book_consultation_button"
          >
            <Link to="/booking">Book a Consultation</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
