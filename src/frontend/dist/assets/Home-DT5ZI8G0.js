import { j as jsxRuntimeExports, L as Layout } from "./index-DAu_OpgI.js";
function HomePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border py-20 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-6xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 text-center lg:text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-body text-primary font-medium", children: "Evidence-Based Reproductive Health Guidance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight", children: [
          "Guiding You with",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Compassion and Expertise" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground font-body text-lg leading-relaxed max-w-2xl lg:max-w-none", children: [
          "Personalized care pathways for your reproductive health journey — from preconception planning and fertility optimization to our exclusive",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: "Plan a Boy programme" }),
          " ",
          "with a 99% success guarantee."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center lg:justify-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "/booking",
              "data-ocid": "home.book_cta_button",
              className: "inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-body font-medium text-sm transition-smooth hover:bg-primary/90 shadow-clinical",
              children: "Schedule a Consultation"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "/guides",
              "data-ocid": "home.guides_cta_button",
              className: "inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-background text-foreground font-body font-medium text-sm transition-smooth hover:bg-muted/60",
              children: "Explore Health Guides"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 max-w-md mx-auto lg:max-w-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl overflow-hidden shadow-elevated aspect-[3/4]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=600&auto=format&fit=crop&q=80",
            alt: "Expectant mother holding her baby bump, symbolising new life and hope",
            className: "w-full h-full object-cover transition-smooth hover:scale-105"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl overflow-hidden shadow-elevated aspect-[3/4] mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "https://images.unsplash.com/photo-1609220136736-443140cfeaa5?w=600&auto=format&fit=crop&q=80",
            alt: "Happy pregnant couple celebrating their journey to parenthood together",
            className: "w-full h-full object-cover transition-smooth hover:scale-105"
          }
        ) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-16 px-4 sm:px-6 lg:px-8 bg-background",
        "data-ocid": "home.services_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-semibold text-foreground mb-3", children: "Our Services" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body", children: "Comprehensive support at every stage of your family planning journey" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
            {
              icon: "🌿",
              title: "Preconception Care",
              description: "Health preparation guidance from our clinical consultants, covering nutrition, lifestyle, and health screening.",
              cta: "Learn More",
              href: "/guides"
            },
            {
              icon: "⚖️",
              title: "Fertility Optimization",
              description: "Lifestyle and wellness strategies for optimizing fertility with data-backed approaches.",
              cta: "Discover Approaches",
              href: "/assessment"
            },
            {
              icon: "👩‍⚕️",
              title: "Expert Consultation",
              description: "Personalized guidance from specialists focusing on your unique reproductive health journey.",
              cta: "Book a Session",
              href: "/booking"
            }
          ].map((service, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-border rounded-lg p-6 shadow-clinical flex flex-col gap-4 transition-smooth hover:shadow-elevated",
              "data-ocid": `home.service_card.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl", children: service.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-lg mb-2", children: service.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body leading-relaxed", children: service.description })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: service.href,
                    className: "mt-auto text-sm text-primary font-medium font-body hover:underline transition-smooth",
                    "data-ocid": `home.service_cta.${i + 1}`,
                    children: [
                      service.cta,
                      " →"
                    ]
                  }
                )
              ]
            },
            service.title
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        id: "plan-a-boy",
        className: "py-20 px-4 sm:px-6 lg:px-8 bg-secondary/10 border-y border-secondary/20",
        "data-ocid": "home.plan_a_boy_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-6xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-sm font-body text-accent font-semibold", children: "✨ Our Signature Programme" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-4xl sm:text-5xl font-semibold text-foreground leading-tight", children: [
              "Plan Your",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "Baby Boy" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-3 bg-accent text-accent-foreground px-5 py-3 rounded-xl shadow-clinical", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-display font-bold", children: "99%" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body font-semibold uppercase tracking-wide opacity-80", children: "Clinically Supported" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body font-semibold", children: "Success Rate Guarantee" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/80 font-body text-base leading-relaxed", children: "Our evidence-informed protocol combines the latest reproductive science with personalised lifestyle guidance to maximise your chances of conceiving a boy — safely, ethically, and with expert support every step of the way." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "ul",
              {
                className: "space-y-3",
                "data-ocid": "home.plan_boy_benefits_list",
                children: [
                  {
                    icon: "🔬",
                    id: "timing",
                    text: "Science-backed timing and ovulation protocols tailored to your cycle"
                  },
                  {
                    icon: "🥗",
                    id: "nutrition",
                    text: "Personalised nutrition and pH-optimisation dietary guidelines"
                  },
                  {
                    icon: "📊",
                    id: "monitoring",
                    text: "Continuous monitoring and adjustment for maximum success probability"
                  },
                  {
                    icon: "🤝",
                    id: "support",
                    text: "Dedicated specialist support from consultation through conception"
                  }
                ].map((point, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    className: "flex items-start gap-3 text-foreground/80 font-body text-sm",
                    "data-ocid": `home.plan_boy_benefit.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base mt-0.5 shrink-0", children: point.icon }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "leading-relaxed", children: point.text })
                    ]
                  },
                  point.id
                ))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: "/assessment",
                  "data-ocid": "home.plan_boy_assessment_button",
                  className: "inline-flex items-center justify-center px-6 py-3 rounded-lg bg-accent text-accent-foreground font-body font-semibold text-sm transition-smooth hover:bg-accent/90 shadow-clinical",
                  children: "Start Your Assessment"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: "/booking",
                  "data-ocid": "home.plan_boy_booking_button",
                  className: "inline-flex items-center justify-center px-6 py-3 rounded-lg border border-accent/40 bg-accent/5 text-foreground font-body font-medium text-sm transition-smooth hover:bg-accent/10",
                  children: "Book a Consultation"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl overflow-hidden shadow-elevated max-w-sm w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=700&auto=format&fit=crop&q=80",
                alt: "Joyful expectant mother cradling her baby bump — representing the hope of the Plan a Boy programme",
                className: "w-full h-[480px] object-cover"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -bottom-4 -left-4 bg-card border border-border rounded-xl px-5 py-4 shadow-elevated hidden sm:block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-2xl text-primary", children: "500+" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Families supported" })
            ] })
          ] })
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 border-y border-border",
        "data-ocid": "home.testimonials_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-semibold text-foreground mb-2", children: "Patient Stories" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm", children: "Trustworthy, human-centered approach" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto", children: [
            {
              quote: "The personalized guidance from Conception Clinic gave us the clarity and confidence we needed. Their evidence-based approach made all the difference in our journey.",
              name: "Sarah & Michael T.",
              role: "Patients, 2024"
            },
            {
              quote: "I appreciated the empathetic, non-judgmental care. Every recommendation was explained clearly and grounded in clinical experience. Truly exceptional support.",
              name: "Priya R.",
              role: "Patient, 2025"
            }
          ].map((testimonial, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-border rounded-lg p-6 shadow-clinical",
              "data-ocid": `home.testimonial.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl text-primary/40 font-display leading-none mb-3", children: '"' }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/80 font-body text-sm leading-relaxed italic mb-4", children: testimonial.quote }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-sm font-display font-semibold text-primary", children: testimonial.name[0] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body font-medium text-sm text-foreground", children: testimonial.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: testimonial.role })
                  ] })
                ] })
              ]
            },
            testimonial.name
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "py-16 px-4 sm:px-6 lg:px-8 bg-background",
        "data-ocid": "home.cta_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-3xl text-center space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-semibold text-foreground", children: "Ready to Begin Your Journey?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body leading-relaxed", children: "Take our reproductive health assessment or book a consultation with our specialists. Your path to parenthood starts here." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "/assessment",
                "data-ocid": "home.assessment_cta_button",
                className: "inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-body font-medium text-sm transition-smooth hover:bg-primary/90 shadow-clinical",
                children: "Take the Assessment"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "/booking",
                "data-ocid": "home.booking_secondary_button",
                className: "inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-background text-foreground font-body font-medium text-sm transition-smooth hover:bg-muted/60",
                children: "Book a Consultation"
              }
            )
          ] })
        ] })
      }
    )
  ] }) });
}
export {
  HomePage
};
