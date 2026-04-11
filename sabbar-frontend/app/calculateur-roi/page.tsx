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
          color: '#6B9EB5', 
          icon: Plane, 
          title: 'Airbnb / Meublée',
        };
      case 'seasonal':
        return { 
          result: seasonalResult, 
          color: '#A89D6B', 
          icon: Waves, 
          title: 'Location Saisonnière',
        };
      default:
        return { 
          result: longTermResult, 
          color: '#6BA87A', 
          icon: Home, 
          title: 'Location Longue Durée',
        };
    }
  };

  const activeData = getActiveStrategyData();
  const ActiveIcon = activeData.icon;

  const NumberInputWithButtons = ({ value, onChange, step, label, min = 0 }: any) => (
    <div>
      <label style={{ color: '#C8A96E', letterSpacing: '0.5px', fontFamily: "'DM Sans', sans-serif", fontWeight: '600', fontSize: '10px', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'stretch' }}>
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          style={{ 
            backgroundColor: 'rgba(200, 169, 110, 0.3)', 
            color: '#C8A96E', 
            border: '1px solid #C8A96E50',
            cursor: 'pointer',
            minWidth: '30px',
            fontSize: '12px',
            borderRadius: '4px',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
            padding: '6px 8px',
            borderRadius: '4px',
            textAlign: 'center',
            fontSize: '12px',
            backgroundColor: 'rgba(249, 245, 239, 0.08)',
            color: '#E2C98A',
            border: '1px solid #C8A96E50',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: '500',
            outline: 'none',
          }}
        />
        
        <button
          onClick={() => onChange(value + step)}
          style={{ 
            backgroundColor: 'rgba(200, 169, 110, 0.3)', 
            color: '#C8A96E', 
            border: '1px solid #C8A96E50',
            cursor: 'pointer',
            minWidth: '30px',
            fontSize: '12px',
            borderRadius: '4px',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={12} strokeWidth={3} />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#4A5568' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #C8A96E40', backgroundColor: '#5A6578' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '14px', fontWeight: 'bold', color: '#E2C98A', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px' }}>
            Simulateur ROI Immobilier Locatif
          </h1>
          <p style={{ fontSize: '12px', marginTop: '4px', color: '#B5A882', fontFamily: "'DM Sans', sans-serif" }}>
            Comparaison : 3 stratégies • Crédit optionnel • Montants en DH
          </p>
        </div>
      </div>

      <div style={{ padding: '16px', borderBottom: '1px solid #C8A96E20', backgroundColor: '#4A5568' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <button
              onClick={() => setActiveStrategy('longterm')}
              style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: activeStrategy === 'longterm' ? '#6BA87A40' : 'rgba(107, 168, 122, 0.15)',
                border: activeStrategy === 'longterm' ? '2px solid #6BA87A' : '1px solid #C8A96E40',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Home size={16} style={{ color: '#6BA87A' }} />
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#6BA87A', fontFamily: "'DM Sans', sans-serif" }}>
                  Longue Durée
                </h3>
              </div>
              <p style={{ color: '#C8A96E', fontSize: '10px', fontFamily: "'DM Sans', sans-serif" }}>
                Stable & sécurisée
              </p>
            </button>

            <button
              onClick={() => setActiveStrategy('airbnb')}
              style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: activeStrategy === 'airbnb' ? '#6B9EB540' : 'rgba(107, 158, 181, 0.15)',
                border: activeStrategy === 'airbnb' ? '2px solid #6B9EB5' : '1px solid #C8A96E40',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Plane size={16} style={{ color: '#6B9EB5' }} />
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#6B9EB5', fontFamily: "'DM Sans', sans-serif" }}>
                  Airbnb / Meublée
                </h3>
              </div>
              <p style={{ color: '#C8A96E', fontSize: '10px', fontFamily: "'DM Sans', sans-serif" }}>
                Rendement meilleur
              </p>
            </button>

            <button
              onClick={() => setActiveStrategy('seasonal')}
              style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: activeStrategy === 'seasonal' ? '#A89D6B40' : 'rgba(168, 157, 107, 0.15)',
                border: activeStrategy === 'seasonal' ? '2px solid #A89D6B' : '1px solid #C8A96E40',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Waves size={16} style={{ color: '#A89D6B' }} />
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#A89D6B', fontFamily: "'DM Sans', sans-serif" }}>
                  Saisonnier
                </h3>
              </div>
              <p style={{ color: '#C8A96E', fontSize: '10px', fontFamily: "'DM Sans', sans-serif" }}>
                Haut potentiel
              </p>
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', backgroundColor: '#4A5568' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ borderRadius: '8px', padding: '16px', backgroundColor: 'rgba(74, 85, 104, 0.8)', border: '1px solid #C8A96E30' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px', color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px' }}>
              Acquisition
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', borderRadius: '4px', backgroundColor: 'rgba(200, 169, 110, 0.08)', border: '1px solid #C8A96E20' }}>
              <span style={{ color: '#E2C98A', fontSize: '11px', fontFamily: "'DM Sans', sans-serif" }}>
                💰 Financement par crédit
              </span>
              <button
                onClick={() => setUseLoan(!useLoan)}
                style={{
                  position: 'relative',
                  width: '40px',
                  height: '24px',
                  borderRadius: '12px',
                  backgroundColor: useLoan ? '#6BA87A' : '#666',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '2px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    transform: useLoan ? 'translateX(16px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>

            {useLoan && loanRate > 0 && (
              <div style={{ marginTop: '12px', padding: '8px', borderRadius: '4px', backgroundColor: 'rgba(107, 168, 122, 0.1)', border: '1px solid #6BA87A30' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <NumberInputWithButtons
                    value={loanYears}
                    onChange={setLoanYears}
                    step={1}
                    label="Durée (ans)"
                    min={1}
                  />
                  <div>
                    <label style={{ color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Mensualité
                    </label>
                    <div style={{
                      padding: '6px 8px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontSize: '12px',
                      backgroundColor: 'rgba(249, 245, 239, 0.08)',
                      color: '#E2C98A',
                      border: '1px solid #C8A96E50',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: '500',
                    }}>
                      {monthlyPayment.toFixed(0)} DH
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Crédit
                    </label>
                    <div style={{
                      padding: '6px 8px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontSize: '12px',
                      backgroundColor: 'rgba(249, 245, 239, 0.08)',
                      color: '#E2C98A',
                      border: '1px solid #C8A96E50',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: '500',
                    }}>
                      {(loanAmount / 1000000).toFixed(2)}M
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ borderRadius: '8px', padding: '16px', backgroundColor: 'rgba(74, 85, 104, 0.8)', border: `1px solid ${activeData.color}30` }}>
            <h3 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px', color: activeData.color, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ActiveIcon size={14} /> {activeData.title}
            </h3>

            {activeStrategy === 'longterm' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <NumberInputWithButtons value={longTermRent} onChange={setLongTermRent} step={500} label="Loyer/mois" min={500} />
                <NumberInputWithButtons value={longTermVacancy} onChange={setLongTermVacancy} step={1} label="Vacance (%)" min={0} />
                <NumberInputWithButtons value={longTermMgmt} onChange={setLongTermMgmt} step={1} label="Gestion (%)" min={0} />
                <NumberInputWithButtons value={longTermMaint} onChange={setLongTermMaint} step={1000} label="Maintenance/an" min={0} />
              </div>
            )}

            {activeStrategy === 'airbnb' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <NumberInputWithButtons value={airbnbNight} onChange={setAirbnbNight} step={50} label="Tarif/nuit" min={50} />
                <NumberInputWithButtons value={airbnbOccupancy} onChange={setAirbnbOccupancy} step={5} label="Occupation (%)" min={0} />
                <NumberInputWithButtons value={airbnbComm} onChange={setAirbnbComm} step={1} label="Commission (%)" min={0} />
                <NumberInputWithButtons value={airbnbCleaning} onChange={setAirbnbCleaning} step={500} label="Ménage/mois" min={0} />
                <NumberInputWithButtons value={airbnbConcierge} onChange={setAirbnbConcierge} step={500} label="Conciergerie/an" min={0} />
              </div>
            )}

            {activeStrategy === 'seasonal' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
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

          <div style={{ borderRadius: '8px', padding: '16px', backgroundColor: 'rgba(74, 85, 104, 0.8)', border: `2px solid ${activeData.color}40` }}>
            <h3 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px', color: activeData.color, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px' }}>
              📊 Résultats & ROI Annuel
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
              <div>
                <p style={{ color: '#C8A96E', fontSize: '10px', marginBottom: '4px', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>Revenu Brut</p>
                <p style={{ color: activeData.color, fontWeight: 'bold', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>
                  {(activeData.result.gross / 1000).toFixed(0)}k DH
                </p>
              </div>
              <div>
                <p style={{ color: '#C8A96E', fontSize: '10px', marginBottom: '4px', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>Charges</p>
                <p style={{ color: '#B5573A', fontWeight: 'bold', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>
                  {(activeData.result.charges / 1000).toFixed(0)}k DH
                </p>
              </div>
              <div>
                <p style={{ color: '#C8A96E', fontSize: '10px', marginBottom: '4px', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>Net/an</p>
                <p style={{ color: activeData.color, fontWeight: 'bold', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>
                  {(activeData.result.net / 1000).toFixed(0)}k DH
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <p style={{ color: '#C8A96E', fontSize: '10px', marginBottom: '4px', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>Cash-Flow/Mois</p>
                <p style={{ color: activeData.color, fontWeight: 'bold', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}>
                  {(activeData.result.cashFlow / 12).toFixed(0)} DH
                </p>
              </div>
              <div>
                <p style={{ color: '#C8A96E', fontSize: '10px', marginBottom: '4px', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>Taux Annuel (%)</p>
                <p style={{ color: activeData.color, fontWeight: 'bold', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}>
                  {activeData.result.netYield.toFixed(2)}%
                </p>
              </div>
              <div>
                <p style={{ color: '#C8A96E', fontSize: '10px', marginBottom: '4px', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>ROI/an</p>
                <p style={{ color: activeData.color, fontWeight: 'bold', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}>
                  {activeData.result.cashOnCash.toFixed(2)}%
                </p>
              </div>
            </div>

            <div style={{ marginTop: '12px', padding: '8px', borderRadius: '4px', backgroundColor: `${activeData.color}15`, border: `1px solid ${activeData.color}30` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: '#E2C98A', fontFamily: "'DM Sans', sans-serif" }}>💰 Investissement total:</span>
                <span style={{ color: activeData.color, fontWeight: 'bold', fontFamily: "'DM Sans', sans-serif" }}>
                  {((useLoan && downPayment > 0 ? downPayment : purchasePrice) / 1000000).toFixed(2)}M DH
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px', textAlign: 'center', backgroundColor: '#3A4A5A', borderTop: '1px solid #C8A96E20' }}>
        <p style={{ color: '#B5A882', fontSize: '10px', fontFamily: "'DM Sans', sans-serif" }}>
          💡 Ce calculateur est à titre informatif. Consultez un expert avant d'investir.
        </p>
      </div>
    </div>
  );
};

export default CalculateurROI;