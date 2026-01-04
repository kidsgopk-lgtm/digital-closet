'use client';

import * as React from 'react';
import { Shirt, Sparkles, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useClosetStore } from '@/store/closet-store';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const { updatePreferences } = useClosetStore();
  const [step, setStep] = React.useState(0);

  const steps = [
    {
      icon: Shirt,
      title: 'Welcome to Digital Closet',
      description: 'Your personal wardrobe manager that helps you shop your closet and never wonder "what should I wear" again.',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Organization',
      description: 'Snap photos of your clothes and our AI will automatically detect the category, colors, and material.',
    },
    {
      icon: MapPin,
      title: 'Weather-Based Suggestions',
      description: 'Get personalized outfit recommendations based on your local weather conditions.',
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    updatePreferences({ onboardingComplete: true });
    onComplete();
  };

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 space-y-6">
          {/* Progress Indicator */}
          <div className="flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === step ? 'w-8 bg-primary' : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="h-10 w-10 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">{currentStep.title}</h2>
            <p className="text-muted-foreground">{currentStep.description}</p>
          </div>

          {/* Actions */}
          <Button onClick={handleNext} className="w-full gap-2">
            {step === steps.length - 1 ? 'Get Started' : 'Continue'}
            <ArrowRight className="h-4 w-4" />
          </Button>

          {/* Skip */}
          {step > 0 && (
            <Button
              variant="ghost"
              onClick={handleComplete}
              className="w-full"
            >
              Skip
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
