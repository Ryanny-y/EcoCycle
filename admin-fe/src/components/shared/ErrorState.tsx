import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

export const ErrorState = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  retryLabel = "Retry",
  className = "",
}: ErrorStateProps) => {
  const [retrying, setRetrying] = useState(false);

  const retry = async () => {
    if (retrying) return;

    setRetrying(true);

    try {
      if (onRetry) {
        await onRetry(); 
      }
    } catch (error) {
      console.error("Retry failed", error);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-4 space-y-4 ${className}`}
    >
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-6 w-6" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <p className="text-sm text-muted-foreground max-w-md">{message}</p>

      {onRetry && (
        <Button
          disabled={retrying}
          variant="outline"
          className="hover:bg-white!"
          onClick={retry}
        >
          {retrying ? <Spinner /> : retryLabel}
        </Button>
      )}
    </div>
  );
};
