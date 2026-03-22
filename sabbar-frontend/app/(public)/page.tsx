'use client';

import HeroSection from '@/components/layout/HeroSection';
import FeaturesSection from '@/components/layout/FeaturesSection';
import StatsSection from '@/components/layout/StatsSection';
import TestimonialsSection from '@/components/layout/TestimonialsSection';
import FAQSection from '@/components/layout/FAQSection';
import CTASection from '@/components/layout/CTASection';

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}