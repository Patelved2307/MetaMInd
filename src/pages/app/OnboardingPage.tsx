import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, BookOpen, User, GraduationCap, Target, Lightbulb } from 'lucide-react';
import { generateUsername } from '@/lib/avatarGenerator';

const EDUCATION_LEVELS = [
  'School',
  'Diploma',
  'Undergraduate',
  'Postgraduate',
  'Professional',
  'Self Learning',
  'Other',
];

const LEARNING_GOAL_OPTIONS = [
  'Understand academic subjects',
  'Prepare for exams',
  'Learn technical skills',
  'Improve problem solving',
  'Learn something new',
  'Other',
];

const EXPLANATION_STYLES = [
  'Simple and beginner-friendly',
  'Step-by-step',
  'Detailed explanation',
  'Real-world examples',
  'Visual / conceptual explanation',
];

export const OnboardingPage: React.FC = () => {
  const { user, profile, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const defaultName = profile?.full_name || user?.user_metadata?.full_name || '';
  const defaultUsername = profile?.username || generateUsername(defaultName || 'learner', user?.id || 'demo');

  const [formData, setFormData] = useState({
    fullName: defaultName,
    username: defaultUsername,
    educationLevel: 'Undergraduate',
    fieldOfStudy: '',
    institution: '',
    learningGoals: ['Understand academic subjects', 'Learn technical skills'] as string[],
    preferredExplanationStyle: 'Step-by-step',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleGoal = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.learningGoals.includes(goal);
      if (exists) {
        return { ...prev, learningGoals: prev.learningGoals.filter((g) => g !== goal) };
      } else {
        return { ...prev, learningGoals: [...prev.learningGoals, goal] };
      }
    });
  };

  const handleNext = () => {
    if (step === 1 && !formData.fullName.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (step === 3 && formData.learningGoals.length === 0) {
      setError('Please select at least one learning goal');
      return;
    }
    setError(null);
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await completeOnboarding(formData);
      navigate('/app/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-[#F4F5F7] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-2xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#8DD3FF]/15 border border-[#8DD3FF]/30 flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-[#8DD3FF]" />
          </div>
          <span className="font-display text-2xl text-[#F4F5F7]">Aether Setup</span>
        </div>
        <span className="text-xs text-[#8B94A3] font-medium">Step {step} of {totalSteps}</span>
      </header>

      {/* Progress Line */}
      <div className="max-w-2xl mx-auto w-full mb-8">
        <Progress value={(step / totalSteps) * 100} variant="accent" size="sm" />
      </div>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto w-full flex-1 flex items-center justify-center">
        <Card variant="default" className="w-full p-6 sm:p-10 border-white/10 relative overflow-hidden">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-[#FF8B8B]/10 border border-[#FF8B8B]/30 text-xs text-[#FF8B8B]">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: ABOUT YOU */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#8DD3FF]/10 text-[#8DD3FF]">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-3xl text-[#F4F5F7]">About You</h2>
                    <p className="text-xs text-[#8B94A3] mt-1">Let's set up your profile details.</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <Input
                    label="Full Name"
                    placeholder="Alex Chen"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                  <Input
                    label="Username (Optional)"
                    placeholder="alexchen"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    hint="Your unique handle in the platform"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 2: EDUCATION */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#B9A7FF]/10 text-[#B9A7FF]">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-3xl text-[#F4F5F7]">Education Background</h2>
                    <p className="text-xs text-[#8B94A3] mt-1">This helps tailor learning complexity.</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-[#8B94A3] mb-2">
                      Education Level
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {EDUCATION_LEVELS.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormData({ ...formData, educationLevel: level })}
                          className={`p-3 rounded-lg text-xs font-medium border text-left transition-all ${
                            formData.educationLevel === level
                              ? 'bg-[#8DD3FF]/15 border-[#8DD3FF] text-[#8DD3FF]'
                              : 'bg-[#05070A] border-white/10 text-[#8B94A3] hover:border-white/20'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Field of Study / Major (Optional)"
                    placeholder="e.g. Computer Science, Economics, Biology"
                    value={formData.fieldOfStudy}
                    onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                  />

                  <Input
                    label="Institution / School (Optional)"
                    placeholder="e.g. MIT, Stanford, Self-Taught"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 3: LEARNING GOAL */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#7ED6A5]/10 text-[#7ED6A5]">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-3xl text-[#F4F5F7]">What do you want to improve?</h2>
                    <p className="text-xs text-[#8B94A3] mt-1">Select all goals that apply to you.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {LEARNING_GOAL_OPTIONS.map((goal) => {
                    const isSelected = formData.learningGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleGoal(goal)}
                        className={`p-4 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#7ED6A5]/15 border-[#7ED6A5] text-[#F4F5F7]'
                            : 'bg-[#05070A] border-white/10 text-[#8B94A3] hover:border-white/20'
                        }`}
                      >
                        <span>{goal}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#7ED6A5]" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: LEARNING STYLE */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#F4C56A]/10 text-[#F4C56A]">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-3xl text-[#F4F5F7]">Explanation Preference</h2>
                    <p className="text-xs text-[#8B94A3] mt-1">How do you prefer concepts to be explained initially?</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {EXPLANATION_STYLES.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredExplanationStyle: style })}
                      className={`w-full p-4 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                        formData.preferredExplanationStyle === style
                          ? 'bg-[#F4C56A]/15 border-[#F4C56A] text-[#F4F5F7]'
                          : 'bg-[#05070A] border-white/10 text-[#8B94A3] hover:border-white/20'
                      }`}
                    >
                      <span>{style}</span>
                      {formData.preferredExplanationStyle === style && (
                        <CheckCircle2 className="w-4 h-4 text-[#F4C56A]" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: FINAL SUMMARY */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#8DD3FF]/10 text-[#8DD3FF]">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-3xl text-[#F4F5F7]">Setup Complete!</h2>
                    <p className="text-xs text-[#8B94A3] mt-1">Review your initial learning profile before launching.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#05070A] border border-white/10 space-y-3 text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-[#8B94A3]">Name</span>
                    <span className="font-medium text-[#F4F5F7]">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-[#8B94A3]">Education</span>
                    <span className="font-medium text-[#F4F5F7]">{formData.educationLevel}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-[#8B94A3]">Goals</span>
                    <span className="font-medium text-[#7ED6A5]">{formData.learningGoals.length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B94A3]">Explanation Style</span>
                    <span className="font-medium text-[#8DD3FF]">{formData.preferredExplanationStyle}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            {step > 1 ? (
              <Button variant="ghost" size="sm" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button variant="primary" size="md" onClick={handleNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleFinish}
                isLoading={isSubmitting}
                rightIcon={<Sparkles className="w-4 h-4" />}
              >
                Start My Learning Journey
              </Button>
            )}
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto w-full text-center py-4 text-xs text-[#8B94A3]">
        Aether Learn Adaptive AI Platform
      </footer>
    </div>
  );
};
