import { j as jsxRuntimeExports, L as Layout, S as Skeleton, a as Link, B as Button } from "./index-DAu_OpgI.js";
import { B as Badge } from "./badge-CgnUsyW4.js";
import { e as useGetMyProfile, f as useGetMyAppointments, b as useGetMyLatestAssessment, g as useCancelAppointment, h as AppointmentStatus, R as RiskLevel } from "./useBackend-C2LF4Rc0.js";
import { u as ue } from "./index-3noMWPg1.js";
import { U as User, C as ClipboardList } from "./user-SEIOHbBg.js";
import { C as CalendarDays } from "./calendar-days-_TjAWpk2.js";
import { C as CircleAlert, T as TrendingUp } from "./trending-up-CqfdzLgD.js";
import { C as CircleCheckBig } from "./circle-check-big-BDmBJTWE.js";
const STATUS_CONFIG = {
  [AppointmentStatus.confirmed]: {
    label: "Confirmed",
    className: "bg-secondary/20 text-secondary-foreground border-secondary/30"
  },
  [AppointmentStatus.pending]: {
    label: "Pending",
    className: "bg-primary/10 text-primary border-primary/20"
  },
  [AppointmentStatus.cancelled]: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground border-border"
  }
};
const RISK_ICONS = {
  [RiskLevel.optimized]: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 text-secondary" }),
  [RiskLevel.areasToImprove]: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5 text-primary" }),
  [RiskLevel.consultSpecialist]: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-destructive" })
};
const RISK_LABELS = {
  [RiskLevel.optimized]: "Well Optimized",
  [RiskLevel.areasToImprove]: "Areas to Improve",
  [RiskLevel.consultSpecialist]: "Specialist Recommended"
};
function DashboardPage() {
  const { data: profile, isLoading: loadingProfile } = useGetMyProfile();
  const { data: appointments, isLoading: loadingAppts } = useGetMyAppointments();
  const { data: assessment, isLoading: loadingAssessment } = useGetMyLatestAssessment();
  const { mutateAsync: cancelAppt, isPending: cancelling } = useCancelAppointment();
  const isLoading = loadingProfile || loadingAppts || loadingAssessment;
  const upcomingAppointments = (appointments ?? []).filter(
    (a) => a.status !== AppointmentStatus.cancelled
  );
  async function handleCancel(id) {
    try {
      await cancelAppt(id);
      ue.success("Appointment cancelled successfully.");
    } catch {
      ue.error("Failed to cancel appointment.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border py-10 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-6xl", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-64" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-3xl font-semibold text-foreground", children: [
        "Welcome back",
        (profile == null ? void 0 : profile.displayName) ? `, ${profile.displayName}` : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm mt-1", children: "Your reproductive health dashboard — all your information in one place." })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-background flex-1 py-10 px-4 sm:px-6 lg:px-8",
        "data-ocid": "dashboard.main_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-card border border-border rounded-lg p-5 shadow-clinical",
                "data-ocid": "dashboard.profile_card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-primary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-body font-medium text-sm text-foreground", children: "My Profile" })
                  ] }),
                  loadingProfile ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: (profile == null ? void 0 : profile.displayName) || "Complete your profile" }),
                    (profile == null ? void 0 : profile.planningTimeline) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body", children: [
                      "Timeline:",
                      " ",
                      profile.planningTimeline.replace(/([A-Z])/g, " $1").toLowerCase()
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        to: "/assessment",
                        className: "text-xs text-primary hover:underline font-body mt-2 inline-block",
                        "data-ocid": "dashboard.edit_profile_link",
                        children: "Update profile →"
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-card border border-border rounded-lg p-5 shadow-clinical",
                "data-ocid": "dashboard.assessment_card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-4 h-4 text-primary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-body font-medium text-sm text-foreground", children: "Health Assessment" })
                  ] }),
                  loadingAssessment ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }) : assessment ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      RISK_ICONS[assessment.riskProfile.overallRisk],
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-sm", children: RISK_LABELS[assessment.riskProfile.overallRisk] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body", children: [
                      assessment.riskProfile.recommendations.length,
                      " ",
                      "recommendation",
                      assessment.riskProfile.recommendations.length !== 1 ? "s" : ""
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        to: "/assessment",
                        className: "text-xs text-primary hover:underline font-body mt-2 inline-block",
                        "data-ocid": "dashboard.view_assessment_link",
                        children: "View results →"
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body mb-2", children: "No assessment completed yet" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        to: "/assessment",
                        "data-ocid": "dashboard.take_assessment_link",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            className: "bg-primary text-primary-foreground text-xs",
                            children: "Take Assessment"
                          }
                        )
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-card border border-border rounded-lg p-5 shadow-clinical",
                "data-ocid": "dashboard.appointments_summary_card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-4 h-4 text-primary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-body font-medium text-sm text-foreground", children: "Appointments" })
                  ] }),
                  loadingAppts ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-semibold text-foreground", children: [
                      upcomingAppointments.length,
                      " upcoming"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        to: "/booking",
                        className: "text-xs text-primary hover:underline font-body mt-2 inline-block",
                        "data-ocid": "dashboard.book_appointment_link",
                        children: "Book a consultation →"
                      }
                    )
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.appointments_section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "Your Appointments" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/booking", "data-ocid": "dashboard.new_booking_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  className: "bg-primary text-primary-foreground",
                  children: "+ New Booking"
                }
              ) })
            ] }),
            loadingAppts ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "space-y-3",
                "data-ocid": "dashboard.appointments_loading_state",
                children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "bg-card border border-border rounded-lg p-4 space-y-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-64" })
                    ]
                  },
                  n
                ))
              }
            ) : upcomingAppointments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-card border border-border rounded-lg p-8 text-center",
                "data-ocid": "dashboard.appointments_empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-10 h-10 text-muted-foreground/40 mx-auto mb-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm", children: "No appointments scheduled yet." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/booking",
                      className: "mt-3 inline-block",
                      "data-ocid": "dashboard.empty_book_button",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", children: "Book Your First Consultation" })
                    }
                  )
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "space-y-3",
                "data-ocid": "dashboard.appointments_list",
                children: upcomingAppointments.map((appt, i) => {
                  const apptDate = new Date(
                    Number(appt.slotStartTime) / 1e6
                  );
                  const statusCfg = STATUS_CONFIG[appt.status];
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "bg-card border border-border rounded-lg p-4 shadow-clinical flex items-start justify-between gap-4",
                      "data-ocid": `dashboard.appointment.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Badge,
                              {
                                variant: "outline",
                                className: `text-xs font-body ${statusCfg.className}`,
                                children: statusCfg.label
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body", children: apptDate.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            }) })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body font-medium text-sm text-foreground truncate", children: appt.name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body truncate", children: appt.reasonForVisit })
                        ] }),
                        (appt.status === AppointmentStatus.pending || appt.status === AppointmentStatus.confirmed && Number(appt.slotStartTime) / 1e6 - Date.now() > 48 * 60 * 60 * 1e3) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            variant: "outline",
                            size: "sm",
                            onClick: () => handleCancel(appt.id),
                            disabled: cancelling,
                            "data-ocid": `dashboard.cancel_appointment.${i + 1}`,
                            className: "flex-shrink-0 text-xs border-destructive/40 text-destructive hover:bg-destructive/5",
                            children: "Cancel"
                          }
                        )
                      ]
                    },
                    appt.id.toString()
                  );
                })
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  DashboardPage
};
