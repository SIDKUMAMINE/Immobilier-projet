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

  // Refs pour garder le focus
  const inputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});

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
      gross,
      charges,
      beforeTax,
      taxes,
      net,
      annualMortgage,
      cashFlow,
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
    switch(activeStrategy) {
      case 'airbnb':
        return { 
          result: airbnbResult, 
          color: '#C8A96E', 
          icon: Plane, 
          title: 'Airbnb / Meublée',
        };
      case 'seasonal':
        return { 
          result: seasonalResult, 
          color: '#B5573A', 
          icon: Waves, 
          title: 'Location Saisonnière',
        };
      default:
        return { 
          result: longTermResult, 
          color: '#C8A96E', 
          icon: Home, 
          title: 'Location Longue Durée',
        };
    }
  };

  const activeData = getActiveStrategyData();
  const ActiveIcon = activeData.icon;

  const NumberInputWithButtons = ({ value, onChange, step, label, min = 0, id }: any) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value) || min);
    };

    return (
      <div style={{ marginBottom: '16px' }}>
        <label style={{ color: '#C8A96E', letterSpacing: '0.8px', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', fontSize: '11px', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
          {label}
        </label>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => onChange(Math.max(min, value - step))}
            style={{ 
              backgroundColor: '#C8A96E15', 
              color: '#C8A96E', 
              border: '1px solid #C8A96E35',
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              fontSize: '18px',
              borderRadius: '6px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C8A96E25';
              e.currentTarget.style.borderColor = '#C8A96E50';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C8A96E15';
              e.currentTarget.style.borderColor = '#C8A96E35';
            }}
          >
            <Minus size={16} strokeWidth={3} />
          </button>
          
          <input
            ref={(el) => {
              if (el) inputRefs.current[id] = el;
            }}
            type="number"
            value={value}
            onChange={handleChange}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '6px',
              textAlign: 'center',
              fontSize: '14px',
              backgroundColor: '#0D1F3C30',
              color: '#F9F5EF',
              border: '1px solid #C8A96E35',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: '400',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#C8A96E60';
              e.currentTarget.style.backgroundColor = '#0D1F3C50';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#C8A96E35';
              e.currentTarget.style.backgroundColor = '#0D1F3C30';
            }}
          />
          
          <button
            onClick={() => onChange(value + step)}
            style={{ 
              backgroundColor: '#C8A96E15', 
              color: '#C8A96E', 
              border: '1px solid #C8A96E35',
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              fontSize: '18px',
              borderRadius: '6px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C8A96E25';
              e.currentTarget.style.borderColor = '#C8A96E50';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C8A96E15';
              e.currentTarget.style.borderColor = '#C8A96E35';
            }}
          >
            <Plus size={16} strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D1F3C', color: '#F9F5EF' }}>
      {/* Header */}
      <div style={{ padding: '32px', borderBottom: '1px solid #C8A96E25', backgroundColor: '#0D1F3C' }}>
        <h1 style={{ fontSize: '38px', fontWeight: '300', color: '#F9F5EF', fontFamily: "'Cormorant Garamond', serif", letterSpacing: '2px', margin: '0 0 8px 0' }}>
          Simulateur ROI <span style={{ color: '#C8A96E' }}>Immobilier Locatif</span>
        </h1>
        <p style={{ fontSize: '13px', marginTop: '8px', color: '#E2C98A', fontFamily: "'DM Sans', sans-serif", fontWeight: '400', margin: '0' }}>
          Comparaison : 3 stratégies • Crédit optionnel • Montants en DH
        </p>
      </div>

      {/* Stratégies Selector */}
      <div style={{ padding: '24px 32px', borderBottom: '1px solid #C8A96E20', backgroundColor: '#0D1F3C' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { key: 'longterm', title: 'Longue durée', desc: 'Stable & sécurisée', color: '#C8A96E', icon: Home },
            { key: 'airbnb', title: 'Airbnb / meublé', desc: 'Rendement élevé', color: '#C8A96E', icon: Plane },
            { key: 'seasonal', title: 'Saisonnier', desc: 'Été & fêtes', color: '#B5573A', icon: Waves }
          ].map((strategy: any) => {
            const Icon = strategy.icon;
            return (
              <button
                key={strategy.key}
                onClick={() => setActiveStrategy(strategy.key)}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  backgroundColor: activeStrategy === strategy.key ? 'rgba(200, 169, 110, 0.12)' : 'rgba(200, 169, 110, 0.05)',
                  border: activeStrategy === strategy.key ? `2px solid ${strategy.color}` : '1px solid #C8A96E25',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  if (activeStrategy !== strategy.key) {
                    e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.08)';
                    e.currentTarget.style.borderColor = '#C8A96E40';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeStrategy !== strategy.key) {
                    e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.05)';
                    e.currentTarget.style.borderColor = '#C8A96E25';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Icon size={18} style={{ color: strategy.color }} />
                  <h3 style={{ fontSize: '13px', fontWeight: '500', color: '#F9F5EF', fontFamily: "'DM Sans', sans-serif", margin: '0', textTransform: 'capitalize' }}>
                    {strategy.title}
                  </h3>
                </div>
                <p style={{ color: '#E2C98A', fontSize: '11px', fontFamily: "'DM Sans', sans-serif", margin: '0', fontWeight: '400' }}>
                  {strategy.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px', backgroundColor: '#0D1F3C' }}>
        <div style={{ maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Acquisition Section */}
          <div>
            <h3 style={{ fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', marginBottom: '20px', color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px', margin: '0 0 20px 0' }}>
              💰 Acquisition
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginBottom: '32px' }}>
              <NumberInputWithButtons
                id="purchasePrice"
                value={purchasePrice}
                onChange={setPurchasePrice}
                step={50000}
                label="Pnx d'achat"
                min={50000}
              />
              <NumberInputWithButtons
                id="acquisitionFees"
                value={acquisitionFees}
                onChange={setAcquisitionFees}
                step={0.5}
                label="Frais acquisition (%)"
                min={0}
              />
              <NumberInputWithButtons
                id="renovationCosts"
                value={renovationCosts}
                onChange={setRenovationCosts}
                step={10000}
                label="Travaux & ameublement"
                min={0}
              />
            </div>

            {/* Loan Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '8px', backgroundColor: '#0D1F3C50', border: '1px solid #C8A96E25', marginBottom: '32px' }}>
              <div>
                <span style={{ color: '#F9F5EF', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", fontWeight: '500' }}>
                  🏦 Financement par crédit
                </span>
                <p style={{ color: '#C8A96E80', fontSize: '11px', fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0 0' }}>
                  Désactivez si vous achetez comptant
                </p>
              </div>
              <button
                onClick={() => setUseLoan(!useLoan)}
                style={{
                  position: 'relative',
                  width: '50px',
                  height: '28px',
                  borderRadius: '14px',
                  backgroundColor: useLoan ? '#C8A96E' : '#C8A96E40',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '3px',
                    left: useLoan ? '24px' : '3px',
                    width: '22px',
                    height: '22px',
                    backgroundColor: '#0D1F3C',
                    borderRadius: '11px',
                    transition: 'all 0.3s',
                  }}
                />
              </button>
            </div>

            {/* Loan Details */}
            {useLoan && (
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', marginBottom: '20px', color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px', margin: '0 0 20px 0' }}>
                  Crédit immobilier
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                  <NumberInputWithButtons
                    id="downPayment"
                    value={downPayment}
                    onChange={setDownPayment}
                    step={50000}
                    label="Apport personnel (%)"
                    min={0}
                  />
                  <NumberInputWithButtons
                    id="loanRate"
                    value={loanRate}
                    onChange={setLoanRate}
                    step={0.1}
                    label="Taux d'intérêt (%)"
                    min={0}
                  />
                  <NumberInputWithButtons
                    id="loanYears"
                    value={loanYears}
                    onChange={setLoanYears}
                    step={1}
                    label="Durée (ans)"
                    min={1}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Strategy Parameters */}
          <div>
            <h3 style={{ fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', marginBottom: '20px', color: activeData.color, fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 20px 0' }}>
              <ActiveIcon size={16} style={{ color: activeData.color }} /> {activeData.title}
            </h3>

            {activeStrategy === 'longterm' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                <NumberInputWithButtons id="longTermRent" value={longTermRent} onChange={setLongTermRent} step={500} label="Loyer mensuel brut" min={500} />
                <NumberInputWithButtons id="longTermVacancy" value={longTermVacancy} onChange={setLongTermVacancy} step={0.5} label="Vacance locative (%)" min={0} />
                <NumberInputWithButtons id="longTermRentIncrease" value={longTermRentIncrease} onChange={setLongTermRentIncrease} step={0.5} label="Revalorisation loyer (%/an)" min={0} />
                <NumberInputWithButtons id="longTermCharges" value={longTermCharges} onChange={setLongTermCharges} step={1000} label="Charges fixes annuelles" min={0} />
                <NumberInputWithButtons id="longTermMgmt" value={longTermMgmt} onChange={setLongTermMgmt} step={1} label="Gestion agence (%)" min={0} />
                <NumberInputWithButtons id="longTermTaxes" value={longTermTaxes} onChange={setLongTermTaxes} step={1} label="IR / fiscalité (%)" min={0} />
              </div>
            )}

            {activeStrategy === 'airbnb' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                <NumberInputWithButtons id="airbnbNight" value={airbnbNight} onChange={setAirbnbNight} step={50} label="Tarif/nuit" min={50} />
                <NumberInputWithButtons id="airbnbOccupancy" value={airbnbOccupancy} onChange={setAirbnbOccupancy} step={5} label="Taux occupation (%)" min={0} />
                <NumberInputWithButtons id="airbnbComm" value={airbnbComm} onChange={setAirbnbComm} step={1} label="Commission plateforme (%)" min={0} />
                <NumberInputWithButtons id="airbnbCleaning" value={airbnbCleaning} onChange={setAirbnbCleaning} step={500} label="Ménage/mois (DH)" min={0} />
                <NumberInputWithButtons id="airbnbConcierge" value={airbnbConcierge} onChange={setAirbnbConcierge} step={500} label="Conciergerie/an (DH)" min={0} />
              </div>
            )}

            {activeStrategy === 'seasonal' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                <NumberInputWithButtons id="seasonalHighRate" value={seasonalHighRate} onChange={setSeasonalHighRate} step={50} label="Tarif haute/nuit" min={50} />
                <NumberInputWithButtons id="seasonalHighNights" value={seasonalHighNights} onChange={setSeasonalHighNights} step={10} label="Nuits haute saison" min={0} />
                <NumberInputWithButtons id="seasonalLowRate" value={seasonalLowRate} onChange={setSeasonalLowRate} step={50} label="Tarif basse/nuit" min={50} />
                <NumberInputWithButtons id="seasonalLowNights" value={seasonalLowNights} onChange={setSeasonalLowNights} step={10} label="Nuits basse saison" min={0} />
                <NumberInputWithButtons id="seasonalCleaning" value={seasonalCleaning} onChange={setSeasonalCleaning} step={500} label="Ménage/nuit (DH)" min={0} />
              </div>
            )}
          </div>

          {/* Results Section */}
          <div style={{ borderTop: '1px solid #C8A96E25', paddingTop: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
              <div>
                <p style={{ color: '#C8A96E', fontSize: '10px', marginBottom: '8px', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 8px 0' }}>Investissement total</p>
                <p style={{ color: '#F9F5EF', fontWeight: 'bold', fontSize: '18px', fontFamily: "'DM Sans', sans-serif", margin: '0' }}>
                  {((purchasePrice + (purchasePrice * acquisitionFees / 100) + renovationCosts) / 1000000).toFixed(2)}M DH
                </p>
                <p style={{ color: '#C8A96E80', fontSize: '10px', fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0 0' }}>achat comptant</p>
              </div>
              <div>
                <p style={{ color: '#C8A96E', fontSize: '10px', marginBottom: '8px', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 8px 0' }}>Rendement brut</p>
                <p style={{ color: activeData.color, fontWeight: 'bold', fontSize: '18px', fontFamily: "'DM Sans', sans-serif", margin: '0' }}>
                  {activeData.result.grossYield.toFixed(1)} %
                </p>
                <p style={{ color: '#C8A96E80', fontSize: '10px', fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0 0' }}>loyer / prix d'achat</p>
              </div>
              <div>
                <p style={{ color: '#C8A96E', fontSize: '10px', marginBottom: '8px', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 8px 0' }}>Cash-flow net</p>
                <p style={{ color: activeData.color, fontWeight: 'bold', fontSize: '18px', fontFamily: "'DM Sans', sans-serif", margin: '0' }}>
                  {(activeData.result.cashFlow / 12).toFixed(0)} DH/mois
                </p>
                <p style={{ color: '#C8A96E80', fontSize: '10px', fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0 0' }}>après crédit & charges</p>
              </div>
              <div>
                <p style={{ color: '#C8A96E', fontSize: '10px', marginBottom: '8px', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 8px 0' }}>ROI net / an</p>
                <p style={{ color: activeData.color, fontWeight: 'bold', fontSize: '18px', fontFamily: "'DM Sans', sans-serif", margin: '0' }}>
                  {activeData.result.cashOnCash.toFixed(1)} %
                </p>
                <p style={{ color: '#C8A96E80', fontSize: '10px', fontFamily: "'DM Sans', sans-serif", margin: '4px 0 0 0' }}>sur capital investi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '24px 32px', textAlign: 'center', backgroundColor: '#0D1F3C', borderTop: '1px solid #C8A96E20' }}>
        <p style={{ color: '#C8A96E80', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", margin: '0', fontWeight: '400' }}>
          💡 Ce calculateur est à titre informatif. Consultez un expert avant d'investir.
        </p>
      </div>
    </div>
  );
};

export default CalculateurROI;