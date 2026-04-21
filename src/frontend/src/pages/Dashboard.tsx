import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCancelAppointment,
  useGetMyAppointments,
  useGetMyLatestAssessment,
  useGetMyProfile,
} from "@/hooks/useBackend";
import { AppointmentStatus, RiskLevel } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle,
  ClipboardList,
  TrendingUp,
  User,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  [AppointmentStatus.confirmed]: {
    label: "Confirmed",
    className: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  },
  [AppointmentStatus.pending]: {
    label: "Pending",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  [AppointmentStatus.cancelled]: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground border-border",
  },
};

const RISK_ICONS: Record<RiskLevel, React.ReactNode> = {
  [RiskLevel.optimized]: <CheckCircle className="w-5 h-5 text-secondary" />,
  [RiskLevel.areasToImprove]: <TrendingUp className="w-5 h-5 text-primary" />,
  [RiskLevel.consultSpecialist]: (
    <AlertCircle className="w-5 h-5 text-destructive" />
  ),
};

const RISK_LABELS: Record<RiskLevel, string> = {
  [RiskLevel.optimized]: "Well Optimized",
  [RiskLevel.areasToImprove]: "Areas to Improve",
  [RiskLevel.consultSpecialist]: "Specialist Recommended",
};

export function DashboardPage() {
  const { data: profile, isLoading: loadingProfile } = useGetMyProfile();
  const { data: appointments, isLoading: loadingAppts } =
    useGetMyAppointments();
  const { data: assessment, isLoading: loadingAssessment } =
    useGetMyLatestAssessment();
  const { mutateAsync: cancelAppt, isPending: cancelling } =
    useCancelAppointment();

  const isLoading = loadingProfile || loadingAppts || loadingAssessment;
  const upcomingAppointments = (appointments ?? []).filter(
    (a) => a.status !== AppointmentStatus.cancelled,
  );

  async function handleCancel(id: bigint) {
    try {
      await cancelAppt(id);
      toast.success("Appointment cancelled successfully.");
    } catch {
      toast.error("Failed to cancel appointment.");
    }
  }

  return (
    <Layout>
      {/* Header */}
      <section className="bg-card border-b border-border py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          ) : (
            <div>
              <h1 className="font-display text-3xl font-semibold text-foreground">
                Welcome back
                {profile?.displayName ? `, ${profile.displayName}` : ""}
              </h1>
              <p className="text-muted-foreground font-body text-sm mt-1">
                Your reproductive health dashboard — all your information in one
                place.
              </p>
            </div>
          )}
        </div>
      </section>

      <section
        className="bg-background flex-1 py-10 px-4 sm:px-6 lg:px-8"
        data-ocid="dashboard.main_section"
      >
        <div className="container mx-auto max-w-6xl space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Profile */}
            <div
              className="bg-card border border-border rounded-lg p-5 shadow-clinical"
              data-ocid="dashboard.profile_card"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-body font-medium text-sm text-foreground">
                  My Profile
                </h3>
              </div>
              {loadingProfile ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <div className="space-y-1">
                  <p className="font-display font-semibold text-foreground">
                    {profile?.displayName || "Complete your profile"}
                  </p>
                  {profile?.planningTimeline && (
                    <p className="text-xs text-muted-foreground font-body">
                      Timeline:{" "}
                      {profile.planningTimeline
                        .replace(/([A-Z])/g, " $1")
                        .toLowerCase()}
                    </p>
                  )}
                  <Link
                    to="/assessment"
                    className="text-xs text-primary hover:underline font-body mt-2 inline-block"
                    data-ocid="dashboard.edit_profile_link"
                  >
                    Update profile →
                  </Link>
                </div>
              )}
            </div>

            {/* Assessment */}
            <div
              className="bg-card border border-border rounded-lg p-5 shadow-clinical"
              data-ocid="dashboard.assessment_card"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-body font-medium text-sm text-foreground">
                  Health Assessment
                </h3>
              </div>
              {loadingAssessment ? (
                <Skeleton className="h-4 w-32" />
              ) : assessment ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {RISK_ICONS[assessment.riskProfile.overallRisk]}
                    <p className="font-display font-semibold text-foreground text-sm">
                      {RISK_LABELS[assessment.riskProfile.overallRisk]}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground font-body">
                    {assessment.riskProfile.recommendations.length}{" "}
                    recommendation
                    {assessment.riskProfile.recommendations.length !== 1
                      ? "s"
                      : ""}
                  </p>
                  <Link
                    to="/assessment"
                    className="text-xs text-primary hover:underline font-body mt-2 inline-block"
                    data-ocid="dashboard.view_assessment_link"
                  >
                    View results →
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground font-body mb-2">
                    No assessment completed yet
                  </p>
                  <Link
                    to="/assessment"
                    data-ocid="dashboard.take_assessment_link"
                  >
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground text-xs"
                    >
                      Take Assessment
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Appointments Summary */}
            <div
              className="bg-card border border-border rounded-lg p-5 shadow-clinical"
              data-ocid="dashboard.appointments_summary_card"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-body font-medium text-sm text-foreground">
                  Appointments
                </h3>
              </div>
              {loadingAppts ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <div className="space-y-1">
                  <p className="font-display font-semibold text-foreground">
                    {upcomingAppointments.length} upcoming
                  </p>
                  <Link
                    to="/booking"
                    className="text-xs text-primary hover:underline font-body mt-2 inline-block"
                    data-ocid="dashboard.book_appointment_link"
                  >
                    Book a consultation →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Appointments List */}
          <div data-ocid="dashboard.appointments_section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Your Appointments
              </h2>
              <Link to="/booking" data-ocid="dashboard.new_booking_button">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground"
                >
                  + New Booking
                </Button>
              </Link>
            </div>

            {loadingAppts ? (
              <div
                className="space-y-3"
                data-ocid="dashboard.appointments_loading_state"
              >
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-card border border-border rounded-lg p-4 space-y-2"
                  >
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                ))}
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div
                className="bg-card border border-border rounded-lg p-8 text-center"
                data-ocid="dashboard.appointments_empty_state"
              >
                <CalendarDays className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground font-body text-sm">
                  No appointments scheduled yet.
                </p>
                <Link
                  to="/booking"
                  className="mt-3 inline-block"
                  data-ocid="dashboard.empty_book_button"
                >
                  <Button size="sm" variant="outline">
                    Book Your First Consultation
                  </Button>
                </Link>
              </div>
            ) : (
              <div
                className="space-y-3"
                data-ocid="dashboard.appointments_list"
              >
                {upcomingAppointments.map((appt, i) => {
                  const apptDate = new Date(
                    Number(appt.slotStartTime) / 1_000_000,
                  );
                  const statusCfg = STATUS_CONFIG[appt.status];
                  return (
                    <div
                      key={appt.id.toString()}
                      className="bg-card border border-border rounded-lg p-4 shadow-clinical flex items-start justify-between gap-4"
                      data-ocid={`dashboard.appointment.${i + 1}`}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`text-xs font-body ${statusCfg.className}`}
                          >
                            {statusCfg.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-body">
                            {apptDate.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="font-body font-medium text-sm text-foreground truncate">
                          {appt.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-body truncate">
                          {appt.reasonForVisit}
                        </p>
                      </div>
                      {(appt.status === AppointmentStatus.pending ||
                        (appt.status === AppointmentStatus.confirmed &&
                          Number(appt.slotStartTime) / 1_000_000 - Date.now() >
                            48 * 60 * 60 * 1000)) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(appt.id)}
                          disabled={cancelling}
                          data-ocid={`dashboard.cancel_appointment.${i + 1}`}
                          className="flex-shrink-0 text-xs border-destructive/40 text-destructive hover:bg-destructive/5"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
