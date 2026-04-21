import { Layout } from "@/components/Layout";

export function HomePage() {
  return (
    <Layout>
      <div className="flex-1">
        {/* Hero Section */}
        <section className="bg-card border-b border-border py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-body text-primary font-medium">
                  Evidence-Based Reproductive Health Guidance
                </div>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
                  Guiding You with
                  <br />
                  <span className="text-primary">Compassion and Expertise</span>
                </h1>
                <p className="text-muted-foreground font-body text-lg leading-relaxed max-w-2xl lg:max-w-none">
                  Personalized care pathways for your reproductive health
                  journey — from preconception planning and fertility
                  optimization to our exclusive{" "}
                  <span className="text-primary font-semibold">
                    Plan a Boy programme
                  </span>{" "}
                  with a 99% success guarantee.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <a
                    href="/booking"
                    data-ocid="home.book_cta_button"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-body font-medium text-sm transition-smooth hover:bg-primary/90 shadow-clinical"
                  >
                    Schedule a Consultation
                  </a>
                  <a
                    href="/guides"
                    data-ocid="home.guides_cta_button"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-background text-foreground font-body font-medium text-sm transition-smooth hover:bg-muted/60"
                  >
                    Explore Health Guides
                  </a>
                </div>
              </div>

              {/* Hero Images */}
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:max-w-none">
                <div className="rounded-xl overflow-hidden shadow-elevated aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=600&auto=format&fit=crop&q=80"
                    alt="Expectant mother holding her baby bump, symbolising new life and hope"
                    className="w-full h-full object-cover transition-smooth hover:scale-105"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-elevated aspect-[3/4] mt-6">
                  <img
                    src="https://images.unsplash.com/photo-1609220136736-443140cfeaa5?w=600&auto=format&fit=crop&q=80"
                    alt="Happy pregnant couple celebrating their journey to parenthood together"
                    className="w-full h-full object-cover transition-smooth hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section
          className="py-16 px-4 sm:px-6 lg:px-8 bg-background"
          data-ocid="home.services_section"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-semibold text-foreground mb-3">
                Our Services
              </h2>
              <p className="text-muted-foreground font-body">
                Comprehensive support at every stage of your family planning
                journey
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🌿",
                  title: "Preconception Care",
                  description:
                    "Health preparation guidance from our clinical consultants, covering nutrition, lifestyle, and health screening.",
                  cta: "Learn More",
                  href: "/guides",
                },
                {
                  icon: "⚖️",
                  title: "Fertility Optimization",
                  description:
                    "Lifestyle and wellness strategies for optimizing fertility with data-backed approaches.",
                  cta: "Discover Approaches",
                  href: "/assessment",
                },
                {
                  icon: "👩‍⚕️",
                  title: "Expert Consultation",
                  description:
                    "Personalized guidance from specialists focusing on your unique reproductive health journey.",
                  cta: "Book a Session",
                  href: "/booking",
                },
              ].map((service, i) => (
                <div
                  key={service.title}
                  className="bg-card border border-border rounded-lg p-6 shadow-clinical flex flex-col gap-4 transition-smooth hover:shadow-elevated"
                  data-ocid={`home.service_card.${i + 1}`}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-lg mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-body leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <a
                    href={service.href}
                    className="mt-auto text-sm text-primary font-medium font-body hover:underline transition-smooth"
                    data-ocid={`home.service_cta.${i + 1}`}
                  >
                    {service.cta} →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plan a Boy — Dedicated Feature Section */}
        <section
          id="plan-a-boy"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/10 border-y border-secondary/20"
          data-ocid="home.plan_a_boy_section"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-sm font-body text-accent font-semibold">
                  ✨ Our Signature Programme
                </div>

                <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground leading-tight">
                  Plan Your
                  <br />
                  <span className="text-accent">Baby Boy</span>
                </h2>

                {/* 99% Guarantee Callout */}
                <div className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-5 py-3 rounded-xl shadow-clinical">
                  <span className="text-2xl font-display font-bold">99%</span>
                  <div>
                    <p className="text-xs font-body font-semibold uppercase tracking-wide opacity-80">
                      Clinically Supported
                    </p>
                    <p className="text-sm font-body font-semibold">
                      Success Rate Guarantee
                    </p>
                  </div>
                </div>

                <p className="text-foreground/80 font-body text-base leading-relaxed">
                  Our evidence-informed protocol combines the latest
                  reproductive science with personalised lifestyle guidance to
                  maximise your chances of conceiving a boy — safely, ethically,
                  and with expert support every step of the way.
                </p>

                {/* Bullet Points */}
                <ul
                  className="space-y-3"
                  data-ocid="home.plan_boy_benefits_list"
                >
                  {[
                    {
                      icon: "🔬",
                      id: "timing",
                      text: "Science-backed timing and ovulation protocols tailored to your cycle",
                    },
                    {
                      icon: "🥗",
                      id: "nutrition",
                      text: "Personalised nutrition and pH-optimisation dietary guidelines",
                    },
                    {
                      icon: "📊",
                      id: "monitoring",
                      text: "Continuous monitoring and adjustment for maximum success probability",
                    },
                    {
                      icon: "🤝",
                      id: "support",
                      text: "Dedicated specialist support from consultation through conception",
                    },
                  ].map((point, i) => (
                    <li
                      key={point.id}
                      className="flex items-start gap-3 text-foreground/80 font-body text-sm"
                      data-ocid={`home.plan_boy_benefit.${i + 1}`}
                    >
                      <span className="text-base mt-0.5 shrink-0">
                        {point.icon}
                      </span>
                      <span className="leading-relaxed">{point.text}</span>
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href="/assessment"
                    data-ocid="home.plan_boy_assessment_button"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-accent text-accent-foreground font-body font-semibold text-sm transition-smooth hover:bg-accent/90 shadow-clinical"
                  >
                    Start Your Assessment
                  </a>
                  <a
                    href="/booking"
                    data-ocid="home.plan_boy_booking_button"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-accent/40 bg-accent/5 text-foreground font-body font-medium text-sm transition-smooth hover:bg-accent/10"
                  >
                    Book a Consultation
                  </a>
                </div>
              </div>

              {/* Feature Image */}
              <div className="relative flex justify-center">
                <div className="rounded-2xl overflow-hidden shadow-elevated max-w-sm w-full">
                  <img
                    src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=700&auto=format&fit=crop&q=80"
                    alt="Joyful expectant mother cradling her baby bump — representing the hope of the Plan a Boy programme"
                    className="w-full h-[480px] object-cover"
                  />
                </div>
                {/* Floating stat card */}
                <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl px-5 py-4 shadow-elevated hidden sm:block">
                  <p className="font-display font-bold text-2xl text-primary">
                    500+
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    Families supported
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 border-y border-border"
          data-ocid="home.testimonials_section"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-semibold text-foreground mb-2">
                Patient Stories
              </h2>
              <p className="text-muted-foreground font-body text-sm">
                Trustworthy, human-centered approach
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  quote:
                    "The personalized guidance from Conception Clinic gave us the clarity and confidence we needed. Their evidence-based approach made all the difference in our journey.",
                  name: "Sarah & Michael T.",
                  role: "Patients, 2024",
                },
                {
                  quote:
                    "I appreciated the empathetic, non-judgmental care. Every recommendation was explained clearly and grounded in clinical experience. Truly exceptional support.",
                  name: "Priya R.",
                  role: "Patient, 2025",
                },
              ].map((testimonial, i) => (
                <div
                  key={testimonial.name}
                  className="bg-card border border-border rounded-lg p-6 shadow-clinical"
                  data-ocid={`home.testimonial.${i + 1}`}
                >
                  <p className="text-2xl text-primary/40 font-display leading-none mb-3">
                    "
                  </p>
                  <p className="text-foreground/80 font-body text-sm leading-relaxed italic mb-4">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-sm font-display font-semibold text-primary">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="font-body font-medium text-sm text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="py-16 px-4 sm:px-6 lg:px-8 bg-background"
          data-ocid="home.cta_section"
        >
          <div className="container mx-auto max-w-3xl text-center space-y-6">
            <h2 className="font-display text-3xl font-semibold text-foreground">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              Take our reproductive health assessment or book a consultation
              with our specialists. Your path to parenthood starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/assessment"
                data-ocid="home.assessment_cta_button"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-body font-medium text-sm transition-smooth hover:bg-primary/90 shadow-clinical"
              >
                Take the Assessment
              </a>
              <a
                href="/booking"
                data-ocid="home.booking_secondary_button"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-background text-foreground font-body font-medium text-sm transition-smooth hover:bg-muted/60"
              >
                Book a Consultation
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
