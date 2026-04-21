import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";

const year = new Date().getFullYear();
const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "conception-clinic")}`;

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Health Guides", href: "/guides" },
  { label: "Fertility Assessment", href: "/assessment" },
  { label: "Book a Consultation", href: "/booking" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-primary"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2C8.5 2 5.5 4.5 5 8c-.3 2 .5 4 2 5.5L12 22l5-8.5C18.5 12 19.3 10 19 8c-.5-3.5-3.5-6-7-6z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="8"
                    r="2.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div>
                <p className="font-display font-semibold text-foreground text-sm">
                  Conception Clinic
                </p>
                <p className="text-[10px] text-muted-foreground tracking-wide">
                  Your Journey to Parenthood
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Evidence-informed preconception care and fertility guidance for
              individuals and couples planning pregnancy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-foreground text-sm mb-4">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                    data-ocid={`footer.${link.label.toLowerCase().replace(/ /g, "_")}_link`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-foreground text-sm mb-4">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={14} className="text-primary flex-shrink-0" />
                <a
                  href="mailto:contact@conceptionclinic.health"
                  className="hover:text-primary transition-smooth truncate"
                >
                  contact@conceptionclinic.health
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={14} className="text-primary flex-shrink-0" />
                <a
                  href="tel:+18003378454"
                  className="hover:text-primary transition-smooth"
                >
                  +1-800-FERTILITY
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-xs text-muted-foreground font-body">
          <div className="flex flex-col gap-1 max-w-2xl">
            <p>
              <span className="font-medium text-foreground/70">
                Educational Disclaimer:
              </span>{" "}
              The content on this platform is for educational purposes only and
              does not constitute medical advice, diagnosis, or treatment.
              Always consult a qualified healthcare provider.
            </p>
            <p className="mt-1">
              <span className="text-muted-foreground/70">Privacy Policy</span>
              {" · "}
              <span className="text-muted-foreground/70">Terms of Use</span>
            </p>
          </div>
          <p className="flex-shrink-0 text-right">
            © {year}. Built with love using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-smooth"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
