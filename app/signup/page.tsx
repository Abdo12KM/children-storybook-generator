"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Checkbox,
} from "@heroui/react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { signUp, signInWithProvider, user, loading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
    { text: "Contains number", met: /\d/.test(formData.password) },
  ];

  const isPasswordValid = passwordRequirements.every((req) => req.met);
  const doPasswordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword.length > 0;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!isPasswordValid) {
      setError("Password does not meet requirements");
      setIsLoading(false);
      return;
    }

    if (!doPasswordsMatch) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(
          "Account created successfully! Please check your email to verify your account.",
        );
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await signInWithProvider(provider);
      if (error) {
        setError(error.message);
      }
      // Redirect will be handled by the auth callback
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="from-background via-background/95 to-primary/5 flex min-h-screen items-center justify-center bg-gradient-to-br">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl">
          <CardHeader className="flex flex-col pb-2 text-center">
            <h1 className="text-2xl font-bold">Create Your Account</h1>
            <p className="text-muted-foreground">
              Start creating magical stories for your children
            </p>
          </CardHeader>

          <CardBody className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-danger/10 border-danger/20 flex items-center space-x-2 rounded-lg border p-3"
              >
                <AlertCircle className="text-danger h-4 w-4" />
                <span className="text-danger text-sm">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-success/10 border-success/20 flex items-center space-x-2 rounded-lg border p-3"
              >
                <CheckCircle className="text-success h-4 w-4" />
                <span className="text-success text-sm">{success}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                startContent={
                  <User className="text-muted-foreground h-4 w-4" />
                }
                isRequired
              />

              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                startContent={
                  <Mail className="text-muted-foreground h-4 w-4" />
                }
                isRequired
              />

              <div className="space-y-2">
                <Input
                  type={isPasswordVisible ? "text" : "password"}
                  label="Password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  startContent={
                    <Lock className="text-muted-foreground h-4 w-4" />
                  }
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      {isPasswordVisible ? (
                        <EyeOff className="text-muted-foreground h-4 w-4" />
                      ) : (
                        <Eye className="text-muted-foreground h-4 w-4" />
                      )}
                    </button>
                  }
                  isRequired
                />

                {formData.password && (
                  <div className="space-y-1 px-1">
                    {passwordRequirements.map((req, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-xs"
                      >
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${req.met ? "bg-success" : "bg-muted-foreground/30"}`}
                        />
                        <span
                          className={
                            req.met ? "text-success" : "text-muted-foreground"
                          }
                        >
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Input
                type={isConfirmPasswordVisible ? "text" : "password"}
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                startContent={
                  <Lock className="text-muted-foreground h-4 w-4" />
                }
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() =>
                      setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                    }
                  >
                    {isConfirmPasswordVisible ? (
                      <EyeOff className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <Eye className="text-muted-foreground h-4 w-4" />
                    )}
                  </button>
                }
                isRequired
                isInvalid={
                  formData.confirmPassword.length > 0 && !doPasswordsMatch
                }
                errorMessage={
                  formData.confirmPassword.length > 0 && !doPasswordsMatch
                    ? "Passwords don't match"
                    : ""
                }
              />

              <Checkbox
                isSelected={acceptTerms}
                onValueChange={setAcceptTerms}
                size="sm"
                className="mb-2"
              >
                <span className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </Checkbox>

              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
                isDisabled={
                  !formData.fullName ||
                  !formData.email ||
                  !isPasswordValid ||
                  !doPasswordsMatch ||
                  !acceptTerms
                }
              >
                Create Account
              </Button>
            </form>

            <div className="relative">
              <Divider />
              <span className="bg-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md px-2 text-sm text-white dark:text-black">
                or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="ghost"
                onPress={() => handleSocialLogin("google")}
                isLoading={isLoading}
                className="w-full"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>

              <Button
                variant="ghost"
                onPress={() => handleSocialLogin("github")}
                isLoading={isLoading}
                className="w-full"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
