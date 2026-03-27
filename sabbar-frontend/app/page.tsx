'use client';

import HeroSection from '@/components/layout/HeroSection';
import FeaturesSection from '@/components/layout/FeaturesSection';  // ← Correction ici
import PropertiesSection from '@/components/layout/PropertiesSection';
import ServicesSection from '@/components/layout/ServicesSection';
import FAQSection from '@/components/layout/FAQSection';
import CTASection from '@/components/layout/CTASection';

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <PropertiesSection />
      <ServicesSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}