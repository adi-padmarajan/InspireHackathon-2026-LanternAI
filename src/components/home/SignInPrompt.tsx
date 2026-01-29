import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LoginButton } from "@/components/auth";

export const SignInPrompt = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="mt-10 flex flex-col items-center gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      <p className="text-lg text-muted-foreground">
        Sign in with your NetLink ID to get started
      </p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <LoginButton variant="lantern" onSuccess={() => navigate("/")} />
      </motion.div>
    </motion.div>
  );
};
