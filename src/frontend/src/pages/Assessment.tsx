import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCanRetakeAssessment,
  useGetMyLatestAssessment,
  useSubmitAssessment,
} from "@/hooks/useBackend";
import { RiskLevel } from "@/types";
import type { Answer, AnswerValue } from "@/types";
import { Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const QUESTIONS = [
  {
    id: 1n,
    text: "How old are you?",
    type: "nat" as const,
    hint: "Enter your age in years",
  },
  {
    id: 2n,
    text: "Do you currently smoke or use tobacco products?",
    type: "bool" as const,
  },
  {
    id: 3n,
    text: "How would you describe your current diet?",
    type: "text" as const,
    hint: "e.g., balanced and varied, mostly plant-based, high in processed foods",
  },
  {
    id: 4n,
    text: "How many days per week do you engage in moderate or vigorous exercise?",
    type: "nat" as const,
    hint: "Enter a number from 0 to 7",
  },
  {
    id: 5n,
    text: "Have you been diagnosed with any reproductive health conditions (e.g., PCOS, endometriosis, low sperm count)?",
    type: "bool" as const,
  },
  {
    id: 6n,
    text: "What is your current BMI category?",
    type: "text" as const,
    hint: "e.g., underweight, normal weight, overweight, obese",
  },
  {
    id: 7n,
    text: "How would you rate your average stress level over the past month?",
    type: "text" as const,
    hint: "e.g., low, moderate, high, very high",
  },
  {
    id: 8n,
    text: "How many hours of sleep do you typically get per night?",
    type: "nat" as const,
    hint: "Enter average hours (e.g., 7)",
  },
  {
    id: 9n,
    text: "How regular is your menstrual or hormonal cycle?",
    type: "text" as const,
    hint: "e.g., very regular, somewhat irregular, very irregular, not applicable",
  },
  {
    id: 10n,
    text: "Do you currently take any fertility-related supplements (e.g., folic acid, CoQ10, vitamin D)?",
    type: "bool" as const,
  },
  {
    id: 11n,
    text: "How many alcoholic drinks do you consume per week on average?",
    type: "nat" as const,
    hint: "Enter a number (0 if none)",
  },
  {
    id: 12n,
    text: "Are you regularly exposed to environmental factors that may affect fertility (e.g., pesticides, heavy metals, radiation)?",
    type: "bool" as const,
  },
  {
    id: 13n,
    text: "Have you previously had any reproductive or fertility testing (e.g., semen analysis, hormone panel, HSG)?",
    type: "bool" as const,
  },
  {
    id: 14n,
    text: "How many glasses of water (250ml) do you drink per day?",
    type: "nat" as const,
    hint: "Enter a number (e.g., 8)",
  },
];

const RISK_CONFIG: Record<
  RiskLevel,
  { label: string; color: string; icon: React.ReactNode; description: string }
> = {
  [RiskLevel.optimized]: {
    label: "Well Optimized",
    color: "text-secondary",
    icon: <CheckCircle className="w-8 h-8 text-secondary" />,
    description:
      "Your reproductive health indicators look great. Continue your current healthy practices.",
  },
  [RiskLevel.areasToImprove]: {
    label: "Areas to Improve",
    color: "text-primary",
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
    description:
      "There are some areas where targeted lifestyle adjustments could enhance your fertility readiness.",
  },
  [RiskLevel.consultSpecialist]: {
    label: "Specialist Consultation Recommended",
    color: "text-destructive",
    icon: <AlertCircle className="w-8 h-8 text-destructive" />,
    description:
      "Based on your responses, we recommend scheduling a consultation with one of our specialists.",
  },
};

export function AssessmentPage() {
  const { data: latestAssessment, isLoading: loadingAssessment } =
    useGetMyLatestAssessment();
  const { data: canRetake, isLoading: loadingCanRetake } =
    useCanRetakeAssessment();
  const { mutateAsync: submitAssessment, isPending } = useSubmitAssessment();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [submittedAssessment, setSubmittedAssessment] = useState<
    import("@/types").Assessment | null
  >(null);

  const isLoading = loadingAssessment || loadingCanRetake;
  const hasExistingAssessment = !!latestAssessment || !!submittedAssessment;

  function handleAnswer(questionId: bigint, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId.toString()]: value }));
  }

  async function handleSubmit() {
    const builtAnswers: Answer[] = QUESTIONS.map((q) => {
      const raw = answers[q.id.toString()] ?? "";
      let value: AnswerValue;
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
      toast.success("Assessment submitted successfully!");
    } catch {
      toast.error("Failed to submit assessment. Please try again.");
    }
  }

  const currentQuestion = QUESTIONS[currentStep];
  const currentAnswer = answers[currentQuestion?.id?.toString()] ?? "";
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
          <div
            className="w-full max-w-xl space-y-4"
            data-ocid="assessment.loading_state"
          >
            <Skeleton className="h-6 w-64 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (hasExistingAssessment && !canRetake) {
    const assessmentToShow = submittedAssessment ?? latestAssessment!;
    const risk = assessmentToShow.riskProfile;
    const config = RISK_CONFIG[risk.overallRisk];
    return (
      <Layout>
        <section className="bg-card border-b border-border py-12 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
              Your Assessment Results
            </h1>
            <p className="text-muted-foreground font-body">
              Based on your most recent submission
            </p>
          </div>
        </section>
        <section
          className="bg-background flex-1 py-12 px-4"
          data-ocid="assessment.results_section"
        >
          <div className="container mx-auto max-w-2xl space-y-6">
            <div className="bg-card border border-border rounded-lg p-8 shadow-clinical text-center space-y-4">
              {config.icon}
              <div>
                <Badge
                  variant="outline"
                  className={`${config.color} border-current font-body text-sm`}
                >
                  {config.label}
                </Badge>
                <p className="mt-3 text-muted-foreground font-body text-sm leading-relaxed">
                  {config.description}
                </p>
              </div>
            </div>
            {risk.recommendations.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-display font-semibold text-foreground">
                  Personalized Recommendations
                </h3>
                {risk.recommendations.map((rec) => (
                  <div
                    key={rec.title}
                    className="bg-card border border-border rounded-lg p-4 shadow-clinical"
                    data-ocid="assessment.recommendation.item"
                  >
                    <p className="font-body font-medium text-sm text-foreground">
                      {rec.title}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/booking"
                data-ocid="assessment.book_consultation_button"
                className="flex-1"
              >
                <Button className="w-full bg-primary text-primary-foreground">
                  Book a Consultation
                </Button>
              </Link>
              <Link
                to="/guides"
                data-ocid="assessment.view_guides_button"
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  View Related Guides
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-card border-b border-border py-10 px-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
            Fertility Health Assessment
          </h1>
          <p className="text-muted-foreground font-body text-sm">
            Answer {QUESTIONS.length} questions to receive personalized
            reproductive health insights.
          </p>
        </div>
      </section>

      <section
        className="bg-background flex-1 py-10 px-4"
        data-ocid="assessment.form_section"
      >
        <div className="container mx-auto max-w-2xl">
          {/* Progress */}
          <div className="mb-8 space-y-2">
            <div className="flex items-center justify-between text-sm font-body text-muted-foreground">
              <span>
                Question {currentStep + 1} of {QUESTIONS.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-smooth"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div
            className="bg-card border border-border rounded-lg p-6 shadow-clinical mb-6"
            data-ocid="assessment.question_card"
          >
            <p className="font-body text-xs text-primary font-medium uppercase tracking-wider mb-2">
              Question {currentStep + 1}
            </p>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              {currentQuestion.text}
            </h2>

            {currentQuestion.type === "bool" ? (
              <div className="flex gap-3">
                {["yes", "no"].map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => handleAnswer(currentQuestion.id, opt)}
                    data-ocid={`assessment.bool_option_${opt}`}
                    className={`flex-1 py-3 rounded-lg border text-sm font-body font-medium transition-smooth capitalize ${
                      currentAnswer === opt
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {opt === "yes" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            ) : currentQuestion.type === "nat" ? (
              <div>
                <input
                  type="number"
                  min={0}
                  value={currentAnswer}
                  onChange={(e) =>
                    handleAnswer(currentQuestion.id, e.target.value)
                  }
                  placeholder={currentQuestion.hint ?? "Enter a number"}
                  data-ocid="assessment.number_input"
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                />
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={currentAnswer}
                  onChange={(e) =>
                    handleAnswer(currentQuestion.id, e.target.value)
                  }
                  placeholder={currentQuestion.hint ?? "Type your answer"}
                  data-ocid="assessment.text_input"
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              disabled={currentStep === 0}
              data-ocid="assessment.prev_button"
            >
              Back
            </Button>
            {currentStep < QUESTIONS.length - 1 ? (
              <Button
                onClick={() => setCurrentStep((s) => s + 1)}
                disabled={!currentAnswer}
                data-ocid="assessment.next_button"
                className="bg-primary text-primary-foreground"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isPending || !currentAnswer}
                data-ocid="assessment.submit_button"
                className="bg-primary text-primary-foreground"
              >
                {isPending ? "Submitting…" : "Submit Assessment"}
              </Button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
