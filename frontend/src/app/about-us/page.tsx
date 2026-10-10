'use client';

import React from 'react';
import { AboutNavbar } from '@/components/about/AboutNavbar';
import { AboutHero } from '@/components/about/AboutHero';
import { MissionSection } from '@/components/about/MissionSection';
import { ImpactSection } from '@/components/about/ImpactSection';
import { StorySection } from '@/components/about/StorySection';
import { FinalCTA } from '@/components/about/FinalCTA';
import { AboutFooter } from '@/components/about/AboutFooter';

export default function AboutUsPage() {
  return (
    <div className="bg-white min-vh-100 d-flex flex-column" style={{ color: '#1C1917' }}>
      {/* SECTION A — Navigation */}
      <AboutNavbar />

      {/* SECTION B — Hero: More Than a Store */}
      <AboutHero />

      {/* SECTION C — Our Mission */}
      <MissionSection />

      {/* SECTION D — Impact Statistics */}
      <ImpactSection />

      {/* SECTION E — Our Story */}
      <StorySection />

      {/* SECTION F — Final CTA Banner */}
      <FinalCTA />

      {/* SECTION G — Footer */}
      <AboutFooter />
    </div>
  );
}
