'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Home, Plane, Waves, Plus, Minus } from 'lucide-react';

const CalculateurROI = () => {
  // État global
  const [purchasePrice, setPurchasePrice] = useState(1500000);
  const [useLoan, setUseLoan] = useState(true);
  const [downPayment, setDownPayment] = useState(300000);
  const [loanRate, setLoanRate] = useState(4.5);
  const [loanYears, setLoanYears] = useState(20);
  
  // Stratégies
  const [longTermRent, setLongTermRent] = useState(12000);
  const [longTermVacancy, setLongTermVacancy] = useState(8);
  const [longTermMgmt, setLongTermMgmt] = useState(10);
  const [longTermMaint, setLongTermMaint] = useState(2000);
  
  const [airbnbNight, setAirbnbNight] = useState(500);
  const [airbnbOccupancy, setAirbnbOccupancy] = useState(70);
  const [airbnbComm, setAirbnbComm] = useState(15);
  const [airbnbCleaning, setAirbnbCleaning] = useState(2000);
  const [airbnbConcierge, setAirbnbConcierge] = useState(1000);
  
  const [seasonalHighRate, setSeasonalHighRate] = useState(1200);
  const [seasonalLowRate, setSeasonalLowRate] = useState(600);
  const [seasonalHighNights, setSeasonalHighNights] = useState(120);
  const [seasonalLowNights, setSeasonalLowNights] = useState(180);
  const [seasonalCleaning, setSeasonalCleaning] = useState(1500);
  
  const [activeTab, setActiveTab] = useState('params');
  const [yearsToProject, setYearsToProject] = useState(20);

  // Calculs
  const loanAmount = useLoan ? (purchasePrice - downPayment) : 0;
  const monthlyRate = loanRate / 100 / 12;
  const numPayments = loanYears * 12;
  const monthlyPayment = loanAmount > 0 && useLoan
    ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : 0;

  const calculateStrategy = (annualGross: number, annualCharges: number, taxRate = 10) => {
    const gross = annualGross;
    const charges = annualCharges;
    const beforeTax = gross - charges;
    const taxes = Math.max(0, beforeTax * (taxRate / 100));
    const net = beforeTax - taxes;
    
    const annualMortgage = useLoan ? monthlyPayment * 12 : 0;
    const cashFlow = net - annualMortgage;
    
    const investmentBase = useLoan ? downPayment : purchasePrice;
    
    return {
      gross,
      charges,
      beforeTax,
      taxes,
      net,
      annualMortgage,
      cashFlow,
      grossYield: (gross / purchasePrice) * 100,
      netYield: (net / purchasePrice) * 100,
      cashOnCash: (cashFlow / investmentBase) * 100,
    };
  };

  // Stratégie 1: Longue durée
  const annualRentCollected = longTermRent * 12 * (100 - longTermVacancy) / 100;
  const longTermCharges = (annualRentCollected * longTermMgmt / 100) + longTermMaint + 2000;
  const longTermResult = calculateStrategy(annualRentCollected, longTermCharges, 10);

  // Stratégie 2: Airbnb
  const airbnbNightsPerYear = 365 * (airbnbOccupancy / 100);
  const airbnbAnnualGross = airbnbNight * airbnbNightsPerYear;
  const airbnbCharges = (airbnbAnnualGross * airbnbComm / 100) + (airbnbCleaning * (airbnbNightsPerYear / 10)) + airbnbConcierge + 3000;
  const airbnbResult = calculateStrategy(airbnbAnnualGross, airbnbCharges, 20);

  // Stratégie 3: Saisonnier
  const seasonalGross = (seasonalHighRate * seasonalHighNights) + (seasonalLowRate * seasonalLowNights);
  const seasonalCharges = (seasonalCleaning * ((seasonalHighNights + seasonalLowNights) / 10)) + 4000 + 5000;
  const seasonalResult = calculateStrategy(seasonalGross, seasonalCharges, 15);

  // Projection 20 ans
  const propertyAppreciation = 2;
  const projectionData = useMemo(() => {
    return Array.from({ length: yearsToProject + 1 }, (_, year) => {
      const propertyValue = purchasePrice * Math.pow(1 + propertyAppreciation / 100, year);
      
      let mortgageBalance = 0;
      if (useLoan && year < loanYears) {
        mortgageBalance = loanAmount * Math.pow(1 + monthlyRate, year * 12) / Math.pow(1 + monthlyRate, numPayments) * (Math.pow(1 + monthlyRate, numPayments) - Math.pow(1 + monthlyRate, year * 12)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
      }
      
      const equity = propertyValue - Math.max(0, mortgageBalance);
      
      const longTermCumulative = longTermResult.cashFlow * year;
      const airbnbCumulative = airbnbResult.cashFlow * year;
      const seasonalCumulative = seasonalResult.cashFlow * year;
      
      return {
        year,
        longTermTotal: longTermCumulative + equity,
        airbnbTotal: airbnbCumulative + equity,
        seasonalTotal: seasonalCumulative + equity,
        propertyValue,
        equity,
      };
    });
  }, [yearsToProject, useLoan]);

  // Composant pour les boutons +/-
  const NumberInputWithButtons = ({ value, onChange, step, label, suffix = '', min = 0 }) => (
    <div>
      <label className="block text-xs uppercase mb-3" style={{ color: '#C8A96E', letterSpacing: '1px', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>
        {label}
      </label>
      <div className="flex gap-3 items-stretch">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="px-3 py-2 rounded transition-all hover:bg-opacity-80 flex items-center justify-center"
          style={{ 
            backgroundColor: '#C8A96E40', 
            color: '#C8A96E', 
            border: '1px solid #C8A96E60',
            cursor: 'pointer',
            minWidth: '44px'
          }}
          title="Diminuer"
        >
          <Minus size={18} strokeWidth={3} />
        </button>
        
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(min, Number(e.target.value)))}
          className="flex-1 px-4 py-2 rounded text-center"
          style={{
            backgroundColor: 'rgba(249, 245, 239, 0.08)',
            color: '#E2C98A',
            border: '2px solid #C8A96E50',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '16px',
            fontWeight: '600',
            outline: 'none',
          }}
        />
        
        <button
          onClick={() => onChange(value + step)}
          className="px-3 py-2 rounded transition-all hover:bg-opacity-80 flex items-center justify-center"
          style={{ 
            backgroundColor: '#C8A96E40', 
            color: '#C8A96E', 
            border: '1px solid #C8A96E60',
            cursor: 'pointer',
            minWidth: '44px'
          }}
          title="Augmenter"
        >
          <Plus size={18} strokeWidth={3} />
        </button>
      </div>
      {suffix && <p style={{ color: '#C8A96E', fontSize: '13px', marginTop: '8px', fontWeight: '500', fontFamily: "'DM Sans', sans-serif" }}>{suffix}</p>}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D1F3C' }}>
      {/* Header */}
      <div className="relative overflow-hidden py-16 px-6 lg:py-24">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #C8A96E 0%, transparent 50%)',
        }}></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#C8A96E' + '20', border: '1px solid #C8A96E' }}>
              <TrendingUp size={24} style={{ color: '#C8A96E' }} />
            </div>
            <h1 className="text-sm uppercase tracking-widest font-bold" style={{ color: '#C8A96E', fontFamily: "'DM Sans', sans-serif" }}>
              Outil D'Analyse
            </h1>
          </div>

          <h1 className="text-5xl lg:text-6xl font-light mb-4" style={{ color: '#F9F5EF', fontFamily: "'Cormorant Garamond', serif" }}>
            Calculateur ROI <span style={{ color: '#C8A96E' }}>Immobilier</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: '#E2C98A', fontFamily: "'DM Sans', sans-serif" }}>
            Estimez votre rendement réel en comparant 3 stratégies d'investissement : location longue durée, Airbnb et location saisonnière.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex gap-4 border-b overflow-x-auto" style={{ borderColor: '#C8A96E' + '30' }}>
          {[
            { id: 'params', label: '⚙️ Paramètres' },
            { id: 'monthly', label: '💵 Flux Mensuels' },
            { id: 'compare', label: '📊 Comparatif' },
            { id: 'projection', label: '📈 Projection' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-6 py-4 font-medium text-sm transition-all whitespace-nowrap"
              style={{
                color: activeTab === tab.id ? '#C8A96E' : '#E2C98A',
                borderBottom: activeTab === tab.id ? '3px solid #C8A96E' : 'none',
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* TAB 1: PARAMÈTRES */}
        {activeTab === 'params' && (
          <div className="space-y-8">
            {/* Paramètres Généraux */}
            <div className="rounded-lg p-8" style={{ backgroundColor: '#0D1F3C' + 'cc', border: '1px solid #C8A96E30' }}>
              <h2 className="text-2xl font-bold mb-8" style={{ color: '#C8A96E', fontFamily: "'DM Sans', sans-serif" }}>
                💰 Paramètres Généraux
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <NumberInputWithButtons
                  value={purchasePrice}
                  onChange={setPurchasePrice}
                  step={1000000}
                  label="Prix d'achat (DH)"
                  suffix={`${(purchasePrice / 1000000).toFixed(2)}M DH`}
                />

                <div>
                  <label className="block text-xs uppercase mb-3" style={{ color: '#C8A96E', letterSpacing: '1px', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>
                    Mode de paiement
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setUseLoan(true)}
                      className="flex-1 px-4 py-3 rounded text-sm font-bold transition-all"
                      style={{
                        backgroundColor: useLoan ? '#C8A96E' : 'rgba(200, 169, 110, 0.15)',
                        color: useLoan ? '#0D1F3C' : '#C8A96E',
                        border: `2px solid #C8A96E${useLoan ? '99' : '40'}`,
                        fontFamily: "'DM Sans', sans-serif",
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Avec Crédit
                    </button>
                    <button
                      onClick={() => setUseLoan(false)}
                      className="flex-1 px-4 py-3 rounded text-sm font-bold transition-all"
                      style={{
                        backgroundColor: !useLoan ? '#C8A96E' : 'rgba(200, 169, 110, 0.15)',
                        color: !useLoan ? '#0D1F3C' : '#C8A96E',
                        border: `2px solid #C8A96E${!useLoan ? '99' : '40'}`,
                        fontFamily: "'DM Sans', sans-serif",
                        cursor: 'pointer',
                      }}
                    >
                      💰 Comptant
                    </button>
                  </div>
                </div>
              </div>

              {/* Section crédit - Visible seulement si crédit activé */}
              {useLoan && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(200, 169, 110, 0.08)', border: '1px solid #C8A96E40' }}>
                  <NumberInputWithButtons
                    value={downPayment}
                    onChange={setDownPayment}
                    step={100000}
                    label="Apport personnel (DH)"
                    suffix={`${((downPayment / purchasePrice) * 100).toFixed(1)}% du prix`}
                  />

                  <NumberInputWithButtons
                    value={loanRate}
                    onChange={setLoanRate}
                    step={0.1}
                    label="Taux de crédit (%)"
                    suffix={`Mensualité: ${monthlyPayment.toFixed(0)} DH`}
                  />

                  <NumberInputWithButtons
                    value={loanYears}
                    onChange={setLoanYears}
                    step={1}
                    label="Durée crédit (ans)"
                    suffix={`Remboursement en ${loanYears} ans`}
                  />

                  <div>
                    <label className="block text-xs uppercase mb-3" style={{ color: '#C8A96E', letterSpacing: '1px', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>
                      Montant du crédit (DH)
                    </label>
                    <div className="px-4 py-3 rounded text-sm text-center font-bold" style={{
                      backgroundColor: 'rgba(249, 245, 239, 0.08)',
                      color: '#E2C98A',
                      border: '2px solid #C8A96E50',
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {(loanAmount / 1000000).toFixed(2)}M DH
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stratégie 1: Longue Durée */}
            <div className="rounded-lg p-8" style={{ backgroundColor: '#0D1F3C' + 'cc', border: '1px solid #C8A96E30' }}>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ color: '#C8A96E', fontFamily: "'DM Sans', sans-serif" }}>
                <Home size={28} /> Location Longue Durée
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <NumberInputWithButtons
                  value={longTermRent}
                  onChange={setLongTermRent}
                  step={500}
                  label="Loyer mensuel (DH)"
                />

                <NumberInputWithButtons
                  value={longTermVacancy}
                  onChange={setLongTermVacancy}
                  step={1}
                  label="Taux vacance (%)"
                />

                <NumberInputWithButtons
                  value={longTermMgmt}
                  onChange={setLongTermMgmt}
                  step={1}
                  label="Gestion agence (%)"
                />

                <NumberInputWithButtons
                  value={longTermMaint}
                  onChange={setLongTermMaint}
                  step={1000}
                  label="Maintenance annuelle (DH)"
                />
              </div>
            </div>

            {/* Stratégie 2: Airbnb */}
            <div className="rounded-lg p-8" style={{ backgroundColor: '#0D1F3C' + 'cc', border: '1px solid #C8A96E30' }}>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ color: '#C8A96E', fontFamily: "'DM Sans', sans-serif" }}>
                <Plane size={28} /> Airbnb / Location Meublée
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <NumberInputWithButtons
                  value={airbnbNight}
                  onChange={setAirbnbNight}
                  step={50}
                  label="Tarif/nuit (DH)"
                />

                <NumberInputWithButtons
                  value={airbnbOccupancy}
                  onChange={setAirbnbOccupancy}
                  step={5}
                  label="Taux occupation (%)"
                />

                <NumberInputWithButtons
                  value={airbnbComm}
                  onChange={setAirbnbComm}
                  step={1}
                  label="Commission plateforme (%)"
                />

                <NumberInputWithButtons
                  value={airbnbCleaning}
                  onChange={setAirbnbCleaning}
                  step={500}
                  label="Ménage/mois (DH)"
                />

                <NumberInputWithButtons
                  value={airbnbConcierge}
                  onChange={setAirbnbConcierge}
                  step={500}
                  label="Conciergerie/an (DH)"
                />
              </div>
            </div>

            {/* Stratégie 3: Saisonnier */}
            <div className="rounded-lg p-8" style={{ backgroundColor: '#0D1F3C' + 'cc', border: '1px solid #C8A96E30' }}>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ color: '#C8A96E', fontFamily: "'DM Sans', sans-serif" }}>
                <Waves size={28} /> Location Saisonnière
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <NumberInputWithButtons
                  value={seasonalHighRate}
                  onChange={setSeasonalHighRate}
                  step={50}
                  label="Tarif haute saison (DH/nuit)"
                />

                <NumberInputWithButtons
                  value={seasonalHighNights}
                  onChange={setSeasonalHighNights}
                  step={10}
                  label="Nuits haute saison"
                />

                <NumberInputWithButtons
                  value={seasonalLowRate}
                  onChange={setSeasonalLowRate}
                  step={50}
                  label="Tarif basse saison (DH/nuit)"
                />

                <NumberInputWithButtons
                  value={seasonalLowNights}
                  onChange={setSeasonalLowNights}
                  step={10}
                  label="Nuits basse saison"
                />

                <div className="md:col-span-2">
                  <NumberInputWithButtons
                    value={seasonalCleaning}
                    onChange={setSeasonalCleaning}
                    step={500}
                    label="Ménage/nuit (DH)"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FLUX MENSUELS */}
        {activeTab === 'monthly' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Home, title: 'Longue Durée', result: longTermResult, color: '#4CAF50' },
              { icon: Plane, title: 'Airbnb', result: airbnbResult, color: '#2196F3' },
              { icon: Waves, title: 'Saisonnier', result: seasonalResult, color: '#FF9800' },
            ].map((strategy, idx) => {
              const Icon = strategy.icon;
              return (
                <div key={idx} className="rounded-lg p-8" style={{ backgroundColor: '#0D1F3C' + 'cc', border: '1px solid #C8A96E30' }}>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: strategy.color, fontFamily: "'DM Sans', sans-serif" }}>
                    <Icon size={24} /> {strategy.title}
                  </h3>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between pb-3" style={{ borderBottom: '1px solid #C8A96E20' }}>
                      <span style={{ color: '#E2C98A', fontFamily: "'DM Sans', sans-serif" }}>Revenus bruts/an</span>
                      <span style={{ color: '#F9F5EF', fontWeight: 'bold', fontFamily: "'DM Sans', sans-serif" }}>{(strategy.result.gross / 1000).toFixed(0)}k DH</span>
                    </div>
                    
                    <div className="flex justify-between pb-3" style={{ borderBottom: '1px solid #C8A96E20' }}>
                      <span style={{ color: '#E2C98A', fontFamily: "'DM Sans', sans-serif" }}>Charges/an</span>
                      <span style={{ color: '#B5573A', fontWeight: 'bold', fontFamily: "'DM Sans', sans-serif" }}>{(strategy.result.charges / 1000).toFixed(0)}k DH</span>
                    </div>
                    
                    <div className="flex justify-between pb-3" style={{ borderBottom: '1px solid #C8A96E20' }}>
                      <span style={{ color: '#E2C98A', fontFamily: "'DM Sans', sans-serif" }}>Net/an</span>
                      <span style={{ color: strategy.color, fontWeight: 'bold', fontSize: '16px', fontFamily: "'DM Sans', sans-serif" }}>{(strategy.result.net / 1000).toFixed(0)}k DH</span>
                    </div>
                    
                    <div className="flex justify-between pb-3" style={{ borderBottom: '1px solid #C8A96E20' }}>
                      <span style={{ color: '#E2C98A', fontFamily: "'DM Sans', sans-serif" }}>Impôts/an</span>
                      <span style={{ color: '#E74C3C', fontWeight: 'bold', fontFamily: "'DM Sans', sans-serif" }}>{(strategy.result.taxes / 1000).toFixed(0)}k DH</span>
                    </div>

                    {useLoan && (
                      <div className="flex justify-between pb-3" style={{ borderBottom: '1px solid #C8A96E20' }}>
                        <span style={{ color: '#E2C98A', fontFamily: "'DM Sans', sans-serif" }}>Mensualité crédit</span>
                        <span style={{ color: '#FF6B6B', fontWeight: 'bold', fontFamily: "'DM Sans', sans-serif" }}>{(monthlyPayment).toFixed(0)} DH</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-3 px-4 py-3 rounded" style={{ backgroundColor: strategy.color + '20', borderLeft: `4px solid ${strategy.color}` }}>
                      <span style={{ color: '#E2C98A', fontWeight: 'bold', fontFamily: "'DM Sans', sans-serif" }}>Cash-Flow/mois</span>
                      <span style={{ color: strategy.color, fontWeight: 'bold', fontSize: '18px', fontFamily: "'DM Sans', sans-serif" }}>
                        {(strategy.result.cashFlow / 12).toFixed(0)} DH
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6" style={{ borderTop: '1px solid #C8A96E30' }}>
                    <h4 style={{ color: '#C8A96E', fontSize: '12px', fontWeight: 'bold', marginBottom: '12px', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase' }}>Rendements</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span style={{ color: '#E2C98A', fontFamily: "'DM Sans', sans-serif" }}>Brut</span>
                        <span style={{ color: '#F9F5EF', fontWeight: 'bold', fontFamily: "'DM Sans', sans-serif" }}>{strategy.result.grossYield.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#E2C98A', fontFamily: "'DM Sans', sans-serif" }}>Net</span>
                        <span style={{ color: strategy.color, fontWeight: 'bold', fontFamily: "'DM Sans', sans-serif" }}>{strategy.result.netYield.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#E2C98A', fontFamily: "'DM Sans', sans-serif" }}>Cash-on-Cash</span>
                        <span style={{ color: strategy.color, fontWeight: 'bold', fontFamily: "'DM Sans', sans-serif" }}>{strategy.result.cashOnCash.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: COMPARATIF */}
        {activeTab === 'compare' && (
          <div className="space-y-8">
            <div className="rounded-lg overflow-hidden border" style={{ borderColor: '#C8A96E30' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: '#0D1F3C' + 'dd', borderBottom: '2px solid #C8A96E' }}>
                    <th className="px-6 py-4 text-left" style={{ color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", fontWeight: 'bold' }}>Métrique</th>
                    <th className="px-6 py-4 text-right" style={{ color: '#4CAF50', fontFamily: "'DM Sans', sans-serif", fontWeight: 'bold' }}>Longue Durée</th>
                    <th className="px-6 py-4 text-right" style={{ color: '#2196F3', fontFamily: "'DM Sans', sans-serif", fontWeight: 'bold' }}>Airbnb</th>
                    <th className="px-6 py-4 text-right" style={{ color: '#FF9800', fontFamily: "'DM Sans', sans-serif", fontWeight: 'bold' }}>Saisonnier</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Revenus annuels', key: 'gross' },
                    { label: 'Charges annuelles', key: 'charges' },
                    { label: 'Revenu net/an', key: 'net' },
                    { label: 'Impôts/an', key: 'taxes' },
                    { label: 'Rendement brut', key: 'grossYield', format: (v: number) => `${v.toFixed(2)}%` },
                    { label: 'Rendement net', key: 'netYield', format: (v: number) => `${v.toFixed(2)}%` },
                    { label: 'Cash-Flow annuel', key: 'cashFlow' },
                    { label: 'Cash-Flow mensuel', key: 'cashFlow', format: (v: number) => `${(v/12).toFixed(0)} DH` },
                    { label: 'Cash-on-Cash', key: 'cashOnCash', format: (v: number) => `${v.toFixed(2)}%` },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#0D1F3C50' : 'transparent', borderBottom: '1px solid #C8A96E15' }}>
                      <td className="px-6 py-4" style={{ color: '#E2C98A', fontFamily: "'DM Sans', sans-serif", fontWeight: '500' }}>{row.label}</td>
                      <td className="px-6 py-4 text-right" style={{ color: '#F9F5EF', fontFamily: "'DM Sans', sans-serif", fontWeight: 'bold' }}>
                        {row.format ? row.format(longTermResult[row.key as keyof typeof longTermResult]) : `${(longTermResult[row.key as keyof typeof longTermResult] / 1000).toFixed(0)}k DH`}
                      </td>
                      <td className="px-6 py-4 text-right" style={{ color: '#F9F5EF', fontFamily: "'DM Sans', sans-serif", fontWeight: 'bold' }}>
                        {row.format ? row.format(airbnbResult[row.key as keyof typeof airbnbResult]) : `${(airbnbResult[row.key as keyof typeof airbnbResult] / 1000).toFixed(0)}k DH`}
                      </td>
                      <td className="px-6 py-4 text-right" style={{ color: '#F9F5EF', fontFamily: "'DM Sans', sans-serif", fontWeight: 'bold' }}>
                        {row.format ? row.format(seasonalResult[row.key as keyof typeof seasonalResult]) : `${(seasonalResult[row.key as keyof typeof seasonalResult] / 1000).toFixed(0)}k DH`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PROJECTION 20 ANS */}
        {activeTab === 'projection' && (
          <div className="space-y-8">
            <div className="rounded-lg p-6" style={{ backgroundColor: '#0D1F3C' + 'cc', border: '1px solid #C8A96E30' }}>
              <label className="block text-xs uppercase mb-4" style={{ color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>
                Projection jusqu'à {yearsToProject} ans
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={yearsToProject}
                onChange={(e) => setYearsToProject(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: '#C8A96E' }}
              />
            </div>

            <div className="rounded-lg p-8" style={{ backgroundColor: '#0D1F3C' + 'cc', border: '1px solid #C8A96E30' }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: '#C8A96E', fontFamily: "'DM Sans', sans-serif" }}>Richesse Nette Cumulée</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '2px solid #C8A96E' }}>
                      <th className="px-4 py-3 text-left" style={{ color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", fontWeight: 'bold' }}>Année</th>
                      <th className="px-4 py-3 text-right" style={{ color: '#4CAF50', fontFamily: "'DM Sans', sans-serif", fontWeight: 'bold' }}>Longue Durée</th>
                      <th className="px-4 py-3 text-right" style={{ color: '#2196F3', fontFamily: "'DM Sans', sans-serif", fontWeight: 'bold' }}>Airbnb</th>
                      <th className="px-4 py-3 text-right" style={{ color: '#FF9800', fontFamily: "'DM Sans', sans-serif", fontWeight: 'bold' }}>Saisonnier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectionData.filter((_, i) => i % Math.ceil(projectionData.length / 11) === 0).map((data, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#0D1F3C50' : 'transparent', borderBottom: '1px solid #C8A96E15' }}>
                        <td className="px-4 py-3" style={{ color: '#E2C98A', fontFamily: "'DM Sans', sans-serif" }}>Année {data.year}</td>
                        <td className="px-4 py-3 text-right" style={{ color: '#F9F5EF', fontFamily: "'DM Sans', sans-serif", fontWeight: 'bold' }}>{(data.longTermTotal / 1000000).toFixed(2)}M DH</td>
                        <td className="px-4 py-3 text-right" style={{ color: '#F9F5EF', fontFamily: "'DM Sans', sans-serif", fontWeight: 'bold' }}>{(data.airbnbTotal / 1000000).toFixed(2)}M DH</td>
                        <td className="px-4 py-3 text-right" style={{ color: '#F9F5EF', fontFamily: "'DM Sans', sans-serif", fontWeight: 'bold' }}>{(data.seasonalTotal / 1000000).toFixed(2)}M DH</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: '#0D1F3C' + '99', border: '1px solid #C8A96E30' }}>
                <p style={{ color: '#E2C98A', fontSize: '14px', marginBottom: '12px', fontFamily: "'DM Sans', sans-serif", fontWeight: 'bold' }}>
                  À l'année {yearsToProject}:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Longue Durée', value: projectionData[yearsToProject]?.longTermTotal, color: '#4CAF50' },
                    { label: 'Airbnb', value: projectionData[yearsToProject]?.airbnbTotal, color: '#2196F3' },
                    { label: 'Saisonnier', value: projectionData[yearsToProject]?.seasonalTotal, color: '#FF9800' },
                  ].map((strategy, idx) => (
                    <div key={idx}>
                      <p style={{ color: '#E2C98A', fontSize: '12px', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>{strategy.label}</p>
                      <p style={{ color: strategy.color, fontSize: '28px', fontWeight: 'bold', fontFamily: "'DM Sans', sans-serif" }}>
                        {(strategy.value / 1000000).toFixed(2)}M DH
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="mt-16 px-6 py-12 border-t" style={{ borderColor: '#C8A96E30', backgroundColor: '#0D1F3C' + '50' }}>
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-light mb-4" style={{ color: '#F9F5EF', fontFamily: "'Cormorant Garamond', serif" }}>
            Prêt à <span style={{ color: '#C8A96E' }}>Investir ?</span>
          </h3>
          <p style={{ color: '#E2C98A', fontSize: '14px', marginBottom: '24px', fontFamily: "'DM Sans', sans-serif" }}>
            Discutez de vos résultats avec nos experts et trouvez le bien immobilier idéal.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 rounded-lg text-sm font-bold transition-all"
            style={{
              backgroundColor: '#C8A96E',
              color: '#0D1F3C',
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLAnchorElement;
              target.style.backgroundColor = '#D4B578';
              target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLAnchorElement;
              target.style.backgroundColor = '#C8A96E';
              target.style.transform = 'translateY(0)';
            }}
          >
            Consultation Gratuite →
          </a>
        </div>
      </div>

      {/* Footer Note */}
      <div className="px-6 py-8" style={{ backgroundColor: '#0D1F3C' + '80', borderTop: '1px solid #C8A96E30' }}>
        <div className="max-w-7xl mx-auto">
          <p style={{ color: '#E2C98A', fontSize: '12px', textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>
            💡 Ce calculateur est à titre informatif. Consultez un expert avant de prendre une décision d'investissement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalculateurROI;