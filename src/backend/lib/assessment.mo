import Types "../types/assessment";
import Common "../types/common";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  // 3 months in nanoseconds (90 * 24 * 60 * 60 * 1_000_000_000)
  let THREE_MONTHS_NS : Int = 7_776_000_000_000_000;

  public func submitAssessment(
    assessments : List.List<Types.Assessment>,
    nextId : Nat,
    userId : Common.UserId,
    req : Types.SubmitAssessmentRequest,
  ) : Types.Assessment {
    let riskProfile = computeRiskProfile(req.answers);
    let assessment : Types.Assessment = {
      id = nextId;
      userId = userId;
      answers = req.answers;
      riskProfile = riskProfile;
      createdAt = Time.now();
    };
    assessments.add(assessment);
    assessment;
  };

  public func getLatestAssessment(
    assessments : List.List<Types.Assessment>,
    userId : Common.UserId,
  ) : ?Types.Assessment {
    var latest : ?Types.Assessment = null;
    assessments.forEach(func(a : Types.Assessment) {
      if (Principal.equal(a.userId, userId)) {
        switch (latest) {
          case null { latest := ?a };
          case (?prev) {
            if (a.createdAt > prev.createdAt) { latest := ?a };
          };
        };
      };
    });
    latest;
  };

  public func canRetake(
    assessments : List.List<Types.Assessment>,
    userId : Common.UserId,
  ) : Bool {
    switch (getLatestAssessment(assessments, userId)) {
      case null true;
      case (?latest) {
        let elapsed : Int = Time.now() - latest.createdAt;
        elapsed >= THREE_MONTHS_NS;
      };
    };
  };

  public func computeRiskProfile(answers : [Types.Answer]) : Types.RiskProfile {
    let now = Time.now();
    var riskScore : Nat = 0;
    let recommendations : List.List<Types.Recommendation> = List.empty();

    // Q1: diet quality (nat, 1-5, higher = better)
    // Q2: exercise frequency (nat, 0-7 days/week)
    // Q3: stress level (nat, 1-5, higher = more stress)
    // Q4: sleep hours (nat, hours per night)
    // Q5: cycle regularity (bool, true = regular)
    // Q6: known conditions (bool, true = yes)
    // Q7: smoking (bool, true = smoker)
    // Q8: alcohol (nat, 0-7 drinks/week)
    // Q9: BMI category (nat, 1=underweight, 2=normal, 3=overweight, 4=obese)
    // Q10: supplements (bool, folic acid etc)

    for (answer in answers.vals()) {
      switch (answer.questionId, answer.value) {
        case (1, #nat_(diet)) {
          if (diet <= 2) {
            riskScore += 2;
            recommendations.add({
              category = "Nutrition";
              title = "Improve Your Diet Quality";
              description = "A nutrient-dense diet rich in folate, iron, and antioxidants significantly supports reproductive health. Focus on leafy greens, whole grains, legumes, and colorful vegetables. Consider consulting a registered dietitian specializing in preconception care.";
            });
          } else if (diet == 3) {
            riskScore += 1;
            recommendations.add({
              category = "Nutrition";
              title = "Fine-Tune Your Nutrition";
              description = "Your diet is moderate. Small improvements — such as increasing omega-3 fatty acids (found in fatty fish, walnuts, flaxseeds) and reducing processed foods — can meaningfully enhance fertility outcomes.";
            });
          };
        };
        case (2, #nat_(exercise)) {
          if (exercise == 0) {
            riskScore += 2;
            recommendations.add({
              category = "Lifestyle";
              title = "Begin a Regular Exercise Routine";
              description = "Physical activity supports hormonal balance and a healthy weight, both critical for fertility. Aim for at least 150 minutes of moderate-intensity activity per week (e.g., brisk walking, swimming, cycling).";
            });
          } else if (exercise >= 6) {
            riskScore += 1;
            recommendations.add({
              category = "Lifestyle";
              title = "Balance Exercise Intensity";
              description = "Excessive high-intensity exercise can disrupt menstrual cycles and lower fertility in some individuals. Ensure your routine includes rest days and adequate caloric intake to support your activity level.";
            });
          };
        };
        case (3, #nat_(stress)) {
          if (stress >= 4) {
            riskScore += 2;
            recommendations.add({
              category = "Stress";
              title = "Address Chronic Stress";
              description = "Elevated cortisol from chronic stress can suppress reproductive hormones including LH and FSH, affecting ovulation and sperm quality. Evidence-based strategies such as mindfulness-based stress reduction (MBSR), yoga, and cognitive-behavioural therapy have been shown to improve fertility outcomes.";
            });
          } else if (stress == 3) {
            riskScore += 1;
            recommendations.add({
              category = "Stress";
              title = "Strengthen Stress Resilience";
              description = "Moderate stress is common, but building consistent stress-management practices — such as regular relaxation techniques, social support, and quality sleep — creates a more favourable hormonal environment for conception.";
            });
          };
        };
        case (4, #nat_(sleep)) {
          if (sleep < 6) {
            riskScore += 2;
            recommendations.add({
              category = "Lifestyle";
              title = "Prioritise Sleep for Reproductive Health";
              description = "Inadequate sleep disrupts melatonin, cortisol, and reproductive hormone rhythms. Adults need 7–9 hours of quality sleep per night. Establish a consistent sleep schedule, reduce blue light exposure before bed, and address any sleep disorders with your healthcare provider.";
            });
          } else if (sleep > 9) {
            riskScore += 1;
            recommendations.add({
              category = "Lifestyle";
              title = "Review Your Sleep Patterns";
              description = "Consistently sleeping more than 9 hours may reflect an underlying health condition. Discuss with your doctor to rule out issues such as thyroid dysfunction or depression, which can affect both sleep and fertility.";
            });
          };
        };
        case (5, #bool_(regular)) {
          if (not regular) {
            riskScore += 3;
            recommendations.add({
              category = "Reproductive Health";
              title = "Investigate Irregular Menstrual Cycles";
              description = "Irregular cycles may indicate ovulatory dysfunction, polycystic ovary syndrome (PCOS), thyroid disorders, or other hormonal imbalances. We strongly recommend a consultation with a reproductive endocrinologist or gynaecologist to identify the underlying cause and begin appropriate management.";
            });
          };
        };
        case (6, #bool_(hasConditions)) {
          if (hasConditions) {
            riskScore += 3;
            recommendations.add({
              category = "Medical";
              title = "Optimise Management of Known Health Conditions";
              description = "Pre-existing conditions such as endometriosis, PCOS, diabetes, thyroid disorders, or autoimmune diseases require careful preconception management. Please book a specialist consultation to review your current treatment plan and any necessary adjustments before attempting conception.";
            });
          };
        };
        case (7, #bool_(smokes)) {
          if (smokes) {
            riskScore += 3;
            recommendations.add({
              category = "Lifestyle";
              title = "Quit Smoking — Critical for Fertility";
              description = "Smoking is one of the most significant modifiable risk factors for impaired fertility. It reduces ovarian reserve, damages sperm DNA, and increases the risk of miscarriage and ectopic pregnancy. Evidence-based smoking cessation programmes, including NRT and behavioural support, are highly effective. Please speak with your GP today.";
            });
          };
        };
        case (8, #nat_(drinks)) {
          if (drinks >= 7) {
            riskScore += 2;
            recommendations.add({
              category = "Lifestyle";
              title = "Reduce Alcohol Consumption";
              description = "Heavy alcohol intake is associated with ovulatory dysfunction, reduced sperm quality, and increased miscarriage risk. Current guidance recommends avoiding alcohol entirely when trying to conceive, or limiting to no more than 1–2 units occasionally. Please discuss alcohol reduction strategies with your healthcare provider.";
            });
          } else if (drinks >= 3) {
            riskScore += 1;
            recommendations.add({
              category = "Lifestyle";
              title = "Minimise Alcohol When Trying to Conceive";
              description = "Moderate alcohol consumption can subtly affect hormonal balance and early embryonic development. The safest approach when planning pregnancy is to reduce intake as much as possible, ideally to zero.";
            });
          };
        };
        case (9, #nat_(bmi)) {
          if (bmi == 1 or bmi == 4) {
            riskScore += 2;
            recommendations.add({
              category = "Nutrition";
              title = "Achieve a Healthy Weight Range";
              description = "Both underweight and obesity significantly impact reproductive hormones, ovulation, and fertility treatment outcomes. Working with a multidisciplinary team including a dietitian and your GP to reach a healthy BMI (18.5–24.9) before conception is recommended.";
            });
          } else if (bmi == 3) {
            riskScore += 1;
            recommendations.add({
              category = "Nutrition";
              title = "Work Towards a Healthier Weight";
              description = "Being in the overweight range can increase the risk of gestational diabetes, hypertension, and reduce response to fertility treatments. Modest weight loss of 5–10% has been shown to restore ovulation and improve fertility outcomes substantially.";
            });
          };
        };
        case (10, #bool_(takesSupplement)) {
          if (not takesSupplement) {
            riskScore += 1;
            recommendations.add({
              category = "Nutrition";
              title = "Start Preconception Supplements";
              description = "Folic acid (400–800 mcg/day) is recommended for all individuals planning pregnancy to reduce neural tube defects. Additional supplements such as vitamin D, iron, iodine, and CoQ10 may be advised depending on your individual profile. Please discuss with your healthcare provider or pharmacist.";
            });
          };
        };
        case _ {};
      };
    };

    let overallRisk : Types.RiskLevel = if (riskScore == 0) {
      #optimized;
    } else if (riskScore <= 4) {
      #areasToImprove;
    } else {
      #consultSpecialist;
    };

    {
      overallRisk = overallRisk;
      recommendations = recommendations.toArray();
      completedAt = now;
    };
  };
};
