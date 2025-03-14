
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

const VerifyEmail = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUserEmail = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. Please check your email again.");
        return;
      }

      try {
        const result = await verifyEmail(token);
        if (result.success) {
          setStatus("success");
          setMessage(result.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(result.message || "Email verification failed. Please try again.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during verification. Please try again.");
        console.error("Verification error:", error);
      }
    };

    verifyUserEmail();
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-background via-background/90">
      <div className="max-w-md w-full bg-card border border-border rounded-lg shadow-lg p-8">
        {status === "loading" && (
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Verifying your email...</h2>
            <p className="text-muted-foreground">Please wait while we verify your email address.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center text-center">
            <XCircle className="h-16 w-16 text-destructive mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button onClick={() => navigate("/")}>Return to Login</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
