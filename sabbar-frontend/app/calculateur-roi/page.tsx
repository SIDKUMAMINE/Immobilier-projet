'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Home, Plane, Waves, Plus, Minus } from 'lucide-react';

const CalculateurROI = () => {
  // État global
  const [purchasePrice, setPurchasePrice] = useState(1200000);
  const [downPayment, setDownPayment] = useState(0);
  const [loanRate, setLoanRate] = useState(0);
  const [loanYears, setLoanYears] = useState(20);
  const [useLoan, setUseLoan] = useState(false);
  
  // Stratégies
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
  const [yearsToProject, setYearsToProject] = useState(20);

  // Calculs
  const loanAmount = useLoan ? (purchasePrice - downPayment) : 0;
  const monthlyRate = loanRate / 100 / 12;
  const numPayments = loanYears * 12;
  const monthlyPayment = loanAmount > 0 && useLoan && loanRate > 0
    ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : 0;

  const calculateStrategy = (annualGross: number, annualCharges: number, taxRate = 10) => {
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

  // Détermine la stratégie active
  const getActiveStrategyData = () => {
    switch(activeStrategy) {
      case 'airbnb':
        return { 
          result: airbnbResult, 
          color: '#6B9EB5', 
          icon: Plane, 
          title: 'Airbnb / Meublée',
          description: 'Rendement meilleur'
        };
      case 'seasonal':
        return { 
          result: seasonalResult, 
          color: '#A89D6B', 
          icon: Waves, 
          title: 'Location Saisonnière',
          description: 'Haut potentiel'
        };
      default:
        return { 
          result: longTermResult, 
          color: '#6BA87A', 
          icon: Home, 
          title: 'Location Longue Durée',
          description: 'Stable & sécurisée'
        };
    }
  };

  const activeData = getActiveStrategyData();
  const ActiveIcon = activeData.icon;

  // Composant pour les inputs
  const NumberInputWithButtons = ({ value, onChange, step, label, suffix = '', min = 0 }) => (
    <div>
      <label className="block text-xs uppercase mb-2" style={{ color: '#C8A96E', letterSpacing: '0.5px', fontFamily: "'DM Sans', sans-serif", fontWeight: '600', fontSize: '10px' }}>
        {label}
      </label>
      <div className="flex gap-1 items-stretch">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="px-2 py-1.5 rounded transition-all flex items-center justify-center"
          style={{ 
            backgroundColor: 'rgba(200, 169, 110, 0.3)', 
            color: '#C8A96E', 
            border: '1px solid #C8A96E50',
            cursor: 'pointer',
            minWidth: '30px',
            fontSize: '12px',
          }}
        >
          <Minus size={12} strokeWidth={3} />
        </button>
        
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(min, Number(e.target.value)))}
          className="flex-1 px-2 py-1.5 rounded text-center text-xs"
          style={{
            backgroundColor: 'rgba(249, 245, 239, 0.08)',
            color: '#E2C98A',
            border: '1px solid #C8A96E50',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            fontWeight: '500',
            outline: 'none',
          }}
        />
        
        <button
          onClick={() => onChange(value + step)}
          className="px-2 py-1.5 rounded transition-all flex items-center justify-center"
          style={{ 
            backgroundColor: 'rgba(200, 169, 110, 0.3)', 
            color: '#C8A96E', 
            border: '1px solid #C8A96E50',
            cursor: 'pointer',
            minWidth: '30px',
            fontSize: '12px',
          }}
        >
          <Plus size={12} strokeWidth={3} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#4A5568' }}>
      {/* Header Compact */}
      <div className="px-4 py-3 border-b" style={{ borderColor: '#C8A96E40', backgroundColor: '#5A6578' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-sm font-bold" style={{ color: '#E2C98A', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px' }}>
            Simulateur ROI Immobilier Locatif
          </h1>
          <p className="text-xs mt-1" style={{ color: '#B5A882', fontFamily: "'DM Sans', sans-serif" }}>
            Comparaison : 3 stratégies • Crédit optionnel • Montants en DH
          </p>
        </div>
      </div>

      {/* SÉLECTEUR DE STRATÉGIES */}
      <div className="px-4 py-4 border-b" style={{ borderColor: '#C8A96E20', backgroundColor: '#4A5568' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-3">
            {/* Stratégie 1: Longue Durée */}
            <button
              onClick={() => setActiveStrategy('longterm')}
              className="p-3 rounded-lg transition-all text-left"
              style={{
                backgroundColor: activeStrategy === 'longterm' ? '#6BA87A40' : 'rgba(107, 168, 122, 0.15)',
                border: activeStrategy === 'longterm' ? '2px solid #6BA87A' : '1px solid #C8A96E40',
                cursor: 'pointer',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Home size={16} style={{ color: '#6BA87A' }} />
                <h3 className="text-xs font-bold" style={{ color: '#6BA87A', fontFamily: "'DM Sans', sans-serif" }}>
                  Longue Durée
                </h3>
              </div>
              <p style={{ color: '#C8A96E', fontSize: '10px', fontFamily: "'DM Sans', sans-serif" }}>
                Stable & sécurisée
              </p>
            </button>

            {/* Stratégie 2: Airbnb */}
            <button
              onClick={() => setActiveStrategy('airbnb')}
              className="p-3 rounded-lg transition-all text-left"
              style={{
                backgroundColor: activeStrategy === 'airbnb' ? '#6B9EB540' : 'rgba(107, 158, 181, 0.15)',
                border: activeStrategy === 'airbnb' ? '2px solid #6B9EB5' : '1px solid #C8A96E40',
                cursor: 'pointer',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Plane size={16} style={{ color: '#6B9EB5' }} />
                <h3 className="text-xs font-bold" style={{ color: '#6B9EB5', fontFamily: "'DM Sans', sans-serif" }}>
                  Airbnb / Meublée
                </h3>
              </div>
              <p style={{ color: '#C8A96E', fontSize: '10px', fontFamily: "'DM Sans', sans-serif" }}>
                Rendement meilleur
              </p>
            </button>

            {/* Stratégie 3: Saisonnier */}
            <button
              onClick={() => setActiveStrategy('seasonal')}
              className="p-3 rounded-lg transition-all text-left"
              style={{
                backgroundColor: activeStrategy === 'seasonal' ? '#A89D6B40' : 'rgba(168, 157, 107, 0.15)',
                border: activeStrategy === 'seasonal' ? '2px solid #A89D6B' : '1px solid #C8A96E40',
                cursor: 'pointer',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Waves size={16} style={{ color: '#A89D6B' }} />
                <h3 className="text-xs font-bold" style={{ color: '#A89D6B', fontFamily: "'DM Sans', sans-serif" }}>
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

      {/* CONTENU PRINCIPAL */}
      <div className="px-4 py-4" style={{ backgroundColor: '#4A5568' }}>
        <div className="max-w-7xl mx-auto space-y-4">
          {/* ACQUISITION */}
          <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(74, 85, 104, 0.8)', border: '1px solid #C8A96E30' }}>
            <h3 className="text-xs font-bold uppercase mb-3" style={{ color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px' }}>
              Acquisition
            </h3>
            
            <div className="grid grid-cols-3 gap-3 mb-3">
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
                label="Apport (%)"
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

            {/* Toggle Financement */}
            <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'rgba(200, 169, 110, 0.08)', border: '1px solid #C8A96E20' }}>
              <span style={{ color: '#E2C98A', fontSize: '11px', fontFamily: "'DM Sans', sans-serif" }}>
                💰 Financement par crédit
              </span>
              <button
                onClick={() => setUseLoan(!useLoan)}
                className="relative w-10 h-6 rounded-full transition-all"
                style={{
                  backgroundColor: useLoan ? '#6BA87A' : '#666',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <div
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all"
                  style={{
                    transform: useLoan ? 'translateX(20px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>

            {/* Détails crédit si activé */}
            {useLoan && loanRate > 0 && (
              <div className="mt-3 p-2 rounded" style={{ backgroundColor: 'rgba(107, 168, 122, 0.1)', border: '1px solid #6BA87A30' }}>
                <div className="grid grid-cols-3 gap-3">
                  <NumberInputWithButtons
                    value={loanYears}
                    onChange={setLoanYears}
                    step={1}
                    label="Durée (ans)"
                    min={1}
                  />
                  <div>
                    <label className="block text-xs uppercase mb-2" style={{ color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: '600' }}>
                      Mensualité
                    </label>
                    <div className="px-2 py-1.5 rounded text-center text-xs" style={{
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
                    <label className="block text-xs uppercase mb-2" style={{ color: '#C8A96E', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: '600' }}>
                      Crédit
                    </label>
                    <div className="px-2 py-1.5 rounded text-center text-xs" style={{
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

          {/* PARAMÈTRES DE LA STRATÉGIE SÉLECTIONNÉE */}
          <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(74, 85, 104, 0.8)', border: `1px solid ${activeData.color}30` }}>
            <h3 className="text-xs font-bold uppercase mb-3 flex items-center gap-2" style={{ color: activeData.color, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px' }}>
              <ActiveIcon size={14} /> {activeData.title}
            </h3>

            {activeStrategy === 'longterm' && (
              <div className="grid grid-cols-2 gap-3">
                <NumberInputWithButtons
                  value={longTermRent}
                  onChange={setLongTermRent}
                  step={500}
                  label="Loyer/mois"
                  min={500}
                />
                <NumberInputWithButtons
                  value={longTermVacancy}
                  onChange={setLongTermVacancy}
                  step={1}
                  label="Vacance (%)"
                  min={0}
                />
                <NumberInputWithButtons
                  value={longTermMgmt}
                  onChange={setLongTermMgmt}
                  step={1}
                  label="Gestion (%)"
                  min={0}
                />
                <NumberInputWithButtons
                  value={longTermMaint}
                  onChange={setLongTermMaint}
                  step={1000}
                  label="Maintenance/an"
                  min={0}
                />
              </div>
            )}

            {activeStrategy === 'airbnb' && (
              <div className="grid grid-cols-2 gap-3">
                <NumberInputWithButtons
                  value={airbnbNight}
                  onChange={setAirbnbNight}
                  step={50}
                  label="Tarif/nuit"
                  min={50}
                />
                <NumberInputWithButtons
                  value={airbnbOccupancy}
                  onChange={setAirbnbOccupancy}
                  step={5}
                  label="Occupation (%)"
                  min={0}
                />
                <NumberInputWithButtons
                  value={airbnbComm}
                  onChange={setAirbnbComm}
                  step={1}
                  label="Commission (%)"
                  min={0}
                />
                <NumberInputWithButtons
                  value={airbnbCleaning}
                  onChange={setAirbnbCleaning}
                  step={500}
                  label="Ménage/mois"
                  min={0}
                />
                <NumberInputWithButtons
                  value={airbnbConcierge}
                  onChange={setAirbnbConcierge}
                  step={500}
                  label="Conciergerie/an"
                  min={0}
                />
              </div>
            )}

            {activeStrategy === 'seasonal' && (
              <div className="grid grid-cols-2 gap-3">
                <NumberInputWithButtons
                  value={seasonalHighRate}
                  onChange={setSeasonalHighRate}
                  step={50}
                  label="Tarif haute/nuit"
                  min={50}
                />
                <NumberInputWithButtons
                  value={seasonalHighNights}
                  onChange={setSeasonalHighNights}
                  step={10}
                  label="Nuits haute"
                  min={0}
                />
                <NumberInputWithButtons
                  value={seasonalLowRate}
                  onChange={setSeasonalLowRate}
                  step={50}
                  label="Tarif basse/nuit"
                  min={50}
                />
                <NumberInputWithButtons
                  value={seasonalLowNights}
                  onChange={setSeasonalLowNights}
                  step={10}
                  label="Nuits basse"
                  min={0}
                />
                <div className="col-span-2">
                  <NumberInputWithButtons
                    value={seasonalCleaning}
                    onChange={setSeasonalCleaning}
                    step={500}
                    label="Ménage/nuit"
                    min={0}
                  />
                </div>
              </div>
            )}
          </div>

          {/* RÉSULTATS - CHARGES DÉTAILLÉES + ROI */}
          <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(74, 85, 104, 0.8)', border: `2px solid ${activeData.color}40` }}>
            <h3 className="text-xs font-bold uppercase mb-3" style={{ color: activeData.color, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px' }}>
              📊 Résultats & ROI Annuel
            </h3>

            {/* Ligne 1: Revenus et Charges */}
            <div className="grid grid-cols-3 gap-3 mb-3">
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

            {/* Ligne 2: Cash-flow et ROI */}
            <div className="grid grid-cols-3 gap-3">
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
                <p style={{ color: '#C8A96E', fontSize: '10px', marginBottom: '4px', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>ROI/an (après crédit)</p>
                <p style={{ color: activeData.color, fontWeight: 'bold', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}>
                  {activeData.result.cashOnCash.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Résumé investissement */}
            <div className="mt-3 p-2 rounded" style={{ backgroundColor: `${activeData.color}15`, border: `1px solid ${activeData.color}30` }}>
              <div className="flex justify-between items-center text-xs">
                <span style={{ color: '#E2C98A', fontFamily: "'DM Sans', sans-serif" }}>💰 Investissement total:</span>
                <span style={{ color: activeData.color, fontWeight: 'bold', fontFamily: "'DM Sans', sans-serif" }}>
                  {(useLoan && downPayment > 0 ? downPayment : purchasePrice) / 1000000).toFixed(2)}M DH
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 text-center" style={{ backgroundColor: '#3A4A5A', borderTop: '1px solid #C8A96E20' }}>
        <p style={{ color: '#B5A882', fontSize: '10px', fontFamily: "'DM Sans', sans-serif" }}>
          💡 Ce calculateur est à titre informatif. Consultez un expert avant d'investir.
        </p>
      </div>
    </div>
  );
};

export default CalculateurROI;