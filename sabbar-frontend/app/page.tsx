'use client';

import HeroSection from '@/components/layout/HeroSection';
import AboutSection from '@/components/layout/AboutSection';
import PropertiesSection from '@/components/layout/PropertiesSection';
import ServicesSection from '@/components/layout/ServicesSection';
import FAQSection from '@/components/layout/FAQSection';
import CTASection from '@/components/layout/CTASection';

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <AboutSection />
      <PropertiesSection />
      <ServicesSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}