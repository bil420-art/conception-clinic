import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Guides", href: "/guides" },
  { label: "Blog", href: "/blog" },
  { label: "Assessment", href: "/assessment", requiresAuth: true },
  { label: "Booking", href: "/booking", requiresAuth: true },
  { label: "Client Area", href: "/client-area", requiresAuth: true },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, login, logout, isLoading } = useAuth();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-clinical">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            data-ocid="header.logo_link"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 transition-smooth group-hover:bg-primary/15">
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
            <div className="min-w-0">
              <p className="font-display font-semibold text-foreground leading-tight text-base truncate">
                Conception Clinic
              </p>
              <p className="text-[10px] text-muted-foreground leading-none font-body tracking-wide truncate">
                Your Journey to Parenthood
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.filter((l) => !l.requiresAuth || isAuthenticated).map(
              (link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  data-ocid={`header.nav_${link.label.toLowerCase()}_link`}
                  className={`px-3 py-2 rounded-md text-sm font-body font-medium transition-smooth ${
                    pathname === link.href
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                data-ocid="header.nav_dashboard_link"
                className={`px-3 py-2 rounded-md text-sm font-body font-medium transition-smooth ${
                  pathname === "/dashboard"
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                My Dashboard
              </Link>
            )}
          </nav>

          {/* Auth Button + Mobile toggle */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                data-ocid="header.logout_button"
                className="hidden md:flex border-border text-muted-foreground hover:text-foreground transition-smooth"
              >
                Sign Out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => login()}
                disabled={isLoading}
                data-ocid="header.login_button"
                className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
              >
                {isLoading ? "Connecting…" : "Sign In"}
              </Button>
            )}

            <button
              type="button"
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
              data-ocid="header.mobile_menu_toggle"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card animate-slide-up">
          <nav className="container mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.filter((l) => !l.requiresAuth || isAuthenticated).map(
              (link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  data-ocid={`header.mobile_nav_${link.label.toLowerCase()}_link`}
                  className={`px-3 py-2.5 rounded-md text-sm font-body font-medium transition-smooth ${
                    pathname === link.href
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                data-ocid="header.mobile_nav_dashboard_link"
                className={`px-3 py-2.5 rounded-md text-sm font-body font-medium transition-smooth ${
                  pathname === "/dashboard"
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                My Dashboard
              </Link>
            )}
            <div className="pt-2 border-t border-border mt-1">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  data-ocid="header.mobile_logout_button"
                  className="w-full"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    login();
                    setMobileOpen(false);
                  }}
                  disabled={isLoading}
                  data-ocid="header.mobile_login_button"
                  className="w-full bg-primary text-primary-foreground"
                >
                  {isLoading ? "Connecting…" : "Sign In"}
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
