import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth';
import { AuthVisualSide } from '@/components/auth/AuthVisualSide';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

const signUpSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the Terms of Service and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpPage: React.FC = () => {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData | 'auth', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name as keyof SignUpFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = signUpSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof SignUpFormData, string>> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof SignUpFormData] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      navigate('/onboarding', { replace: true });
    } catch (err: any) {
      setErrors({
        auth: err.message || 'Failed to create account. Please try again.',
      });
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
    <div className="min-h-screen bg-[#070A12] text-white flex flex-col lg:flex-row relative overflow-hidden">
      {/* LEFT COLUMN: Clean, Human & Vivid Video Showcase */}
      <AuthVisualSide
        videoSrc="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
        headline="A calmer, smarter way to learn."
        subheadline="Master complex subjects at your own pace with personalized study roadmaps and real-time clarity."
        quote="The adaptive roadmaps saved me hundreds of hours this semester. Concepts that took weeks now take days."
        authorName="Marcus Vance"
        authorRole="Pre-Med Scholar • 2nd Year"
        avatarSrc="/assets/avatars/male/focus_boy.png"
      />

      {/* RIGHT COLUMN: Clean, Modern & Human Input Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-14 relative z-10 bg-[#070A12]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md space-y-5"
        >
          {/* Header */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
              Create your account
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              Sign up in 30 seconds and start your personalized study experience.
            </p>
          </div>

          {/* Error Message */}
          {errors.auth && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5 shadow-sm">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errors.auth}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Full Name</span>
              </label>
              <div className="relative flex items-center">
                <input
                  name="fullName"
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full bg-[#0D121F] border text-white placeholder:text-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 ${
                    errors.fullName
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/25'
                      : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-rose-400 font-medium">{errors.fullName}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Email Address</span>
              </label>
              <div className="relative flex items-center">
                <input
                  name="email"
                  type="email"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-[#0D121F] border text-white placeholder:text-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 ${
                    errors.email
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/25'
                      : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Password</span>
                </label>
                <span className="text-[11px] text-slate-500">Min. 8 characters</span>
              </div>

              <div className="relative flex items-center">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-[#0D121F] border text-white placeholder:text-slate-500 rounded-xl px-4 py-2.5 pr-11 text-sm outline-none transition-all duration-200 ${
                    errors.password
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/25'
                      : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Confirm Password</span>
              </label>

              <div className="relative flex items-center">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-type your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-[#0D121F] border text-white placeholder:text-slate-500 rounded-xl px-4 py-2.5 pr-11 text-sm outline-none transition-all duration-200 ${
                    errors.confirmPassword
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/25'
                      : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-400 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="space-y-1 pt-0.5">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 hover:text-slate-300 select-none">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded bg-[#0D121F] border-slate-700 text-indigo-600 focus:ring-indigo-500/30 accent-indigo-600 cursor-pointer"
                />
                <span className="leading-snug">
                  I agree to the{' '}
                  <span className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
                    Privacy Policy
                  </span>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-xs text-rose-400 font-medium">{errors.acceptTerms}</p>
              )}
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="absolute inset-0 border-t border-slate-800" />
            <span className="relative px-3 bg-[#070A12] text-[11px] text-slate-400 uppercase tracking-wider font-mono">
              Or sign up with
            </span>
          </div>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-[#0D121F] hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-white transition-all duration-200 cursor-pointer shadow-sm group hover:scale-[1.01] active:scale-[0.99]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span>Sign up with Google</span>
          </button>

          {/* Link to Sign In */}
          <p className="text-xs text-slate-400 text-center pt-1">
            Already have an account?{' '}
            <Link
              to="/sign-in"
              className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-colors cursor-pointer"
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
