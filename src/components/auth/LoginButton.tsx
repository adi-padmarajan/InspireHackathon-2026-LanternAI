import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { LoginModal } from "./LoginModal";

interface LoginButtonProps {
  onSuccess?: () => void;
  variant?: "default" | "outline" | "ghost" | "lantern";
  className?: string;
}

export function LoginButton({
  onSuccess,
  variant = "default",
  className,
}: LoginButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        onClick={() => setShowModal(true)}
        className={className}
      >
        <LogIn className="h-4 w-4 mr-2" />
        Sign in with NetLink
      </Button>

      <LoginModal
        open={showModal}
        onOpenChange={setShowModal}
        onSuccess={onSuccess}
      />
    </>
  );
}
