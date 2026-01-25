import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LoginModal({ open, onOpenChange, onSuccess }: LoginModalProps) {
  const { login } = useAuth();
  const [netlinkId, setNetlinkId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!netlinkId.trim()) {
      setError("Please enter your NetLink ID");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(netlinkId.trim());

      if (success) {
        setNetlinkId("");
        onOpenChange(false);
        onSuccess?.();
      } else {
        setError("Login failed. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img
              src="/uvic-logo.png"
              alt="UVic"
              className="h-6 w-6"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            Sign in with NetLink ID
          </DialogTitle>
          <DialogDescription>
            Enter your UVic NetLink ID to access personalized features like mood
            tracking and chat history.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="netlink-id">NetLink ID</Label>
            <Input
              id="netlink-id"
              placeholder="e.g., student123"
              value={netlinkId}
              onChange={(e) => setNetlinkId(e.target.value)}
              disabled={isLoading}
              autoFocus
              autoComplete="username"
            />
            <p className="text-xs text-muted-foreground">
              Demo mode: Enter any ID to continue
            </p>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
