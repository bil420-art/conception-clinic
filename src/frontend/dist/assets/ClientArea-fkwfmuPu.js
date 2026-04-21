import { c as createLucideIcon, j as jsxRuntimeExports, g as cn, n as useAuth, L as Layout, S as Skeleton, a as Link, B as Button } from "./index-DAu_OpgI.js";
import { e as useGetMyProfile } from "./useBackend-C2LF4Rc0.js";
import { U as User, C as ClipboardList } from "./user-SEIOHbBg.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "m9 16 2 2 4-4", key: "19s6y9" }]
];
const CalendarCheck = createLucideIcon("calendar-check", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
const QUICK_ACTIONS = [
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 24 }),
    title: "My Profile",
    description: "Update your personal details, health history, and planning goals.",
    href: "/dashboard",
    label: "Edit Profile",
    ocid: "client_area.profile_card",
    accent: "from-rose-500/10 to-pink-500/10 border-rose-200/60"
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 24 }),
    title: "Health Assessment",
    description: "Take or retake your fertility readiness assessment to get personalized guidance.",
    href: "/assessment",
    label: "Start Assessment",
    ocid: "client_area.assessment_card",
    accent: "from-primary/10 to-accent/10 border-primary/20"
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { size: 24 }),
    title: "My Dashboard",
    description: "View your full health overview, appointments, and progress summary.",
    href: "/dashboard",
    label: "Go to Dashboard",
    ocid: "client_area.dashboard_card",
    accent: "from-secondary/10 to-accent/10 border-secondary/20"
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { size: 24 }),
    title: "Book Consultation",
    description: "Schedule a 30-minute one-on-one consultation with our fertility specialists.",
    href: "/booking",
    label: "Book Now",
    ocid: "client_area.booking_card",
    accent: "from-rose-400/10 to-primary/10 border-rose-300/40"
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 24 }),
    title: "Read the Blog",
    description: "Browse our latest articles, tips, and evidence-based fertility insights.",
    href: "/blog",
    label: "Read Articles",
    ocid: "client_area.blog_card",
    accent: "from-accent/10 to-secondary/10 border-accent/20"
  }
];
function ClientAreaPage() {
  var _a;
  const { data: profile, isLoading: profileLoading } = useGetMyProfile();
  const { isAuthenticated } = useAuth();
  const displayName = ((_a = profile == null ? void 0 : profile.displayName) == null ? void 0 : _a.trim()) || (isAuthenticated ? "there" : "there");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "relative overflow-hidden bg-gradient-to-br from-rose-50 via-background to-primary/5 border-b border-border",
        "data-ocid": "client_area.hero_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute -top-20 -right-20 w-80 h-80 rounded-full bg-rose-200/20 blur-3xl pointer-events-none",
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none",
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 md:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start gap-4 max-w-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-700 text-xs font-body font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 12, className: "fill-rose-500 text-rose-500" }),
              "Client Area"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight", children: profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Skeleton,
              {
                className: "h-12 w-72",
                "data-ocid": "client_area.name_loading"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "Welcome back,",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary capitalize", children: displayName }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Sparkles,
                {
                  size: 28,
                  className: "inline text-rose-400 align-middle",
                  "aria-hidden": "true"
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-base md:text-lg leading-relaxed", children: "This is your personal space at Conception Clinic. Everything you need — your profile, assessment, appointments, and resources — is one click away." })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-background py-12 md:py-16",
        "data-ocid": "client_area.actions_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl md:text-2xl font-semibold text-foreground", children: "Quick Actions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm mt-1", children: "Jump directly to any part of your journey" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: QUICK_ACTIONS.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: `group relative overflow-hidden border bg-gradient-to-br ${action.accent} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`,
              "data-ocid": action.ocid,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 flex flex-col gap-4 h-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-xl bg-card flex items-center justify-center text-primary shadow-sm border border-border/60 flex-shrink-0", children: action.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-base mb-1.5", children: action.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm leading-relaxed line-clamp-3", children: action.description })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: action.href,
                    "data-ocid": `${action.ocid}.link`,
                    className: "inline-flex items-center gap-1.5 text-sm font-body font-medium text-primary hover:text-primary/80 transition-colors group-hover:gap-2.5 duration-200",
                    children: [
                      action.label,
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 15, "aria-hidden": "true" })
                    ]
                  }
                )
              ] })
            },
            action.ocid
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-muted/40 border-t border-border py-10 md:py-14",
        "data-ocid": "client_area.cta_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 border border-rose-200 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 22, className: "text-rose-500 fill-rose-200" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl md:text-2xl font-semibold text-foreground mb-2", children: "Need personalised support?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm md:text-base mb-6 max-w-lg mx-auto", children: "Our specialists are here to guide you every step of the way — from fertility assessments to your Plan a Boy consultation." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              size: "lg",
              className: "bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth",
              "data-ocid": "client_area.book_consultation_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/booking", children: "Book a Consultation" })
            }
          )
        ] })
      }
    )
  ] });
}
export {
  ClientAreaPage
};
