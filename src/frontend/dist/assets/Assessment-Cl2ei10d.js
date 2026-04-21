import { r as reactExports, j as jsxRuntimeExports, L as Layout, S as Skeleton, a as Link, B as Button } from "./index-DAu_OpgI.js";
import { B as Badge } from "./badge-CgnUsyW4.js";
import { b as useGetMyLatestAssessment, c as useCanRetakeAssessment, d as useSubmitAssessment, R as RiskLevel } from "./useBackend-C2LF4Rc0.js";
import { u as ue } from "./index-3noMWPg1.js";
import { C as CircleAlert, T as TrendingUp } from "./trending-up-CqfdzLgD.js";
import { C as CircleCheckBig } from "./circle-check-big-BDmBJTWE.js";
const QUESTIONS = [
  {
    id: 1n,
    text: "How old are you?",
    type: "nat",
    hint: "Enter your age in years"
  },
  {
    id: 2n,
    text: "Do you currently smoke or use tobacco products?",
    type: "bool"
  },
  {
    id: 3n,
    text: "How would you describe your current diet?",
    type: "text",
    hint: "e.g., balanced and varied, mostly plant-based, high in processed foods"
  },
  {
    id: 4n,
    text: "How many days per week do you engage in moderate or vigorous exercise?",
    type: "nat",
    hint: "Enter a number from 0 to 7"
  },
  {
    id: 5n,
    text: "Have you been diagnosed with any reproductive health conditions (e.g., PCOS, endometriosis, low sperm count)?",
    type: "bool"
  },
  {
    id: 6n,
    text: "What is your current BMI category?",
    type: "text",
    hint: "e.g., underweight, normal weight, overweight, obese"
  },
  {
    id: 7n,
    text: "How would you rate your average stress level over the past month?",
    type: "text",
    hint: "e.g., low, moderate, high, very high"
  },
  {
    id: 8n,
    text: "How many hours of sleep do you typically get per night?",
    type: "nat",
    hint: "Enter average hours (e.g., 7)"
  },
  {
    id: 9n,
    text: "How regular is your menstrual or hormonal cycle?",
    type: "text",
    hint: "e.g., very regular, somewhat irregular, very irregular, not applicable"
  },
  {
    id: 10n,
    text: "Do you currently take any fertility-related supplements (e.g., folic acid, CoQ10, vitamin D)?",
    type: "bool"
  },
  {
    id: 11n,
    text: "How many alcoholic drinks do you consume per week on average?",
    type: "nat",
    hint: "Enter a number (0 if none)"
  },
  {
    id: 12n,
    text: "Are you regularly exposed to environmental factors that may affect fertility (e.g., pesticides, heavy metals, radiation)?",
    type: "bool"
  },
  {
    id: 13n,
    text: "Have you previously had any reproductive or fertility testing (e.g., semen analysis, hormone panel, HSG)?",
    type: "bool"
  },
  {
    id: 14n,
    text: "How many glasses of water (250ml) do you drink per day?",
    type: "nat",
    hint: "Enter a number (e.g., 8)"
  }
];
const RISK_CONFIG = {
  [RiskLevel.optimized]: {
    label: "Well Optimized",
    color: "text-secondary",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-8 h-8 text-secondary" }),
    description: "Your reproductive health indicators look great. Continue your current healthy practices."
  },
  [RiskLevel.areasToImprove]: {
    label: "Areas to Improve",
    color: "text-primary",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-8 h-8 text-primary" }),
    description: "There are some areas where targeted lifestyle adjustments could enhance your fertility readiness."
  },
  [RiskLevel.consultSpecialist]: {
    label: "Specialist Consultation Recommended",
    color: "text-destructive",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-8 h-8 text-destructive" }),
    description: "Based on your responses, we recommend scheduling a consultation with one of our specialists."
  }
};
function AssessmentPage() {
  var _a;
  const { data: latestAssessment, isLoading: loadingAssessment } = useGetMyLatestAssessment();
  const { data: canRetake, isLoading: loadingCanRetake } = useCanRetakeAssessment();
  const { mutateAsync: submitAssessment, isPending } = useSubmitAssessment();
  const [currentStep, setCurrentStep] = reactExports.useState(0);
  const [answers, setAnswers] = reactExports.useState({});
  const [submittedAssessment, setSubmittedAssessment] = reactExports.useState(null);
  const isLoading = loadingAssessment || loadingCanRetake;
  const hasExistingAssessment = !!latestAssessment || !!submittedAssessment;
  function handleAnswer(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId.toString()]: value }));
  }
  async function handleSubmit() {
    const builtAnswers = QUESTIONS.map((q) => {
      const raw = answers[q.id.toString()] ?? "";
      let value;
      if (q.type === "nat") {
        value = { __kind__: "nat", nat: BigInt(Number.parseInt(raw) || 0) };
      } else if (q.type === "bool") {
        value = { __kind__: "bool", bool: raw === "yes" };
      } else {
        value = { __kind__: "text", text: raw };
      }
      return { questionId: q.id, value };
    });
    try {
      const result = await submitAssessment({ answers: builtAnswers });
      setSubmittedAssessment(result);
      ue.success("Assessment submitted successfully!");
    } catch {
      ue.error("Failed to submit assessment. Please try again.");
    }
  }
  const currentQuestion = QUESTIONS[currentStep];
  const currentAnswer = answers[(_a = currentQuestion == null ? void 0 : currentQuestion.id) == null ? void 0 : _a.toString()] ?? "";
  const progress = (currentStep + 1) / QUESTIONS.length * 100;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col items-center justify-center py-16 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-full max-w-xl space-y-4",
        "data-ocid": "assessment.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-64 mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48 mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full" })
        ]
      }
    ) }) });
  }
  if (hasExistingAssessment && !canRetake) {
    const assessmentToShow = submittedAssessment ?? latestAssessment;
    const risk = assessmentToShow.riskProfile;
    const config = RISK_CONFIG[risk.overallRisk];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border py-12 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-2xl text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-semibold text-foreground mb-2", children: "Your Assessment Results" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body", children: "Based on your most recent submission" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "section",
        {
          className: "bg-background flex-1 py-12 px-4",
          "data-ocid": "assessment.results_section",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-2xl space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-8 shadow-clinical text-center space-y-4", children: [
              config.icon,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `${config.color} border-current font-body text-sm`,
                    children: config.label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground font-body text-sm leading-relaxed", children: config.description })
              ] })
            ] }),
            risk.recommendations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "Personalized Recommendations" }),
              risk.recommendations.map((rec) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "bg-card border border-border rounded-lg p-4 shadow-clinical",
                  "data-ocid": "assessment.recommendation.item",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body font-medium text-sm text-foreground", children: rec.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-xs text-muted-foreground mt-1 leading-relaxed", children: rec.description })
                  ]
                },
                rec.title
              ))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/booking",
                  "data-ocid": "assessment.book_consultation_button",
                  className: "flex-1",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full bg-primary text-primary-foreground", children: "Book a Consultation" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/guides",
                  "data-ocid": "assessment.view_guides_button",
                  className: "flex-1",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "w-full", children: "View Related Guides" })
                }
              )
            ] })
          ] })
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border py-10 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-semibold text-foreground mb-2", children: "Fertility Health Assessment" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground font-body text-sm", children: [
        "Answer ",
        QUESTIONS.length,
        " questions to receive personalized reproductive health insights."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-background flex-1 py-10 px-4",
        "data-ocid": "assessment.form_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm font-body text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Question ",
                currentStep + 1,
                " of ",
                QUESTIONS.length
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                Math.round(progress),
                "% complete"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-primary rounded-full transition-smooth",
                style: { width: `${progress}%` }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-border rounded-lg p-6 shadow-clinical mb-6",
              "data-ocid": "assessment.question_card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-xs text-primary font-medium uppercase tracking-wider mb-2", children: [
                  "Question ",
                  currentStep + 1
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground mb-4", children: currentQuestion.text }),
                currentQuestion.type === "bool" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: ["yes", "no"].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleAnswer(currentQuestion.id, opt),
                    "data-ocid": `assessment.bool_option_${opt}`,
                    className: `flex-1 py-3 rounded-lg border text-sm font-body font-medium transition-smooth capitalize ${currentAnswer === opt ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:border-primary/50"}`,
                    children: opt === "yes" ? "Yes" : "No"
                  },
                  opt
                )) }) : currentQuestion.type === "nat" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    min: 0,
                    value: currentAnswer,
                    onChange: (e) => handleAnswer(currentQuestion.id, e.target.value),
                    placeholder: currentQuestion.hint ?? "Enter a number",
                    "data-ocid": "assessment.number_input",
                    className: "w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                  }
                ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: currentAnswer,
                    onChange: (e) => handleAnswer(currentQuestion.id, e.target.value),
                    placeholder: currentQuestion.hint ?? "Type your answer",
                    "data-ocid": "assessment.text_input",
                    className: "w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                  }
                ) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setCurrentStep((s) => Math.max(0, s - 1)),
                disabled: currentStep === 0,
                "data-ocid": "assessment.prev_button",
                children: "Back"
              }
            ),
            currentStep < QUESTIONS.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => setCurrentStep((s) => s + 1),
                disabled: !currentAnswer,
                "data-ocid": "assessment.next_button",
                className: "bg-primary text-primary-foreground",
                children: "Next"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleSubmit,
                disabled: isPending || !currentAnswer,
                "data-ocid": "assessment.submit_button",
                className: "bg-primary text-primary-foreground",
                children: isPending ? "Submitting…" : "Submit Assessment"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AssessmentPage
};
