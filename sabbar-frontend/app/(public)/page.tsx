'use client';
import HeroSection from '@/components/layout/HeroSection';
import AboutSection from '@/components/layout/Aboutsection';
import PropertiesSection from '@/components/layout/PropertiesSection';
import ServicesSection from '@/components/layout/Servicessection';
import FAQSection from '@/components/layout/FAQSection';
import CTASection from '@/components/layout/CTASection';
export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <Aboutsection />
      
      {/* Properties Section - Section des biens immobiliers */}
      <PropertiesSection />

      {/* Services Section - Commercialisation et Intermédiaire */}
      <ServicesSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
