import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, ArrowRight, ArrowLeft, Lock } from 'lucide-react';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignInPage: React.FC = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);

  const from = (location.state as any)?.from?.pathname || '/app/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SignInFormData | 'auth', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Background Video Fade Logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = '0';

    const handleCanPlay = () => {
      video.play().catch(() => {});
      video.style.transition = 'opacity 800ms ease-in-out';
      video.style.opacity = '0.5';
    };

    video.addEventListener('canplay', handleCanPlay);
    if (video.readyState >= 3) handleCanPlay();

    return () => video.removeEventListener('canplay', handleCanPlay);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof SignInFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = signInSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof SignInFormData, string>> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof SignInFormData] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn({
        email: formData.email,
        password: formData.password,
      });
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrors({ auth: err.message || 'Invalid credentials. Please check your email and password.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setErrors({ auth: err.message || 'Google Sign-In failed.' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative overflow-hidden">
      {/* LEFT COLUMN: Unique 3D Video & Editorial Display */}
      <div className="lg:w-1/2 relative bg-black border-b lg:border-b-0 lg:border-r border-white/10 p-8 lg:p-16 flex flex-col justify-between overflow-hidden min-h-[500px] lg:min-h-screen">
        {/* Unique Background HD 3D Video Clip for Sign In */}
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Liquid Glass Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#B9A7FF]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Bar with Back Button & Brand Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#8DD3FF]/15 border border-[#8DD3FF]/30 flex items-center justify-center liquid-glass group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-[#8DD3FF]" />
            </div>
            <span className="font-display text-2xl text-white font-normal tracking-tight">Aether Learn</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#B9A7FF]" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Editorial Headline */}
        <div className="relative z-10 my-12 lg:my-0 max-w-lg space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass text-xs font-medium text-[#B9A7FF] border border-[#B9A7FF]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome Back</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.12] tracking-tight">
            "Welcome back to your adaptive learning graph."
          </h1>

          <p className="text-sm text-white/70 leading-relaxed font-sans">
            Pick up right where you left off. Continue mastering concepts and building deep subject clarity.
          </p>
        </div>

        {/* Security Pill */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-white/60">
          <Lock className="w-4 h-4 text-[#8DD3FF]" />
          <span>Secure Session Authentication</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Sign In Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-black relative z-10">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-3xl font-semibold text-white tracking-tight font-display">
              Sign in to your account
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-white/60 font-sans">
              Enter your credentials to access your personalized learning dashboard.
            </p>
          </div>

          {errors.auth && (
            <div className="p-3.5 rounded-xl bg-[#FF8B8B]/10 border border-[#FF8B8B]/30 text-xs text-[#FF8B8B]">
              {errors.auth}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-white/70">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent if registered.')}
                  className="text-xs text-[#8DD3FF] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <Input
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 bg-[#8DD3FF] text-[#05070A] hover:bg-[#a6deff] font-semibold cursor-pointer"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Social Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 border-t border-white/10" />
            <span className="relative px-3 bg-black text-[11px] text-white/50 uppercase tracking-wider">
              Or continue with
            </span>
          </div>

          <Button
            variant="secondary"
            className="w-full flex items-center justify-center gap-2 text-xs liquid-glass text-white hover:bg-white/10 cursor-pointer"
            onClick={handleGoogleSignIn}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
            Sign in with Google
          </Button>

          <p className="text-xs text-white/60 text-center pt-2">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-[#8DD3FF] font-medium hover:underline cursor-pointer">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
