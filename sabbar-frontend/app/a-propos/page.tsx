'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle2, Users, Target, Zap, Shield, TrendingUp } from 'lucide-react';

export default function AProposPage() {
  return (
    <main style={{ background: 'linear-gradient(to bottom, #0D1F3C, #050D1A)' }}>

      {/* Back Button */}
      <div
        className="py-4 px-[5%] border-b"
        style={{ background: 'rgba(26, 40, 71, 0.5)', borderColor: 'rgba(200, 169, 110, 0.2)' }}
      >
        <div className="max-w-[1400px] mx-auto">
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#C8A96E',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={20} />
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="py-24 px-[5%]">
        <div className="max-w-3xl mx-auto text-center">
          <h1 style={{ fontSize: '52px', fontFamily: "'Cormorant Garamond', serif", color: '#F9F5EF' }}>
            A Propos de <span style={{ color: '#C8A96E' }}>Landmark Estate</span>
          </h1>
        </div>
      </section>

      {/* SECTION */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-16 items-start">

          {/* TEXT */}
          <div>
            <h2 style={{ fontSize: '42px', color: '#F9F5EF' }}>
              Notre <span style={{ color: '#C8A96E' }}>Histoire</span>
            </h2>

            <p style={{ color: '#8A9BB0', lineHeight: 1.8 }}>
              Landmark Estate est née pour améliorer la transparence du marché immobilier à Casablanca.
            </p>
          </div>

          {/* IMAGE CARD (FIXED) */}
          <div
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(200, 169, 110, 0.25)',
            }}
          >
            {/* IMAGE */}
            <div style={{ position: 'relative', width: '100%', height: '500px' }}>
              <Image
                src="/med-pic-propos2.0.jpeg"
                alt="Mohamed Sabbar"
                fill
                priority
                quality={100}
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* OVERLAY */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '160px',
                background: 'linear-gradient(to top, rgba(13,31,60,0.95), transparent)',
              }}
            />

            {/* TEXT */}
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                color: '#F9F5EF',
              }}
            >
              <h3 style={{ margin: 0 }}>Mohamed Sabbar</h3>
              <p style={{ color: '#C8A96E', fontSize: '12px' }}>
                Fondateur · Immobilier
              </p>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}