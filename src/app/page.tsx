'use client';

import * as React from 'react';
import { useClosetStore } from '@/store/closet-store';
import { Navigation } from '@/components/navigation';
import { HomeView } from '@/components/home-view';
import { WardrobeView } from '@/components/wardrobe-view';
import { OutfitGeneratorView } from '@/components/outfit-generator-view';
import { Onboarding } from '@/components/onboarding';

export default function Home() {
  const { userPreferences, initializeStore } = useClosetStore();
  const [view, setView] = React.useState<'home' | 'wardrobe' | 'outfit'>('home');

  React.useEffect(() => {
    initializeStore();
  }, []);

  if (!userPreferences.onboardingComplete) {
    return <Onboarding onComplete={() => setView('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <Navigation currentView={view} onViewChange={setView} />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {view === 'home' && <HomeView />}
        {view === 'wardrobe' && <WardrobeView />}
        {view === 'outfit' && <OutfitGeneratorView />}
      </main>

      {/* Footer */}
      <footer className="border-t py-4 mt-auto bg-muted/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Digital Closet • Shop Your Closet
        </div>
      </footer>
    </div>
  );
}
