import ProfileTypes "types/profile";
import AssessmentTypes "types/assessment";
import BookingTypes "types/booking";
import ContentTypes "types/content";
import BlogTypes "types/blog";
import Common "types/common";
import ContentLib "lib/content";
import BookingLib "lib/booking";
import ProfileMixin "mixins/profile-api";
import AssessmentMixin "mixins/assessment-api";
import BookingMixin "mixins/booking-api";
import ContentMixin "mixins/content-api";
import BlogMixin "mixins/blog-api";
import List "mo:core/List";
import Time "mo:core/Time";

actor {
  // --- User Profiles ---
  let profiles = List.empty<ProfileTypes.UserProfile>();

  // --- Assessments ---
  let assessments = List.empty<AssessmentTypes.Assessment>();
  let nextAssessmentId : Common.Counter = { var value = 0 };

  // --- Consultation Slots & Appointments ---
  let slots = List.empty<BookingTypes.ConsultationSlot>();
  let appointments = List.empty<BookingTypes.Appointment>();
  let nextAppointmentId : Common.Counter = { var value = 0 };
  var slotsSeeded : Bool = false;

  // --- Educational Content ---
  let articles = List.empty<ContentTypes.Article>();
  let nextArticleId : Common.Counter = { var value = 0 };
  var articlesSeeded : Bool = false;

  // --- Blog Posts ---
  let blogPosts = List.empty<BlogTypes.BlogPost>();
  let nextBlogPostId : Common.Counter = { var value = 0 };

  // --- Seed consultation slots for the next 30 days ---
  // Slots are seeded at actor initialization (runs once on fresh deploy)
  do {
    if (not slotsSeeded) {
      slotsSeeded := true;
      let now = Time.now();
      // Seed Mon–Fri slots at 09:00, 10:00, 11:00, 14:00, 15:00, 16:00 UTC
      // One day in nanoseconds
      let dayNs : Int = 24 * 60 * 60 * 1_000_000_000;
      let hourNs : Int = 60 * 60 * 1_000_000_000;
      // Slot times (hours offset from midnight UTC)
      let slotHours = [9, 10, 11, 14, 15, 16];
      var slotId : Nat = 0;
      // Start from tomorrow midnight UTC (approximate)
      let todayMidnightApprox = now - (now % dayNs);
      var day = 1;
      while (day <= 30) {
        let dayStart = todayMidnightApprox + (day * dayNs);
        // Determine day of week approximation: Jan 1 2024 was a Monday
        // Use day offset from a known Monday: 2024-01-01 00:00 UTC = 1704067200000000000 ns
        let knownMondayNs : Int = 1704067200_000_000_000;
        let daysSinceKnownMonday = (dayStart - knownMondayNs) / dayNs;
        let dayOfWeek = ((daysSinceKnownMonday % 7) + 7) % 7; // 0=Mon, 4=Fri, 5=Sat, 6=Sun
        if (dayOfWeek <= 4) { // Mon-Fri only
          for (h in slotHours.vals()) {
            let slotTime = dayStart + (h * hourNs);
            slots.add({
              id = slotId;
              startTime = slotTime;
              durationMinutes = 30;
              isAvailable = true;
            });
            slotId += 1;
          };
        };
        day += 1;
      };
      nextAppointmentId.value := 0;
    };
  };

  // --- Seed article library with real-world evidence-based content ---
  do {
    if (not articlesSeeded) {
      articlesSeeded := true;
      let now = Time.now();

      // Article 1 — Nutrition
      articles.add({
        id = nextArticleId.value;
        title = "Preconception Nutrition: Building the Foundation for a Healthy Pregnancy";
        content = "Good nutrition before conception is one of the most impactful steps you can take for reproductive health. A balanced preconception diet supports hormonal regulation, egg and sperm quality, and early embryonic development.\n\n**Folate and Folic Acid**\nFolate (the natural form found in food) and folic acid (the synthetic form used in supplements) are essential for preventing neural tube defects. Health authorities recommend 400–800 mcg of folic acid daily for at least one month before conception and throughout early pregnancy. Food sources include leafy greens (spinach, kale, romaine lettuce), legumes, avocado, and fortified cereals.\n\n**Antioxidants for Egg and Sperm Quality**\nOxidative stress impairs both egg maturation and sperm DNA integrity. Dietary antioxidants — including vitamins C and E, selenium, and beta-carotene — help neutralise free radicals. Prioritise colourful fruits and vegetables, nuts, seeds, and olive oil.\n\n**Healthy Fats and Omega-3s**\nOmega-3 fatty acids (DHA and EPA) play a role in hormone production and reducing inflammation. Fatty fish (salmon, sardines, mackerel), flaxseeds, chia seeds, and walnuts are excellent sources. If dietary intake is low, a high-quality omega-3 supplement may be warranted.\n\n**Iron**\nIron deficiency is common and can impair ovulatory function. Include lean red meat, legumes, tofu, and iron-fortified foods. Pair with vitamin C to enhance absorption.\n\n**Foods to Limit**\nReduce processed foods, trans fats, refined carbohydrates, and high-mercury fish (swordfish, king mackerel). Limit caffeine to under 200 mg/day and avoid alcohol when trying to conceive.\n\n**The Mediterranean Diet Advantage**\nThe Mediterranean dietary pattern — emphasising whole grains, legumes, fruits, vegetables, fish, and olive oil — has the strongest evidence base for improving fertility outcomes in both women and men.";
        category = #nutrition;
        citations = [
          { authors = "Gaskins AJ, Chavarro JE"; title = "Diet and fertility: a review"; source = "Am J Obstet Gynecol. 2018;218(4):379-389"; year = 2018 },
          { authors = "Twigt JM et al."; title = "The preconception diet is associated with the chance of ongoing pregnancy in women undergoing IVF/ICSI treatment"; source = "Hum Reprod. 2012;27(8):2526-2531"; year = 2012 },
          { authors = "Skoracka K et al."; title = "Female fertility and the nutritional approach"; source = "Nutrients. 2021;13(6):2090"; year = 2021 },
        ];
        publishedAt = now;
        var updatedAt = now;
      });
      nextArticleId.value += 1;

      // Article 2 — Nutrition
      articles.add({
        id = nextArticleId.value;
        title = "Male Fertility Nutrition: How Diet Impacts Sperm Health";
        content = "Male factor infertility contributes to approximately 40–50% of all infertility cases, yet is often overlooked in preconception planning. Diet significantly influences sperm concentration, motility, morphology, and DNA integrity.\n\n**Key Micronutrients for Sperm Quality**\n\n*Zinc*: Essential for testosterone synthesis and sperm maturation. Found in oysters, lean red meat, pumpkin seeds, and legumes. Deficiency is associated with reduced sperm count and motility.\n\n*Selenium*: A trace mineral critical for the enzyme glutathione peroxidase, which protects sperm from oxidative damage. Brazil nuts (1–2 per day), tuna, and eggs are good sources.\n\n*Coenzyme Q10 (CoQ10)*: An endogenous antioxidant with robust evidence for improving sperm parameters in infertile men. Clinical doses of 200–300 mg/day have been studied.\n\n*Vitamin D*: Receptors for vitamin D are present on sperm, and deficiency is associated with impaired motility. Sun exposure and dietary sources (oily fish, fortified dairy) or supplements are recommended.\n\n**The Role of Antioxidants**\nMen with idiopathic infertility often have elevated seminal reactive oxygen species. A combination of vitamins C and E, zinc, selenium, and CoQ10 in supplement form has demonstrated clinically significant improvements in semen parameters in randomised controlled trials.\n\n**Dietary Patterns**\nThe Western dietary pattern (high in processed meats, refined carbohydrates, sugary beverages) is negatively associated with semen quality. In contrast, a diet rich in fish, fruits, vegetables, legumes, and whole grains correlates with better sperm parameters.\n\n**Practical Recommendations**\nAdopt a whole-food dietary pattern, minimise ultra-processed foods, stay well-hydrated, and consider a targeted antioxidant supplement regimen in consultation with your healthcare provider.";
        category = #nutrition;
        citations = [
          { authors = "Salas-Huetos A et al."; title = "Dietary patterns, foods and nutrients in male fertility parameters and fecundability"; source = "Hum Reprod Update. 2017;23(4):371-389"; year = 2017 },
          { authors = "Agarwal A et al."; title = "Male oxidative stress infertility (MOSI)"; source = "World J Mens Health. 2017;35(3):87-101"; year = 2017 },
          { authors = "Ahmadi S et al."; title = "Antioxidant supplements and semen parameters: An evidence based review"; source = "Int J Reprod Biomed. 2016;14(12):729-736"; year = 2016 },
        ];
        publishedAt = now;
        var updatedAt = now;
      });
      nextArticleId.value += 1;

      // Article 3 — Lifestyle
      articles.add({
        id = nextArticleId.value;
        title = "Exercise and Fertility: Finding the Right Balance";
        content = "Physical activity has a nuanced relationship with reproductive health — too little or too much can both negatively affect fertility, while regular moderate exercise supports hormonal balance, weight management, and overall health.\n\n**Benefits of Regular Moderate Exercise**\nModerate physical activity (150 minutes/week of moderate-intensity exercise) has been associated with improved fertility outcomes. Benefits include:\n- Improved insulin sensitivity, which is particularly relevant for women with PCOS\n- Reduced chronic inflammation\n- Better weight management and BMI optimisation\n- Improved mood, reduced anxiety and stress\n- Enhanced sleep quality\n\n**Exercise for Women**\nFor women without weight or hormonal concerns, moderate exercise appears to have a neutral to positive effect on fertility. Activities such as brisk walking, swimming, cycling, yoga, and light strength training are excellent choices.\n\nHowever, high-intensity, high-volume exercise — such as elite athletic training or marathon running — has been associated with hypothalamic amenorrhoea (loss of menstrual periods due to low energy availability). This is particularly common when exercise is combined with caloric restriction.\n\n**Exercise for Men**\nRegular moderate exercise is associated with higher sperm concentration, motility, and normal morphology. Conversely, sedentary behaviour and obesity are associated with poorer semen parameters.\n\nExtreme endurance athletes and those who use anabolic steroids or performance-enhancing drugs may experience suppressed testosterone and impaired spermatogenesis.\n\n**Key Recommendations**\n1. Aim for 150 minutes of moderate-intensity exercise per week\n2. Incorporate strength training 2–3 times per week\n3. Avoid prolonged sedentary periods — take regular movement breaks\n4. Ensure adequate caloric intake to match activity levels\n5. If menstrual irregularities develop, review exercise intensity and dietary intake\n6. Avoid anabolic steroids and performance-enhancing substances\n\n**Mind-Body Exercise**\nYoga and tai chi offer the added benefit of stress reduction alongside physical conditioning, making them particularly valuable during the preconception period.";
        category = #lifestyle;
        citations = [
          { authors = "Gudmundsdottir SL et al."; title = "Physical activity and fertility in women: The North-Trøndelag Health Study"; source = "Hum Reprod. 2009;24(12):3196-3204"; year = 2009 },
          { authors = "Vaamonde D et al."; title = "Physically active men show better semen parameters and hormone values than sedentary men"; source = "Eur J Appl Physiol. 2012;112(9):3267-3273"; year = 2012 },
          { authors = "Hakimi O, Cameron LC"; title = "Effect of exercise on ovulation: A systematic review"; source = "Sports Med. 2017;47(8):1555-1567"; year = 2017 },
        ];
        publishedAt = now;
        var updatedAt = now;
      });
      nextArticleId.value += 1;

      // Article 4 — Lifestyle
      articles.add({
        id = nextArticleId.value;
        title = "Sleep and Reproductive Health: Why Rest Matters for Fertility";
        content = "Sleep is a biological necessity, not a luxury — and its importance for reproductive health is increasingly recognised in the scientific literature. Sleep regulates the hormonal rhythms that govern ovulation, sperm production, and implantation.\n\n**The Hormonal Connection**\nThe hypothalamic-pituitary-gonadal (HPG) axis, which controls reproductive function, is tightly coupled with circadian rhythms. Disrupted sleep affects the pulsatile release of gonadotropin-releasing hormone (GnRH), luteinising hormone (LH), and follicle-stimulating hormone (FSH) — all critical to ovulation and sperm production.\n\nMelatonin, primarily a sleep hormone, is also present in follicular fluid and has antioxidant properties that protect developing oocytes. Sleep deprivation suppresses melatonin, potentially compromising egg quality.\n\n**Evidence from Research**\nA study of 656 Danish women found that those sleeping fewer than 6 or more than 9 hours had significantly reduced fecundability (probability of conceiving in a given cycle). Women working night shifts, with associated circadian disruption, also show higher rates of menstrual irregularity and longer time to conception.\n\nFor men, sleep restriction has been associated with reduced testosterone levels and poorer semen parameters.\n\n**Practical Sleep Hygiene for Fertility**\n- Aim for 7–9 hours of quality sleep per night\n- Maintain a consistent sleep-wake schedule, including weekends\n- Create a dark, cool, quiet sleep environment\n- Avoid screens (blue light) for 60–90 minutes before bed\n- Limit caffeine after 2 pm\n- Address sleep disorders (insomnia, sleep apnoea) with your healthcare provider — sleep apnoea is associated with hormonal disruption and should be treated before conception\n\n**Night Shift Workers**\nIf you work rotating shifts or nights, discuss strategies with your employer for minimising circadian disruption, and speak with your doctor about the impact on your fertility timeline.";
        category = #lifestyle;
        citations = [
          { authors = "Wise LA et al."; title = "Sleep duration and fecundability in a prospective cohort study"; source = "Fertil Steril. 2018;109(6):1025-1031"; year = 2018 },
          { authors = "Goldstein CA et al."; title = "Circadian disruption and fertility"; source = "Curr Sleep Med Rep. 2016;2(4):233-244"; year = 2016 },
          { authors = "Leproult R, Van Cauter E"; title = "Effect of 1 week of sleep restriction on testosterone levels in young healthy men"; source = "JAMA. 2011;305(21):2173-2174"; year = 2011 },
        ];
        publishedAt = now;
        var updatedAt = now;
      });
      nextArticleId.value += 1;

      // Article 5 — Stress
      articles.add({
        id = nextArticleId.value;
        title = "Stress, Cortisol, and Fertility: Understanding the Mind-Body Connection";
        content = "The relationship between stress and fertility is complex and bidirectional — infertility causes stress, and stress may, in turn, affect fertility. Understanding this connection helps individuals and couples take evidence-informed steps to support their reproductive health.\n\n**The Biological Mechanisms**\nChronic stress activates the hypothalamic-pituitary-adrenal (HPA) axis, leading to sustained elevation of cortisol. Cortisol suppresses the hypothalamic-pituitary-gonadal (HPG) axis, reducing pulsatile GnRH release and subsequently decreasing LH and FSH. This can delay or prevent ovulation in women and reduce testosterone and sperm production in men.\n\nAlpha-amylase, a salivary enzyme used as a biomarker for sympathetic nervous system activation (a stress proxy), has been associated with decreased fecundability in prospective studies.\n\n**What the Research Shows**\nA prospective study by Lynch et al. (2014) in 401 couples found that women with higher alpha-amylase levels had a 29% lower probability of conception per cycle and were twice as likely to meet the clinical definition of infertility. Elevated cortisol in the follicular phase has been associated with lower peak oestradiol and impaired follicular development.\n\nFor men, psychological stress is associated with lower sperm concentration, motility, and higher levels of sperm DNA fragmentation.\n\n**Evidence-Based Stress Reduction Strategies**\n\n*Mindfulness-Based Stress Reduction (MBSR)*: An 8-week programme with robust evidence for reducing perceived stress, anxiety, and depression. Studies in fertility populations show improved quality of life and, in some trials, higher pregnancy rates.\n\n*Cognitive-Behavioural Therapy (CBT)*: Addresses unhelpful thought patterns and emotional responses to fertility-related stress. Shown to reduce anxiety and depression in people undergoing IVF.\n\n*Yoga*: Combines physical movement, breathwork, and meditation. Studies in fertility populations demonstrate reductions in stress hormones and improved psychological well-being.\n\n*Acupuncture*: Some studies suggest a role in stress reduction and regulation of HPG axis function, though evidence for direct fertility improvement remains mixed.\n\n**Practical Steps**\n- Schedule 10–20 minutes of daily mindfulness or relaxation practice\n- Seek psychological support early if fertility stress becomes overwhelming\n- Communicate openly with your partner and consider couples counselling\n- Build a support network — peer support groups for people trying to conceive can reduce isolation\n- Prioritise activities that restore, not deplete, your energy";
        category = #stress;
        citations = [
          { authors = "Lynch CD et al."; title = "Preconception stress increases the risk of infertility: results from a couple-based prospective cohort study"; source = "Hum Reprod. 2014;29(5):1067-1075"; year = 2014 },
          { authors = "Nakamura K et al."; title = "The impact of stress on fertility treatment"; source = "J Obstet Gynaecol Res. 2008;34(1):1-8"; year = 2008 },
          { authors = "Domar AD et al."; title = "The impact of group psychological interventions on distress in infertile women"; source = "Health Psychol. 2000;19(6):568-575"; year = 2000 },
        ];
        publishedAt = now;
        var updatedAt = now;
      });
      nextArticleId.value += 1;

      // Article 6 — Stress
      articles.add({
        id = nextArticleId.value;
        title = "Managing Fertility-Related Anxiety: A Compassionate Guide";
        content = "The emotional journey of trying to conceive can be one of the most challenging experiences a person or couple faces. Fertility-related anxiety is common, understandable, and treatable — and addressing it proactively supports both your wellbeing and your reproductive health.\n\n**The Prevalence of Fertility Anxiety**\nStudies report that up to 40% of women undergoing fertility investigations or treatment meet clinical criteria for anxiety disorder, with rates of depression also significantly elevated compared with the general population. Partners often report equal or greater levels of distress, particularly when the male factor is involved.\n\n**How Anxiety Affects Fertility Treatment**\nHigh anxiety levels before and during IVF cycles have been associated in some studies with lower pregnancy rates, potentially through effects on cortisol, catecholamines, and immune function affecting implantation. Whether anxiety directly impairs natural conception is harder to study, but the association with avoidance of healthcare-seeking, lifestyle disruption, and relationship strain is clear.\n\n**Recognising When to Seek Help**\nConsider reaching out to a mental health professional if you experience:\n- Persistent worry about fertility that you cannot control\n- Avoidance of social situations (baby showers, announcements)\n- Strained relationship with your partner due to fertility stress\n- Difficulty functioning at work or in daily activities\n- Low mood, tearfulness, or loss of pleasure in previously enjoyed activities\n\n**Therapeutic Approaches**\n\n*Acceptance and Commitment Therapy (ACT)*: Particularly suited to fertility journeys, ACT helps individuals hold difficult emotions without being controlled by them, while clarifying personal values and taking meaningful action.\n\n*Fertility-Specific Counselling*: Many fertility clinics offer or can refer to counsellors who specialise in reproductive health. This is recommended by NICE (National Institute for Health and Care Excellence) guidelines.\n\n*Peer Support*: Online and in-person support groups (e.g., through Fertility Network UK) can provide normalisation, practical advice, and community.\n\n**A Note on Self-Compassion**\nInfertility is a medical condition, not a personal failure. Practising self-compassion — treating yourself with the kindness you would offer a friend — is both emotionally protective and evidence-based as an intervention for anxiety and depression.";
        category = #stress;
        citations = [
          { authors = "Domar AD et al."; title = "The prevalence and predictability of depression in infertile women"; source = "Fertil Steril. 1992;58(6):1158-1163"; year = 1992 },
          { authors = "Gameiro S et al."; title = "Psychological adjustment to the challenges of modern fertility care"; source = "Hum Reprod Update. 2013;19(5):474-488"; year = 2013 },
          { authors = "Boivin J et al."; title = "Evidence-based strategies for better outcomes from psychosocial interventions in infertility"; source = "Curr Opin Obstet Gynecol. 2012;24(3):208-214"; year = 2012 },
        ];
        publishedAt = now;
        var updatedAt = now;
      });
      nextArticleId.value += 1;

      // Article 7 — Sexual Health
      articles.add({
        id = nextArticleId.value;
        title = "Optimising Timing: Understanding Your Menstrual Cycle and Fertile Window";
        content = "Understanding your menstrual cycle is foundational to maximising your chances of natural conception. The fertile window — the days when intercourse is most likely to result in pregnancy — is narrower than many people realise.\n\n**The Fertile Window**\nPregnancy can only occur if intercourse takes place in the five days leading up to ovulation, or on the day of ovulation itself. This is because sperm can survive in the female reproductive tract for up to 5 days, while the egg is viable for only 12–24 hours after release.\n\nFor a woman with a regular 28-day cycle, ovulation typically occurs around day 14 (counting from the first day of menstruation). However, cycle length varies significantly between women, and even the same woman may ovulate on different days in different cycles.\n\n**Methods for Identifying the Fertile Window**\n\n*Basal Body Temperature (BBT)*: Your resting temperature rises by 0.2–0.5°C after ovulation due to progesterone. Daily measurement identifies the post-ovulatory rise, confirming that ovulation occurred. However, this is retrospective — the peak fertile days are before the rise.\n\n*Cervical Mucus Monitoring*: In the days around ovulation, cervical mucus becomes clear, slippery, and stretchy — resembling raw egg white. This is a reliable indicator of peak fertility. The Billings Ovulation Method and Creighton Model are evidence-based approaches to mucus monitoring.\n\n*LH Surge Testing (Ovulation Predictor Kits)*: Urine tests detect the luteinising hormone (LH) surge that precedes ovulation by 24–36 hours, giving reliable advance notice of the most fertile period. Digital versions with clear peak indicators are recommended for ease of use.\n\n*Fertility Monitors*: Devices such as Clearblue Advanced Fertility Monitor track both oestrogen (E3G) and LH to identify a wider fertile window of up to 6 days.\n\n**Recommended Intercourse Frequency**\nFor most couples, having intercourse every 1–2 days throughout the fertile window (without fixating excessively on timing) offers the best balance of sperm quality and conception probability. Daily intercourse during the fertile window is also effective and may be preferred.\n\n**When Cycles Are Irregular**\nIrregular cycles make the fertile window harder to predict. Ovulation testing, longer tracking periods, and consultation with a reproductive specialist are advisable if cycles vary by more than 7–9 days.";
        category = #sexualHealth;
        citations = [
          { authors = "Wilcox AJ et al."; title = "Timing of sexual intercourse in relation to ovulation"; source = "N Engl J Med. 1995;333(23):1517-1521"; year = 1995 },
          { authors = "Stanford JB, Mikolajczyk RT"; title = "Methodological review of the application of the calendar and Standard Days methods of family planning"; source = "J Biosoc Sci. 2002;34(2):169-182"; year = 2002 },
          { authors = "Colombo B, Masarotto G"; title = "Daily fecundability: first results from a new data base"; source = "Demogr Res. 2000;3:Article 5"; year = 2000 },
        ];
        publishedAt = now;
        var updatedAt = now;
      });
      nextArticleId.value += 1;

      // Article 8 — Sexual Health
      articles.add({
        id = nextArticleId.value;
        title = "Sexual Health and STIs: Protecting Your Future Fertility";
        content = "Sexual health is intrinsically linked to reproductive health. Sexually transmitted infections (STIs) — many of which are asymptomatic — are a leading preventable cause of infertility in both women and men.\n\n**How STIs Affect Fertility**\n\n*Chlamydia and Gonorrhoea*: The most common bacterial STIs, both can cause pelvic inflammatory disease (PID) in women when untreated. PID leads to scarring and blockage of the fallopian tubes, increasing the risk of ectopic pregnancy and infertility. In men, these infections can cause epididymo-orchitis, affecting sperm transport and quality. Crucially, the majority of chlamydia infections in women are asymptomatic.\n\n*Human Papillomavirus (HPV)*: Some HPV types affecting the cervix require treatment (LLETZ/cone biopsy) which, if extensive, may reduce cervical mucus production or cervical length — both relevant to fertility and pregnancy outcomes. HPV vaccination is recommended before sexual debut.\n\n*Mycoplasma Genitalium*: An emerging STI associated with PID, tubal factor infertility, and adverse pregnancy outcomes. It is increasingly antibiotic-resistant and requires specific testing.\n\n**The Case for Pre-Conception STI Screening**\nBefore attempting conception, both partners should consider STI screening, particularly for chlamydia and gonorrhoea, regardless of perceived risk. In the UK, the National Chlamydia Screening Programme recommends annual testing for all sexually active people under 25.\n\n**Prevention**\n- Consistent and correct condom use remains the most effective barrier against STI transmission\n- HPV vaccination is highly effective and recommended up to age 45 in many countries\n- Regular STI testing, particularly after new partners\n- Open communication with partners about sexual health history\n\n**If You Have Had a Previous STI or PID**\nIf you have a history of PID, ectopic pregnancy, or recurrent STIs, we recommend early referral to a reproductive specialist for tubal patency assessment (hysterosalpingography, laparoscopy) as part of your preconception evaluation.";
        category = #sexualHealth;
        citations = [
          { authors = "Haggerty CL, Ness RB"; title = "Newest approaches to treatment of pelvic inflammatory disease"; source = "Clin Infect Dis. 2007;44(7):953-960"; year = 2007 },
          { authors = "Westrom L et al."; title = "Pelvic inflammatory disease and fertility"; source = "Sex Transm Dis. 1992;19(4):185-192"; year = 1992 },
          { authors = "Manhart LE et al."; title = "Mycoplasma genitalium: Should we treat and how?"; source = "Clin Infect Dis. 2015;61(Suppl 8):S802-S808"; year = 2015 },
        ];
        publishedAt = now;
        var updatedAt = now;
      });
      nextArticleId.value += 1;

      // Article 9 — Reproductive Testing
      articles.add({
        id = nextArticleId.value;
        title = "Female Fertility Investigations: A Guide to Key Tests";
        content = "If you have been trying to conceive for 12 months (or 6 months if you are over 35, or sooner if you have known risk factors), a systematic fertility investigation is recommended. Understanding what tests are involved helps you engage confidently with your healthcare team.\n\n**Ovarian Reserve Testing**\n\n*Anti-Müllerian Hormone (AMH)*: AMH is produced by granulosa cells of small antral follicles and is the most reliable blood marker of ovarian reserve. It is relatively stable across the menstrual cycle and can be measured at any time. A low AMH does not mean pregnancy is impossible, but it does indicate a reduced egg supply and may guide treatment urgency.\n\n*Antral Follicle Count (AFC)*: A transvaginal ultrasound performed early in the menstrual cycle counts the number of resting follicles in both ovaries. AFC and AMH are the best predictors of ovarian response to stimulation.\n\n*Day 2–3 FSH and LH*: Elevated FSH on day 2–3 of the cycle suggests the pituitary is working harder to stimulate the ovaries — an indirect sign of diminished reserve.\n\n**Hormone Panel**\nA comprehensive hormonal screen includes:\n- FSH, LH, oestradiol (cycle day 2–3)\n- Prolactin (to rule out hyperprolactinaemia, which can suppress ovulation)\n- Thyroid function (TSH, free T4) — thyroid disorders are among the most common and treatable causes of ovulatory dysfunction\n- Testosterone and DHEAS (if PCOS or hyperandrogenism is suspected)\n- Day 21 progesterone (to confirm ovulation in a 28-day cycle)\n\n**Pelvic Ultrasound**\nTransvaginal ultrasound assesses uterine anatomy (fibroids, polyps, anomalies), ovarian morphology (polycystic appearance), and AFC. It is non-invasive and highly informative.\n\n**Tubal Assessment**\nFallopian tube patency is typically investigated when:\n- There is a history of PID, ectopic pregnancy, or abdominal surgery\n- Other tests suggest unexplained infertility\nMethods include hysterosalpingography (HSG — an X-ray dye test) and hysterosalpingo-contrast sonography (HyCoSy — an ultrasound equivalent). Laparoscopy with dye is the gold standard but is reserved for cases where direct visualisation is needed.\n\n**Genetic Testing**\nCarrier screening for conditions such as cystic fibrosis, spinal muscular atrophy, and fragile X syndrome is increasingly offered preconceptually. Pre-implantation genetic testing (PGT) is available as part of IVF for those with known genetic risks.";
        category = #reproductiveTesting;
        citations = [
          { authors = "La Marca A et al."; title = "Anti-Müllerian hormone (AMH) as a predictive marker in ART"; source = "Hum Reprod Update. 2010;16(2):113-130"; year = 2010 },
          { authors = "Broer SL et al."; title = "The role of antral follicle counts in the prediction of ovarian response and live birth in IVF: a systematic review and meta-analysis"; source = "Hum Reprod Update. 2013;19(5):520-528"; year = 2013 },
          { authors = "Practice Committee of the American Society for Reproductive Medicine"; title = "Diagnostic evaluation of the infertile female"; source = "Fertil Steril. 2015;103(6):e44-50"; year = 2015 },
        ];
        publishedAt = now;
        var updatedAt = now;
      });
      nextArticleId.value += 1;

      // Article 10 — Reproductive Testing
      articles.add({
        id = nextArticleId.value;
        title = "Semen Analysis: What the Results Mean and What to Do Next";
        content = "Semen analysis is the cornerstone of the male fertility investigation and should be one of the first tests performed when a couple is having difficulty conceiving. Despite this, it is often delayed or overlooked. A single normal semen analysis does not guarantee fertility, and a single abnormal result should always be repeated.\n\n**WHO 2021 Reference Values**\nThe World Health Organization updated its reference values for semen analysis in 2021, based on data from men who fathered pregnancies within 12 months:\n\n| Parameter | Lower Reference Limit |\n|---|---|\n| Semen volume | 1.4 mL |\n| Total sperm count | 39 million per ejaculate |\n| Sperm concentration | 16 million/mL |\n| Progressive motility | 30% |\n| Total motility | 42% |\n| Normal morphology (Kruger) | 4% |\n| Vitality (live sperm) | 54% |\n\n**Understanding Abnormal Results**\n\n*Oligospermia*: Low sperm count. May be idiopathic or related to varicocele, hormonal disorders, genetic factors, or lifestyle.\n\n*Asthenospermia*: Reduced sperm motility. Often related to oxidative stress, varicocele, or structural sperm defects.\n\n*Teratospermia*: High proportion of abnormally shaped sperm. Linked to oxidative stress, heat exposure, and some genetic conditions.\n\n*Azoospermia*: Complete absence of sperm in the ejaculate. Classified as obstructive (treatable by surgical sperm retrieval) or non-obstructive (requires investigation by a urologist/andrologist).\n\n**Advanced Sperm Testing**\nStandard semen analysis may not detect all causes of male factor infertility. Advanced tests include:\n- *Sperm DNA Fragmentation Index (DFI)*: High fragmentation is associated with failed fertilisation, poor embryo development, and recurrent miscarriage. Particularly relevant in unexplained infertility.\n- *Sperm Chromatin Structure Assay (SCSA)* and *TdT-mediated dUTP Nick-End Labelling (TUNEL)*: Methods for quantifying DNA damage.\n- *Sperm function tests* (e.g., acrosome reaction testing)\n\n**When to See a Urologist/Andrologist**\n- Azoospermia or severe oligospermia\n- Two consecutive abnormal semen analyses\n- Suspected hormonal disorder (low libido, gynaecomastia, undescended testes)\n- Family history of infertility or genetic disorders\n\n**Lifestyle Optimisation While Awaiting Results**\nIn parallel with investigations, men should adopt the nutritional and lifestyle strategies outlined in our other articles — improvements in semen parameters from lifestyle changes typically take 74 days (one spermatogenesis cycle) to manifest.";
        category = #reproductiveTesting;
        citations = [
          { authors = "WHO"; title = "WHO laboratory manual for the examination and processing of human semen, 6th edition"; source = "World Health Organization. 2021"; year = 2021 },
          { authors = "Esteves SC et al."; title = "Clinical significance of sperm DNA damage in male infertility"; source = "BJU Int. 2007;99(7):1597-1601"; year = 2007 },
          { authors = "Krausz C, Riera-Escamilla A"; title = "Genetics of male infertility"; source = "Nat Rev Urol. 2018;15(6):369-384"; year = 2018 },
        ];
        publishedAt = now;
        var updatedAt = now;
      });
      nextArticleId.value += 1;
    };
  };

  // --- Mixins ---
  include ProfileMixin(profiles);
  include AssessmentMixin(assessments, nextAssessmentId);
  include BookingMixin(slots, appointments, nextAppointmentId);
  include ContentMixin(articles, nextArticleId);
  include BlogMixin(blogPosts, nextBlogPostId);
};
