'use client';

import React, { useState } from 'react';
import { Home, Plane, Waves, Plus, Minus } from 'lucide-react';

const CalculateurROI = () => {
  const [purchasePrice, setPurchasePrice] = useState(1200000);
  const [downPayment, setDownPayment] = useState(0);
  const [loanRate, setLoanRate] = useState(0);
  const [loanYears, setLoanYears] = useState(20);
  const [useLoan, setUseLoan] = useState(false);
  
  const [longTermRent, setLongTermRent] = useState(7000);
  const [longTermVacancy, setLongTermVacancy] = useState(6);
  const [longTermMgmt, setLongTermMgmt] = useState(2);
  const [longTermMaint, setLongTermMaint] = useState(10000);
  
  const [airbnbNight, setAirbnbNight] = useState(600);
  const [airbnbOccupancy, setAirbnbOccupancy] = useState(65);
  const [airbnbComm, setAirbnbComm] = useState(15);
  const [airbnbCleaning, setAirbnbCleaning] = useState(1800);
  const [airbnbConcierge, setAirbnbConcierge] = useState(800);
  
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
  const longTermCharges = (annualRentCollected * longTermMgmt / 100) + longTermMaint + 2000;
  const longTermResult = calculateStrategy(annualRentCollected, longTermCharges, 10);

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

  const NumberInputWithButtons = ({ value, onChange, step, label, min = 0 }: any) => (
    <div>
      <label style={{ color: '#C8A96E', letterSpacing: '0.8px', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', fontSize: '11px', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'stretch' }}>
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          style={{ 
            backgroundColor: '#C8A96E20', 
            color: '#C8A96E', 
            border: '1px solid #C8A96E40',
            cursor: 'pointer',
            minWidth: '32px',
            fontSize: '12px',
            borderRadius: '6px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#C8A96E30';
            e.currentTarget.style.borderColor = '#C8A96E60';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#C8A96E20';
            e.currentTarget.style.borderColor = '#C8A96E40';
          }}
        >
          <Minus size={12} strokeWidth={3} />
        </button>
        
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(min, Number(e.target.value)))}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '6px',
            textAlign: 'center',
            fontSize: '13px',
            backgroundColor: '#0D1F3C30',
            color: '#F9F5EF',
            border: '1px solid #C8A96E40',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: '500',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#C8A96E';
            e.currentTarget.style.backgroundColor = '#0D1F3C50';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#C8A96E40';
            e.currentTarget.style.backgroundColor = '#0D1F3C30';
          }}
        />
        
        <button
          onClick={() => onChange(value + step)}
          style={{ 
            backgroundColor: '#C8A96E20', 
            color: '#C8A96E', 
            border: '1px solid #C8A96E40',
            cursor: 'pointer',
            minWidth: '32px',
            fontSize: '12px',
            borderRadius: '6px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#C8A96E30';
            e.currentTarget.style.borderColor = '#C8A96E60';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#C8A96E20';
            e.currentTarget.style.borderColor = '#C8A96E40';
          }}
        >
          <Plus size={12} strokeWidth={3} />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D1F3C' }}>
      {/* Header */}
      <div style={{ padding: '24px 32px', borderBottom: '1px solid #C8A96E30', background: 'linear-gradient(to bottom, #0D1F3C, #0D1F3C)' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#F9F5EF', fontFamily: "'Cormorant Garamond', serif", letterSpacing: '1px', margin: '0 0 8px 0' }}>
            Simulateur ROI <span style={{ color: '#C8A96E' }}>Immobilier Locatif</span>
          </h1>
          <p style={{ fontSize: '13px', marginTop: '8px', color: '#E2C98A', fontFamily: "'DM Sans', sans-serif", fontWeight: '400', margin: '0' }}>
            Comparaison : 3 stratégies • Crédit optionnel • Montants en DH
          </p>
        </div>
      </div>

      {/* Stratégies Selector */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid #C8A96E20', backgroundColor: '#0D1F3C' }}>
        <div style={{ maxWidth: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { key: 'longterm', title: 'Longue Durée', desc: 'Stable & sécurisée', color: '#C8A96E', icon: Home },
              { key: 'airbnb', title: 'Airbnb / Meublée', desc: 'Rendement meilleur', color: '#C8A96E', icon: Plane },
              { key: 'seasonal', title: 'Saisonnier', desc: 'Haut potentiel', color: '#B5573A', icon: Waves }
            ].map((strategy: any) => {
              const Icon = strategy.icon;
              return (
                <button
                  key={strategy.key}
                  onClick={() => setActiveStrategy(strategy.key)}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    backgroundColor: activeStrategy === strategy.key ? 'rgba(200, 169, 110, 0.15)' : 'rgba(200, 169, 110, 0.05)',
                    border: activeStrategy === strategy.key ? `2px solid ${strategy.color}` : '1px solid #C8A96E30',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(200, 169, 110, 0.12)';
                    e.currentTarget.style.borderColor = '#C8A96E50';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = activeStrategy === strategy.key ? 'rgba(200, 169, 110, 0.15)' : 'rgba(200, 169, 110, 0.05)';
                    e.currentTarget.style.borderColor = activeStrategy === strategy.key ? `${strategy.color}` : '#C8A96E30';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Icon size={18} style={{ color: strategy.color }} />
                    <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#F9F5EF', fontFamily: "'DM Sans', sans-serif", margin: '0' }}>
                      {strategy.title}
                    </h3>
                  </div>
                  <p style={{ color: '#E2C98A', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", margin: '0', fontWeight: '400' }}>
                    {strategy.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 32px', backgroundColor: '#0D1F3C' }}>
        <div style={{ maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Acquisition Section */}
          <div style={{ borderRadius: '10px', padding: '24px', backgroundColor: '#0D1F3C50', border: '1px solid #C8A96E25' }}>
            <h3 style={{ fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', marginBottom: '16px', color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px', margin: '0 0 16px 0' }}>
              💰 Acquisition
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <NumberInputWithButtons
                value={purchasePrice}
                onChange={setPurchasePrice}
                step={100000}
                label="Prix d'achat"
                min={100000}
              />
              <NumberInputWithButtons
                value={downPayment}
                onChange={setDownPayment}
                step={50000}
                label="Apport (DH)"
                min={0}
              />
              <NumberInputWithButtons
                value={loanRate}
                onChange={setLoanRate}
                step={0.1}
                label="Taux crédit (%)"
                min={0}
              />
            </div>

            {/* Loan Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(200, 169, 110, 0.08)', border: '1px solid #C8A96E20' }}>
              <span style={{ color: '#E2C98A', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", fontWeight: '500' }}>
                💳 Financement par crédit
              </span>
              <button
                onClick={() => setUseLoan(!useLoan)}
                style={{
                  position: 'relative',
                  width: '44px',
                  height: '26px',
                  borderRadius: '13px',
                  backgroundColor: useLoan ? '#C8A96E' : '#666',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '3px',
                    left: '3px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    transition: 'all 0.3s',
                    transform: useLoan ? 'translateX(18px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>

            {/* Loan Details */}
            {useLoan && loanRate > 0 && (
              <div style={{ marginTop: '16px', padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(200, 169, 110, 0.06)', border: '1px solid #C8A96E25' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <NumberInputWithButtons
                    value={loanYears}
                    onChange={setLoanYears}
                    step={1}
                    label="Durée (ans)"
                    min={1}
                  />
                  <div>
                    <label style={{ color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      Mensualité
                    </label>
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontSize: '13px',
                      backgroundColor: '#0D1F3C30',
                      color: '#F9F5EF',
                      border: '1px solid #C8A96E40',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: '500',
                    }}>
                      {monthlyPayment.toFixed(0)} DH
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '500', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      Montant Crédit
                    </label>
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontSize: '13px',
                      backgroundColor: '#0D1F3C30',
                      color: '#F9F5EF',
                      border: '1px solid #C8A96E40',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: '500',
                    }}>
                      {(loanAmount / 1000000).toFixed(2)}M DH
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Strategy Parameters */}
          <div style={{ borderRadius: '10px', padding: '24px', backgroundColor: '#0D1F3C50', border: `1px solid ${activeData.color}30` }}>
            <h3 style={{ fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', marginBottom: '16px', color: activeData.color, fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 16px 0' }}>
              <ActiveIcon size={16} /> {activeData.title}
            </h3>

            {activeStrategy === 'longterm' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <NumberInputWithButtons value={longTermRent} onChange={setLongTermRent} step={500} label="Loyer/mois" min={500} />
                <NumberInputWithButtons value={longTermVacancy} onChange={setLongTermVacancy} step={1} label="Vacance (%)" min={0} />
                <NumberInputWithButtons value={longTermMgmt} onChange={setLongTermMgmt} step={1} label="Gestion (%)" min={0} />
                <NumberInputWithButtons value={longTermMaint} onChange={setLongTermMaint} step={1000} label="Maintenance/an" min={0} />
              </div>
            )}

            {activeStrategy === 'airbnb' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <NumberInputWithButtons value={airbnbNight} onChange={setAirbnbNight} step={50} label="Tarif/nuit" min={50} />
                <NumberInputWithButtons value={airbnbOccupancy} onChange={setAirbnbOccupancy} step={5} label="Occupation (%)" min={0} />
                <NumberInputWithButtons value={airbnbComm} onChange={setAirbnbComm} step={1} label="Commission (%)" min={0} />
                <NumberInputWithButtons value={airbnbCleaning} onChange={setAirbnbCleaning} step={500} label="Ménage/mois" min={0} />
                <NumberInputWithButtons value={airbnbConcierge} onChange={setAirbnbConcierge} step={500} label="Conciergerie/an" min={0} />
              </div>
            )}

            {activeStrategy === 'seasonal' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <NumberInputWithButtons value={seasonalHighRate} onChange={setSeasonalHighRate} step={50} label="Tarif haute/nuit" min={50} />
                <NumberInputWithButtons value={seasonalHighNights} onChange={setSeasonalHighNights} step={10} label="Nuits haute" min={0} />
                <NumberInputWithButtons value={seasonalLowRate} onChange={setSeasonalLowRate} step={50} label="Tarif basse/nuit" min={50} />
                <NumberInputWithButtons value={seasonalLowNights} onChange={setSeasonalLowNights} step={10} label="Nuits basse" min={0} />
                <div style={{ gridColumn: 'span 2' }}>
                  <NumberInputWithButtons value={seasonalCleaning} onChange={setSeasonalCleaning} step={500} label="Ménage/nuit" min={0} />
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div style={{ borderRadius: '10px', padding: '24px', backgroundColor: '#0D1F3C50', border: `2px solid ${activeData.color}35` }}>
            <h3 style={{ fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', marginBottom: '16px', color: activeData.color, fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px', margin: '0 0 16px 0' }}>
              📊 Résultats & ROI Annuel
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', backgroundColor: '#0D1F3C50', borderRadius: '8px', border: '1px solid #C8A96E25' }}>
                <p style={{ color: '#C8A96E', fontSize: '11px', marginBottom: '8px', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px 0' }}>Revenu Brut</p>
                <p style={{ color: '#F9F5EF', fontWeight: 'bold', fontSize: '16px', fontFamily: "'DM Sans', sans-serif", margin: '0' }}>
                  {(activeData.result.gross / 1000).toFixed(0)}k DH
                </p>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#0D1F3C50', borderRadius: '8px', border: '1px solid #C8A96E25' }}>
                <p style={{ color: '#C8A96E', fontSize: '11px', marginBottom: '8px', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px 0' }}>Charges</p>
                <p style={{ color: '#B5573A', fontWeight: 'bold', fontSize: '16px', fontFamily: "'DM Sans', sans-serif", margin: '0' }}>
                  {(activeData.result.charges / 1000).toFixed(0)}k DH
                </p>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#0D1F3C50', borderRadius: '8px', border: '1px solid #C8A96E25' }}>
                <p style={{ color: '#C8A96E', fontSize: '11px', marginBottom: '8px', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px 0' }}>Net/an</p>
                <p style={{ color: '#F9F5EF', fontWeight: 'bold', fontSize: '16px', fontFamily: "'DM Sans', sans-serif", margin: '0' }}>
                  {(activeData.result.net / 1000).toFixed(0)}k DH
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', backgroundColor: '#0D1F3C50', borderRadius: '8px', border: '1px solid #C8A96E25' }}>
                <p style={{ color: '#C8A96E', fontSize: '11px', marginBottom: '8px', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px 0' }}>Cash-Flow/Mois</p>
                <p style={{ color: activeData.color, fontWeight: 'bold', fontSize: '18px', fontFamily: "'DM Sans', sans-serif", margin: '0' }}>
                  {(activeData.result.cashFlow / 12).toFixed(0)} DH
                </p>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#0D1F3C50', borderRadius: '8px', border: '1px solid #C8A96E25' }}>
                <p style={{ color: '#C8A96E', fontSize: '11px', marginBottom: '8px', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px 0' }}>Taux Annuel (%)</p>
                <p style={{ color: activeData.color, fontWeight: 'bold', fontSize: '18px', fontFamily: "'DM Sans', sans-serif", margin: '0' }}>
                  {activeData.result.netYield.toFixed(2)}%
                </p>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#0D1F3C50', borderRadius: '8px', border: '1px solid #C8A96E25' }}>
                <p style={{ color: '#C8A96E', fontSize: '11px', marginBottom: '8px', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px 0' }}>ROI/an</p>
                <p style={{ color: activeData.color, fontWeight: 'bold', fontSize: '18px', fontFamily: "'DM Sans', sans-serif", margin: '0' }}>
                  {activeData.result.cashOnCash.toFixed(2)}%
                </p>
              </div>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(200, 169, 110, 0.08)', border: `1px solid ${activeData.color}30` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <span style={{ color: '#E2C98A', fontFamily: "'DM Sans', sans-serif", fontWeight: '500' }}>💰 Investissement total:</span>
                <span style={{ color: activeData.color, fontWeight: 'bold', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>
                  {((useLoan && downPayment > 0 ? downPayment : purchasePrice) / 1000000).toFixed(2)}M DH
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '20px 32px', textAlign: 'center', backgroundColor: '#0D1F3C', borderTop: '1px solid #C8A96E20' }}>
        <p style={{ color: '#E2C98A', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", margin: '0', fontWeight: '400' }}>
          💡 Ce calculateur est à titre informatif. Consultez un expert avant d'investir.
        </p>
      </div>
    </div>
  );
};

export default CalculateurROI;