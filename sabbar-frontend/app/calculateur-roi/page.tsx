'use client';

import React, { useState, useRef } from 'react';
import { Home, Plane, Waves, Plus, Minus } from 'lucide-react';

const CalculateurROI = () => {
  const [purchasePrice, setPurchasePrice] = useState(700000);
  const [acquisitionFees, setAcquisitionFees] = useState(6);
  const [renovationCosts, setRenovationCosts] = useState(50000);
  const [downPayment, setDownPayment] = useState(0);
  const [loanRate, setLoanRate] = useState(0);
  const [loanYears, setLoanYears] = useState(20);
  const [useLoan, setUseLoan] = useState(false);

  const [longTermRent, setLongTermRent] = useState(6000);
  const [longTermVacancy, setLongTermVacancy] = useState(2);
  const [longTermRentIncrease, setLongTermRentIncrease] = useState(2);
  const [longTermCharges, setLongTermCharges] = useState(10000);
  const [longTermMgmt, setLongTermMgmt] = useState(0);
  const [longTermTaxes, setLongTermTaxes] = useState(0);

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

  const [activeStrategy, setActiveStrategy] = useState('longterm');

  const loanAmount = useLoan ? (purchasePrice - downPayment) : 0;
  const monthlyRate = loanRate / 100 / 12;
  const numPayments = loanYears * 12;
  const monthlyPayment = loanAmount > 0 && useLoan && loanRate > 0
    ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : 0;

  const calculateStrategy = (annualGross: number, annualCharges: number, taxRate: number = 10) => {
    const gross = annualGross;
    const charges = annualCharges;
    const beforeTax = gross - charges;
    const taxes = Math.max(0, beforeTax * (taxRate / 100));
    const net = beforeTax - taxes;
    const annualMortgage = useLoan && loanRate > 0 ? monthlyPayment * 12 : 0;
    const cashFlow = net - annualMortgage;
    const investmentBase = useLoan && downPayment > 0 ? downPayment : purchasePrice;
    return {
      gross, charges, beforeTax, taxes, net, annualMortgage, cashFlow,
      grossYield: (gross / purchasePrice) * 100,
      netYield: (net / purchasePrice) * 100,
      cashOnCash: investmentBase > 0 ? (cashFlow / investmentBase) * 100 : 0,
    };
  };

  const annualRentCollected = longTermRent * 12 * (100 - longTermVacancy) / 100;
  const longTermTotalCharges = longTermCharges + (annualRentCollected * longTermMgmt / 100);
  const longTermResult = calculateStrategy(annualRentCollected, longTermTotalCharges, 10);

  const airbnbNightsPerYear = 365 * (airbnbOccupancy / 100);
  const airbnbAnnualGross = airbnbNight * airbnbNightsPerYear;
  const airbnbCharges = (airbnbAnnualGross * airbnbComm / 100) + (airbnbCleaning * (airbnbNightsPerYear / 10)) + airbnbConcierge + 3000;
  const airbnbResult = calculateStrategy(airbnbAnnualGross, airbnbCharges, 20);

  const seasonalGross = (seasonalHighRate * seasonalHighNights) + (seasonalLowRate * seasonalLowNights);
  const seasonalCharges = (seasonalCleaning * ((seasonalHighNights + seasonalLowNights) / 10)) + 4000 + 5000;
  const seasonalResult = calculateStrategy(seasonalGross, seasonalCharges, 15);

  const getActiveStrategyData = () => {
    switch (activeStrategy) {
      case 'airbnb': return { result: airbnbResult, color: '#C8A96E', icon: Plane, title: 'Airbnb / Meublée' };
      case 'seasonal': return { result: seasonalResult, color: '#B5573A', icon: Waves, title: 'Location Saisonnière' };
      default: return { result: longTermResult, color: '#C8A96E', icon: Home, title: 'Location Longue Durée' };
    }
  };

  const activeData = getActiveStrategyData();
  const ActiveIcon = activeData.icon;

  // Input avec boutons +/- — compatible mobile
  const NumberInputWithButtons = ({ value, onChange, step, label, min = 0 }: any) => {
    const [localValue, setLocalValue] = useState<string>(String(value));
    const [isFocused, setIsFocused] = useState(false);
    const prevValue = useRef(value);

    if (!isFocused && prevValue.current !== value) {
      prevValue.current = value;
      setLocalValue(String(value));
    }

    const handleFocus = () => { setIsFocused(true); setLocalValue(String(value)); };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setLocalValue(e.target.value);
    const handleBlur = () => {
      setIsFocused(false);
      const parsed = parseFloat(localValue);
      if (!isNaN(parsed) && parsed >= min) { onChange(parsed); setLocalValue(String(parsed)); prevValue.current = parsed; }
      else { setLocalValue(String(value)); }
    };
    const handleMinus = () => { const n = Math.max(min, value - step); onChange(n); if (!isFocused) { setLocalValue(String(n)); prevValue.current = n; } };
    const handlePlus  = () => { const n = value + step; onChange(n); if (!isFocused) { setLocalValue(String(n)); prevValue.current = n; } };

    return (
      <div style={{ marginBottom: '4px' }}>
        <label style={{ color: '#C8A96E', letterSpacing: '0.8px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '11px', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
          {label}
        </label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={handleMinus} style={{ backgroundColor: '#C8A96E15', color: '#C8A96E', border: '1px solid #C8A96E35', cursor: 'pointer', width: '44px', height: '44px', fontSize: '18px', borderRadius: '8px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Minus size={16} strokeWidth={3} />
          </button>
          <input
            type="text" inputMode="numeric"
            value={localValue}
            onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}
            style={{ flex: 1, padding: '10px 8px', borderRadius: '8px', textAlign: 'center', fontSize: '14px', backgroundColor: isFocused ? '#0D1F3C80' : '#0D1F3C40', color: '#F9F5EF', border: `1px solid ${isFocused ? '#C8A96E60' : '#C8A96E35'}`, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, outline: 'none', minWidth: 0 }}
          />
          <button onClick={handlePlus} style={{ backgroundColor: '#C8A96E15', color: '#C8A96E', border: '1px solid #C8A96E35', cursor: 'pointer', width: '44px', height: '44px', fontSize: '18px', borderRadius: '8px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Plus size={16} strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  };

  const sectionTitle = (icon: string, label: string, color = '#C8A96E') => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
      <span style={{ fontSize: '16px' }}>{icon}</span>
      <span style={{ color, fontSize: '11px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
    </div>
  );

  const divider = <div style={{ height: '1px', background: '#C8A96E20', margin: '28px 0' }} />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Grilles responsives ── */
        .roi-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .roi-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .roi-strategies { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }

        @media (max-width: 900px) {
          .roi-grid-3 { grid-template-columns: repeat(2, 1fr); }
          .roi-grid-4 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .roi-grid-3 { grid-template-columns: 1fr; gap: 16px; }
          .roi-grid-4 { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .roi-strategies { grid-template-columns: 1fr; gap: 8px; }
          .roi-strategy-btn { display: flex !important; flex-direction: row !important; align-items: center !important; gap: 12px !important; padding: 14px 16px !important; }
          .roi-strategy-desc { margin: 0 !important; }
          .roi-header-title { font-size: 26px !important; }
          .roi-header-sub { font-size: 12px !important; }
          .roi-result-value { font-size: 16px !important; }
          .roi-content { padding: 20px 16px !important; }
          .roi-header { padding: 20px 16px !important; }
          .roi-strategies-wrap { padding: 16px !important; }
          .roi-footer { padding: 16px !important; }
          .roi-loan-toggle { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', backgroundColor: '#0D1F3C', color: '#F9F5EF' }}>

        {/* ── Header ── */}
        <div className="roi-header" style={{ padding: '28px 32px', borderBottom: '1px solid #C8A96E25' }}>
          <h1 className="roi-header-title" style={{ fontSize: '34px', fontWeight: 300, color: '#F9F5EF', fontFamily: "'Cormorant Garamond', serif", letterSpacing: '1.5px', marginBottom: '6px' }}>
            Simulateur ROI <span style={{ color: '#C8A96E' }}>Immobilier</span>
          </h1>
          <p className="roi-header-sub" style={{ fontSize: '13px', color: '#E2C98A', fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>
            3 stratégies · Crédit optionnel · Montants en DH
          </p>
        </div>

        {/* ── Sélecteur de stratégie ── */}
        <div className="roi-strategies-wrap" style={{ padding: '20px 32px', borderBottom: '1px solid #C8A96E20' }}>
          <div className="roi-strategies">
            {[
              { key: 'longterm', title: 'Longue durée', desc: 'Stable & sécurisée', color: '#C8A96E', icon: Home },
              { key: 'airbnb',   title: 'Airbnb / meublé', desc: 'Rendement élevé', color: '#C8A96E', icon: Plane },
              { key: 'seasonal', title: 'Saisonnier', desc: 'Été & fêtes', color: '#B5573A', icon: Waves },
            ].map((s: any) => {
              const Icon = s.icon;
              const isActive = activeStrategy === s.key;
              return (
                <button key={s.key} onClick={() => setActiveStrategy(s.key)} className="roi-strategy-btn"
                  style={{ padding: '14px', borderRadius: '10px', display: 'flex', flexDirection: 'column', backgroundColor: isActive ? 'rgba(200,169,110,0.12)' : 'rgba(200,169,110,0.05)', border: isActive ? `2px solid ${s.color}` : '1px solid #C8A96E25', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Icon size={16} style={{ color: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#F9F5EF', fontFamily: "'DM Sans', sans-serif" }}>{s.title}</span>
                  </div>
                  <p className="roi-strategy-desc" style={{ color: '#E2C98A', fontSize: '11px', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>{s.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Contenu principal ── */}
        <div className="roi-content" style={{ padding: '28px 32px' }}>

          {/* Acquisition */}
          {sectionTitle('💰', 'Acquisition')}
          <div className="roi-grid-3">
            <NumberInputWithButtons value={purchasePrice} onChange={setPurchasePrice} step={50000} label="Prix d'achat (DH)" min={50000} />
            <NumberInputWithButtons value={acquisitionFees} onChange={setAcquisitionFees} step={0.5} label="Frais acquisition (%)" min={0} />
            <NumberInputWithButtons value={renovationCosts} onChange={setRenovationCosts} step={10000} label="Travaux & ameublement" min={0} />
          </div>

          {divider}

          {/* Toggle crédit */}
          <div className="roi-loan-toggle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '10px', backgroundColor: 'rgba(13,31,60,0.5)', border: '1px solid #C8A96E25', marginBottom: '24px' }}>
            <div>
              <p style={{ color: '#F9F5EF', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginBottom: '3px' }}>🏦 Financement par crédit</p>
              <p style={{ color: '#C8A96E80', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>Désactivez si vous achetez comptant</p>
            </div>
            <button onClick={() => setUseLoan(!useLoan)}
              style={{ position: 'relative', width: '50px', height: '28px', borderRadius: '14px', backgroundColor: useLoan ? '#C8A96E' : '#C8A96E40', border: 'none', cursor: 'pointer', transition: 'all 0.3s', flexShrink: 0 }}
            >
              <div style={{ position: 'absolute', top: '3px', left: useLoan ? '24px' : '3px', width: '22px', height: '22px', backgroundColor: '#0D1F3C', borderRadius: '11px', transition: 'all 0.3s' }} />
            </button>
          </div>

          {useLoan && (
            <>
              {sectionTitle('🏦', 'Crédit immobilier')}
              <div className="roi-grid-3" style={{ marginBottom: '0' }}>
                <NumberInputWithButtons value={downPayment} onChange={setDownPayment} step={50000} label="Apport (DH)" min={0} />
                <NumberInputWithButtons value={loanRate} onChange={setLoanRate} step={0.1} label="Taux d'intérêt (%)" min={0} />
                <NumberInputWithButtons value={loanYears} onChange={setLoanYears} step={1} label="Durée (ans)" min={1} />
              </div>
              {divider}
            </>
          )}

          {/* Paramètres stratégie active */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <ActiveIcon size={16} style={{ color: activeData.color }} />
            <span style={{ color: activeData.color, fontSize: '11px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>{activeData.title}</span>
          </div>

          {activeStrategy === 'longterm' && (
            <div className="roi-grid-3">
              <NumberInputWithButtons value={longTermRent} onChange={setLongTermRent} step={500} label="Loyer mensuel (DH)" min={500} />
              <NumberInputWithButtons value={longTermVacancy} onChange={setLongTermVacancy} step={0.5} label="Vacance locative (%)" min={0} />
              <NumberInputWithButtons value={longTermRentIncrease} onChange={setLongTermRentIncrease} step={0.5} label="Revalorisation (%/an)" min={0} />
              <NumberInputWithButtons value={longTermCharges} onChange={setLongTermCharges} step={1000} label="Charges fixes/an" min={0} />
              <NumberInputWithButtons value={longTermMgmt} onChange={setLongTermMgmt} step={1} label="Gestion agence (%)" min={0} />
              <NumberInputWithButtons value={longTermTaxes} onChange={setLongTermTaxes} step={1} label="IR / fiscalité (%)" min={0} />
            </div>
          )}
          {activeStrategy === 'airbnb' && (
            <div className="roi-grid-3">
              <NumberInputWithButtons value={airbnbNight} onChange={setAirbnbNight} step={50} label="Tarif/nuit (DH)" min={50} />
              <NumberInputWithButtons value={airbnbOccupancy} onChange={setAirbnbOccupancy} step={5} label="Taux occupation (%)" min={0} />
              <NumberInputWithButtons value={airbnbComm} onChange={setAirbnbComm} step={1} label="Commission plateforme (%)" min={0} />
              <NumberInputWithButtons value={airbnbCleaning} onChange={setAirbnbCleaning} step={500} label="Ménage/mois (DH)" min={0} />
              <NumberInputWithButtons value={airbnbConcierge} onChange={setAirbnbConcierge} step={500} label="Conciergerie/an (DH)" min={0} />
            </div>
          )}
          {activeStrategy === 'seasonal' && (
            <div className="roi-grid-3">
              <NumberInputWithButtons value={seasonalHighRate} onChange={setSeasonalHighRate} step={50} label="Tarif haute saison/nuit" min={50} />
              <NumberInputWithButtons value={seasonalHighNights} onChange={setSeasonalHighNights} step={10} label="Nuits haute saison" min={0} />
              <NumberInputWithButtons value={seasonalLowRate} onChange={setSeasonalLowRate} step={50} label="Tarif basse saison/nuit" min={50} />
              <NumberInputWithButtons value={seasonalLowNights} onChange={setSeasonalLowNights} step={10} label="Nuits basse saison" min={0} />
              <NumberInputWithButtons value={seasonalCleaning} onChange={setSeasonalCleaning} step={500} label="Ménage/nuit (DH)" min={0} />
            </div>
          )}

          {/* ── Résultats ── */}
          <div style={{ marginTop: '32px', borderTop: '1px solid #C8A96E25', paddingTop: '28px' }}>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ color: '#C8A96E', fontSize: '11px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>📊 Résultats</span>
            </div>
            <div className="roi-grid-4">
              {[
                {
                  label: 'Investissement total',
                  value: `${((purchasePrice + (purchasePrice * acquisitionFees / 100) + renovationCosts) / 1000000).toFixed(2)}M DH`,
                  sub: 'achat comptant',
                },
                {
                  label: 'Rendement brut',
                  value: `${activeData.result.grossYield.toFixed(1)} %`,
                  sub: 'loyer / prix achat',
                  highlight: true,
                },
                {
                  label: 'Cash-flow net',
                  value: `${Math.round(activeData.result.cashFlow / 12).toLocaleString('fr-FR')} DH/mois`,
                  sub: 'après charges & crédit',
                  highlight: true,
                },
                {
                  label: 'ROI net / an',
                  value: `${activeData.result.cashOnCash.toFixed(1)} %`,
                  sub: 'sur capital investi',
                  highlight: true,
                },
              ].map(({ label, value, sub, highlight }) => (
                <div key={label} style={{ background: 'rgba(200,169,110,0.06)', border: '1px solid #C8A96E20', borderRadius: '12px', padding: '16px' }}>
                  <p style={{ color: '#C8A96E', fontSize: '10px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{label}</p>
                  <p className="roi-result-value" style={{ color: highlight ? activeData.color : '#F9F5EF', fontWeight: 700, fontSize: '18px', fontFamily: "'DM Sans', sans-serif", marginBottom: '4px' }}>{value}</p>
                  <p style={{ color: '#C8A96E60', fontSize: '10px', fontFamily: "'DM Sans', sans-serif" }}>{sub}</p>
                </div>
              ))}
            </div>

            {/* Détail mensuel crédit */}
            {useLoan && loanRate > 0 && (
              <div style={{ marginTop: '16px', padding: '14px 18px', borderRadius: '10px', background: 'rgba(181,87,58,0.07)', border: '1px solid rgba(181,87,58,0.2)', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: 'rgba(181,87,58,0.8)', fontSize: '10px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>Mensualité crédit</p>
                  <p style={{ color: '#F9F5EF', fontSize: '16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>{Math.round(monthlyPayment).toLocaleString('fr-FR')} DH/mois</p>
                </div>
                <div>
                  <p style={{ color: 'rgba(181,87,58,0.8)', fontSize: '10px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>Montant emprunté</p>
                  <p style={{ color: '#F9F5EF', fontSize: '16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>{loanAmount.toLocaleString('fr-FR')} DH</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="roi-footer" style={{ padding: '20px 32px', textAlign: 'center', borderTop: '1px solid #C8A96E20' }}>
          <p style={{ color: '#C8A96E60', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>
            💡 Ce simulateur est à titre informatif. Consultez un expert avant d'investir.
          </p>
        </div>
      </div>
    </>
  );
};

export default CalculateurROI;