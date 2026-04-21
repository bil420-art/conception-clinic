import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { Lock } from "lucide-react";
import { Layout } from "./Layout";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center py-24 px-4">
          <div className="w-full max-w-sm space-y-4">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
            <Skeleton className="h-10 w-32 mx-auto" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="flex-1 flex flex-col items-center justify-center py-24 px-4"
          data-ocid="protected.gate_section"
        >
          <div className="w-full max-w-md text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Sign in to continue
              </h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                This page is available to registered users. Sign in with
                Internet Identity to access your personalized health guidance
                and consultations.
              </p>
            </div>
            <Button
              onClick={() => login()}
              size="lg"
              data-ocid="protected.login_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth px-8"
            >
              Sign In with Internet Identity
            </Button>
            <p className="text-xs text-muted-foreground">
              Internet Identity provides secure, private authentication with no
              passwords or personal data.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return <>{children}</>;
}
