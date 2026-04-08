'use client';

import MetaPixel from '@/components/MetaPixel'; 
import HeroSection from '@/components/layout/HeroSection';
import PropertiesSection from '@/components/layout/PropertiesSection';
import FeaturesSection from '@/components/layout/FeaturesSection';
import ServicesSection from '@/components/layout/ServicesSection';
import FAQSection from '@/components/layout/FAQSection';
import CTASection from '@/components/layout/CTASection';


export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <MetaPixel />
      <HeroSection />
      <PropertiesSection />
      <FeaturesSection />
      <ServicesSection />
      <FAQSection />
      <CTASection />
      
    </div>
  );
}