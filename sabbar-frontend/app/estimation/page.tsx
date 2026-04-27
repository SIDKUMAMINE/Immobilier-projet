'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

// ─── Data ────────────────────────────────────────────────────────────────────

const PRIX: Record<string, Record<string, { min: number; max: number }>> = {
  casablanca: {
    'Anfa': { min: 18000, max: 28000 }, 'Maarif': { min: 14000, max: 20000 },
    'Gauthier': { min: 15000, max: 22000 }, 'Ain Diab': { min: 20000, max: 35000 },
    'Bourgogne': { min: 13000, max: 19000 }, 'Sidi Maarouf': { min: 10000, max: 15000 },
    'Bouskoura': { min: 8000, max: 13000 }, 'Hay Hassani': { min: 8000, max: 12000 },
    'Californie': { min: 16000, max: 24000 }, 'Val Fleuri': { min: 12000, max: 17000 },
    'Oulfa': { min: 7000, max: 11000 }, 'Bernoussi': { min: 7000, max: 10000 },
    'Ain Sbaa': { min: 7000, max: 11000 }, 'Hay Mohammadi': { min: 6000, max: 9000 },
    'Sidi Bernoussi': { min: 6500, max: 10000 }, 'Sbata': { min: 7000, max: 10500 },
    'Derb Sultan': { min: 7500, max: 11000 }, 'Ben Msik': { min: 6500, max: 9500 },
    'Salmia': { min: 7000, max: 10000 }, 'Roches Noires': { min: 8000, max: 12000 },
    'Polo': { min: 11000, max: 16000 }, 'Racine': { min: 15000, max: 22000 },
    'CIL': { min: 9000, max: 14000 }, 'Beauséjour': { min: 13000, max: 19000 },
    'Oasis': { min: 12000, max: 18000 }, 'Quartier des Hopitaux': { min: 11000, max: 16000 },
    'Hay Nour': { min: 6500, max: 10000 }, 'Lissasfa': { min: 8000, max: 12000 },
    'Attacharouk': { min: 7000, max: 10500 }, 'Lahraouiyine': { min: 5500, max: 9000 },
    'Dar Bouazza': { min: 9000, max: 14000 }, 'Mediouna': { min: 5000, max: 8000 },
    'Nassim': { min: 10000, max: 15000 }, 'Les Princesses': { min: 11000, max: 16000 },
    'Hay Oulfa': { min: 7000, max: 11000 }, 'Ain Chock': { min: 8000, max: 12000 },
    'Belvedere': { min: 10000, max: 15000 }, 'Palmier': { min: 12000, max: 18000 },
    'Ghandi': { min: 9000, max: 13000 }, 'Maarif Extension': { min: 12000, max: 18000 },
    'Hay Ennakhil': { min: 7500, max: 11000 }, 'Sidi Belyout': { min: 8000, max: 13000 },
    'Habous': { min: 9000, max: 14000 }, 'Triangle d Or': { min: 14000, max: 21000 },
    'Quartier Riviera': { min: 13000, max: 19000 }, 'Ain Sebaa': { min: 7000, max: 11000 },
    'Zenata': { min: 6000, max: 9500 }, 'Medina': { min: 8000, max: 13000 },
  },
  rabat: {
    'Agdal': { min: 14000, max: 22000 }, 'Hassan': { min: 12000, max: 18000 },
    'Souissi': { min: 16000, max: 25000 }, 'Les Orangers': { min: 11000, max: 16000 },
    'Hay Riad': { min: 13000, max: 19000 }, 'Youssoufia': { min: 8000, max: 12000 },
    'Akkari': { min: 7000, max: 11000 }, 'Hay Nahda': { min: 8000, max: 12000 },
    'Ocean': { min: 10000, max: 15000 }, 'Diour Jamaa': { min: 9000, max: 14000 },
    'Aviation': { min: 9000, max: 13000 }, 'Madinat Al Irfane': { min: 11000, max: 16000 },
    'Takaddoum': { min: 7500, max: 11000 }, 'Hay Salam': { min: 7000, max: 11000 },
    'Temara': { min: 7000, max: 11000 }, 'Sale': { min: 6000, max: 10000 },
    'Hay Karima': { min: 6500, max: 9500 }, 'Hay Inara': { min: 7000, max: 11000 },
    'Medina Rabat': { min: 9000, max: 15000 }, 'Ryad': { min: 13000, max: 19000 },
    'Hay Fadila': { min: 7000, max: 10500 }, 'Quartier des Ministeres': { min: 12000, max: 18000 },
  },
  marrakech: {
    'Gueliz': { min: 13000, max: 20000 }, 'Hivernage': { min: 16000, max: 25000 },
    'Palmeraie': { min: 18000, max: 35000 }, 'Mellah': { min: 9000, max: 15000 },
    'Agdal Marrakech': { min: 11000, max: 17000 }, 'Targa': { min: 8000, max: 13000 },
    'Medina Marrakech': { min: 10000, max: 18000 }, 'Sidi Ghanem': { min: 9000, max: 14000 },
    'Semlalia': { min: 10000, max: 16000 }, 'Massira': { min: 7000, max: 11000 },
    'Mhamid': { min: 6500, max: 10000 }, 'Amelkis': { min: 12000, max: 20000 },
    'Route de Fes': { min: 8000, max: 13000 }, 'Douar Laarab': { min: 5000, max: 8000 },
    'Hay Hassani Marrakech': { min: 7000, max: 11000 }, 'Bab Doukkala': { min: 9000, max: 14000 },
    'M Hamid': { min: 6500, max: 10000 }, 'Sidi Youssef Ben Ali': { min: 6000, max: 9500 },
    'Route de Casablanca': { min: 8000, max: 13000 }, 'Nouvelle Ville': { min: 9000, max: 14000 },
  },
  tanger: {
    'Malabata': { min: 12000, max: 20000 }, 'Marchane': { min: 10000, max: 16000 },
    'Iberia': { min: 11000, max: 17000 }, 'Val Fleuri Tanger': { min: 9000, max: 14000 },
    'Boukhalef': { min: 7000, max: 11000 }, 'Moghogha': { min: 6000, max: 10000 },
    'Medina Tanger': { min: 8000, max: 14000 }, 'California Tanger': { min: 10000, max: 16000 },
    'Mesnana': { min: 7000, max: 11000 }, 'Charf': { min: 8000, max: 13000 },
    'Beni Makada': { min: 6000, max: 9500 }, 'Tanja Balia': { min: 5500, max: 9000 },
    'Cap Spartel': { min: 12000, max: 20000 }, 'Gzenaya': { min: 6500, max: 10000 },
    'Souani': { min: 7000, max: 11000 }, 'Dradeb': { min: 6000, max: 9500 },
    'Branes': { min: 7000, max: 11000 }, 'Hay Al Amal': { min: 6000, max: 9000 },
    'Quartier Administratif': { min: 9000, max: 14000 }, 'Achakar': { min: 10000, max: 16000 },
  },
  agadir: {
    'Founty': { min: 12000, max: 18000 }, 'Hay Mohammadi Agadir': { min: 7000, max: 11000 },
    'Talborjt': { min: 8000, max: 13000 }, 'Cite Suisse': { min: 11000, max: 16000 },
    'Anza': { min: 6000, max: 10000 }, 'Hay Dakhla': { min: 6500, max: 10000 },
    'Tilila': { min: 7000, max: 11000 }, 'Bensergao': { min: 8000, max: 13000 },
    'Tikiouine': { min: 6000, max: 9500 }, 'Hay Massira': { min: 7000, max: 11000 },
    'Agadir Marina': { min: 13000, max: 20000 }, 'Quartier Industriel': { min: 5000, max: 8000 },
    'Hay Al Matar': { min: 6500, max: 10000 }, 'Cite Al Wahda': { min: 7000, max: 11000 },
  },
  fes: {
    'Saiss': { min: 8000, max: 14000 }, 'Route d Imouzzer': { min: 10000, max: 16000 },
    'Montfleuri': { min: 9000, max: 14000 }, 'Atlas': { min: 7000, max: 12000 },
    'Les Merinides': { min: 8000, max: 13000 }, 'Narjiss': { min: 8000, max: 13000 },
    'Andalous': { min: 7000, max: 11000 }, 'Agdal Fes': { min: 9000, max: 14000 },
    'Medina Fes': { min: 6000, max: 10000 }, 'Aouinet Hajjaj': { min: 6500, max: 10000 },
    'Ville Nouvelle Fes': { min: 8000, max: 13000 }, 'Zouagha': { min: 7000, max: 11000 },
    'Hay Amal Fes': { min: 6500, max: 10000 }, 'Ain Chkef': { min: 7000, max: 11000 },
    'Bensouda': { min: 6000, max: 9500 },
  },
  meknes: {
    'Hamria': { min: 7000, max: 12000 }, 'Nouvelle Ville Meknes': { min: 8000, max: 13000 },
    'Medina Meknes': { min: 5500, max: 9000 }, 'Hay Salam Meknes': { min: 6000, max: 9500 },
    'Marjane': { min: 7500, max: 12000 }, 'Bassatine': { min: 6500, max: 10000 },
    'Zitoune': { min: 6000, max: 9000 },
  },
  oujda: {
    'Hay Qods': { min: 5000, max: 8000 }, 'Hay Al Wifaq': { min: 5500, max: 8500 },
    'Centre Ville Oujda': { min: 6000, max: 9500 }, 'Sidi Yahya': { min: 5000, max: 8000 },
    'Lazaret': { min: 6000, max: 9000 },
  },
  kenitra: {
    'Centre Ville Kenitra': { min: 7000, max: 11000 }, 'Bir Rami': { min: 8000, max: 13000 },
    'Hay Mahtat': { min: 6000, max: 9500 }, 'Saknia': { min: 6500, max: 10000 },
  },
  tetouan: {
    'Martil': { min: 7000, max: 12000 }, 'M Diq': { min: 9000, max: 15000 },
    'Centre Ville Tetouan': { min: 6000, max: 10000 }, 'Cabo Negro': { min: 10000, max: 18000 },
    'Medina Tetouan': { min: 5500, max: 9000 },
  },
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormState {
  type: string; regime: string; ville: string; quartier: string;
  surface: number; chambres: string; etage: string; etat: string; equip: string[];
}

interface EstimationResult {
  priceMid: number; priceMin: number; priceMax: number;
  pm2Mid: number; isLocation: boolean; villeFound: boolean; quartierFound: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtMAD(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace('.', ',') + ' M MAD';
  return Math.round(n / 1000) * 1000 + ' MAD';
}
function fmtRent(n: number): string { return n.toLocaleString('fr-FR') + ' MAD/mois'; }

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/['']/g, ' ').replace(/\s+/g, ' ').trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function findBestMatch(input: string, candidates: string[]): string {
  const nInput = normalize(input);
  if (!nInput) return '';
  const exact = candidates.find(c => normalize(c) === nInput);
  if (exact) return exact;
  const contains = candidates.find(c => { const nc = normalize(c); return nc.includes(nInput) || nInput.includes(nc); });
  if (contains) return contains;
  if (nInput.length >= 4) {
    const maxDist = nInput.length <= 6 ? 1 : nInput.length <= 10 ? 2 : 3;
    let best = '', bestDist = Infinity;
    for (const c of candidates) { const d = levenshtein(nInput, normalize(c)); if (d <= maxDist && d < bestDist) { bestDist = d; best = c; } }
    if (best) return best;
  }
  return '';
}

function calculate(form: FormState): EstimationResult {
  const isLocation = form.regime === 'location';
  const villeKey = findBestMatch(form.ville, Object.keys(PRIX));
  const villeFound = !!villeKey;
  const quartierData = PRIX[villeKey] ?? {};
  const quartierKey = findBestMatch(form.quartier, Object.keys(quartierData));
  const quartierFound = !!quartierKey;

  let prixRef: { min: number; max: number };
  if (quartierKey) { prixRef = quartierData[quartierKey]; }
  else if (villeKey && Object.values(quartierData).length > 0) {
    const vals = Object.values(quartierData);
    prixRef = { min: Math.round(vals.reduce((a, v) => a + v.min, 0) / vals.length), max: Math.round(vals.reduce((a, v) => a + v.max, 0) / vals.length) };
  } else { prixRef = { min: 8000, max: 14000 }; }

  let cMin = 1, cMax = 1;
  const [tc1, tc2] = ({ villa:[1.25,1.35], riad:[1.15,1.30], bureau:[0.80,0.90], local:[0.75,0.85], terrain:[0.35,0.50], appartement:[1.00,1.00] } as Record<string,[number,number]>)[form.type] ?? [1,1];
  cMin *= tc1; cMax *= tc2;
  const [ec1, ec2] = ({ neuf:[1.18,1.25], bon:[1.00,1.00], moyen:[0.85,0.88], travaux:[0.68,0.75] } as Record<string,[number,number]>)[form.etat] ?? [1,1];
  cMin *= ec1; cMax *= ec2;
  const [etc1, etc2] = ({ rdc:[0.90,0.93], '1':[0.96,0.98], '2':[0.98,1.00], '3':[1.00,1.02], '4':[1.01,1.03], dernier:[1.05,1.10] } as Record<string,[number,number]>)[form.etage] ?? [1,1];
  cMin *= etc1; cMax *= etc2;
  const cb = ({ '0':0.90,'1':0.95,'2':1.00,'3':1.05,'4':1.08,'5':1.12 } as Record<string,number>)[form.chambres] ?? 1;
  cMin *= cb; cMax *= cb;
  const bonus = 1 + form.equip.length * 0.03;
  cMin *= bonus; cMax *= bonus;

  const pm2Min = Math.round(prixRef.min * cMin);
  const pm2Max = Math.round(prixRef.max * cMax);
  const pm2Mid = Math.round((pm2Min + pm2Max) / 2);

  if (isLocation) {
    const tauxMin = form.type === 'bureau' || form.type === 'local' ? 0.006 : 0.004;
    const tauxMax = form.type === 'bureau' || form.type === 'local' ? 0.008 : 0.006;
    const rentMin = Math.round(form.surface * pm2Min * tauxMin / 100) * 100;
    const rentMax = Math.round(form.surface * pm2Max * tauxMax / 100) * 100;
    return { priceMid: Math.round((rentMin + rentMax) / 2 / 100) * 100, priceMin: rentMin, priceMax: rentMax, pm2Mid, isLocation, villeFound, quartierFound };
  }
  const priceMin = Math.round((form.surface * pm2Min) / 10000) * 10000;
  const priceMax = Math.round((form.surface * pm2Max) / 10000) * 10000;
  return { priceMid: Math.round((priceMin + priceMax) / 2 / 10000) * 10000, priceMin, priceMax, pm2Mid, isLocation, villeFound, quartierFound };
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  navy:      '#0D1F3C',
  gold:      '#C8A96E',
  goldLight: '#E2C98A',
  terra:     '#B5573A',
  ivory:     '#F9F5EF',
  muted:     'rgba(226,201,138,0.55)',
  border:    'rgba(200,169,110,0.18)',
  borderHov: 'rgba(200,169,110,0.5)',
  glass:     'rgba(13,31,60,0.55)',
  glassDeep: 'rgba(13,31,60,0.75)',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{
      fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: T.muted,
      fontFamily: "'DM Sans', system-ui, sans-serif", marginBottom: '10px',
    }}>
      {children}
      {required && <span style={{ color: T.terra, marginLeft: '4px' }}>*</span>}
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <div style={{ fontSize: '12px', color: T.terra, marginTop: '6px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {msg}
    </div>
  );
}

function ChipGroup({ options, value, multi = false, onChange }: {
  options: { val: string; label: string }[];
  value: string | string[]; multi?: boolean;
  onChange: (v: string | string[]) => void;
}) {
  const isSelected = (v: string) => multi ? (value as string[]).includes(v) : value === v;
  const handleClick = (v: string) => {
    if (multi) { const arr = value as string[]; onChange(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]); }
    else { onChange(v); }
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(({ val, label }) => (
        <button key={val} type="button" onClick={() => handleClick(val)} style={{
          padding: '9px 18px', borderRadius: '8px', cursor: 'pointer',
          fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          transition: 'all 0.2s ease',
          background: isSelected(val) ? 'rgba(200,169,110,0.12)' : 'rgba(13,31,60,0.4)',
          border: `1px solid ${isSelected(val) ? T.gold : T.border}`,
          color: isSelected(val) ? T.gold : 'rgba(226,201,138,0.55)',
        }}>
          {label}
        </button>
      ))}
    </div>
  );
}

function StepCircle({ n, current }: { n: number; current: number }) {
  const done = n < current;
  const active = n === current;
  return (
    <div style={{
      width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: done ? '14px' : '13px', fontWeight: 500,
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      transition: 'all 0.3s',
      background: active ? T.gold : done ? 'rgba(200,169,110,0.2)' : 'rgba(200,169,110,0.07)',
      border: `1px solid ${active || done ? T.gold : T.border}`,
      color: active ? T.navy : done ? T.gold : 'rgba(200,169,110,0.35)',
    }}>
      {done ? '✓' : n}
    </div>
  );
}

function ProgressBar({ current }: { current: number }) {
  const labels = ['Type', 'Localisation', 'Caractéristiques', 'Résultat'];
  return (
    <div style={{ marginBottom: '44px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0' }}>
        {[1, 2, 3, 4].map((n, i) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center' }}>
            <StepCircle n={n} current={current} />
            {i < 3 && (
              <div style={{
                width: '56px', height: '1px',
                background: n < current ? `linear-gradient(90deg, ${T.gold}, rgba(200,169,110,0.3))` : T.border,
                transition: 'background 0.4s',
              }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', padding: '0 2px' }}>
        {labels.map((l, i) => (
          <span key={l} style={{
            fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em',
            textTransform: 'uppercase', fontFamily: "'DM Sans', system-ui, sans-serif",
            color: i + 1 === current ? T.goldLight : i + 1 < current ? 'rgba(200,169,110,0.4)' : 'rgba(200,169,110,0.2)',
            transition: 'color 0.3s',
            width: '25%', textAlign: i === 0 ? 'left' : i === 3 ? 'right' : 'center',
          }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Input style ─────────────────────────────────────────────────────────────

const fieldInput: React.CSSProperties = {
  width: '100%', padding: '13px 18px', borderRadius: '9px',
  background: 'rgba(13,31,60,0.5)', border: `1px solid rgba(200,169,110,0.18)`,
  color: T.ivory, fontFamily: "'DM Sans', system-ui, sans-serif",
  fontSize: '15px', fontWeight: 400, outline: 'none',
  transition: 'all 0.25s', boxSizing: 'border-box' as const,
};

// ─── Buttons ─────────────────────────────────────────────────────────────────

function BtnPrimary({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} style={{
      flex: 1, padding: '14px 28px', borderRadius: '9px', border: 'none', cursor: 'pointer',
      background: `linear-gradient(135deg, ${T.gold} 0%, ${T.goldLight} 100%)`,
      color: T.navy, fontFamily: "'DM Sans', system-ui, sans-serif",
      fontSize: '14px', fontWeight: 600, letterSpacing: '0.04em',
      transition: 'all 0.25s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(200,169,110,0.25)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {children}
    </button>
  );
}

function BtnSecondary({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: '14px 24px', borderRadius: '9px', cursor: 'pointer',
      background: 'transparent', border: `1px solid ${T.border}`,
      color: T.muted, fontFamily: "'DM Sans', system-ui, sans-serif",
      fontSize: '14px', fontWeight: 500, transition: 'all 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.color = T.gold; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
    >
      Retour
    </button>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: T.glassDeep, backdropFilter: 'blur(12px)',
      border: `1px solid ${T.border}`, borderRadius: '20px',
      padding: '44px 40px', maxWidth: '740px', margin: '0 auto',
    }}>
      {children}
    </div>
  );
}

// ─── Main form component ──────────────────────────────────────────────────────

function EstimationForm() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    type: '', regime: '', ville: '', quartier: '',
    surface: 0, chambres: '2', etage: 'rdc', etat: 'bon', equip: [],
  });

  const set = useCallback(<K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  }, []);

  const inputStyle = (name: string): React.CSSProperties => ({
    ...fieldInput,
    border: `1px solid ${focused === name ? T.borderHov : T.border}`,
    background: focused === name ? 'rgba(13,31,60,0.75)' : 'rgba(13,31,60,0.5)',
    boxShadow: focused === name ? `0 0 0 3px rgba(200,169,110,0.07)` : 'none',
  });

  const fp = (name: string) => ({
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(null),
  });

  const field: React.CSSProperties = { marginBottom: '22px' };
  const btnRow: React.CSSProperties = { display: 'flex', gap: '12px', marginTop: '36px' };

  const stepTitle = (t: string) => (
    <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 300, color: T.ivory, marginBottom: '6px' }}>{t}</h2>
  );
  const stepSub = (t: string) => (
    <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '14px', fontWeight: 400, color: T.muted, marginBottom: '32px', lineHeight: 1.6 }}>{t}</p>
  );

  const goStep2 = () => {
    const errs: Record<string, string> = {};
    if (!form.type) errs.type = 'Veuillez sélectionner un type de bien';
    if (!form.regime) errs.regime = 'Veuillez sélectionner un régime';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(2);
  };

  const goStep3 = () => {
    const errs: Record<string, string> = {};
    if (!form.ville.trim()) errs.ville = 'Veuillez entrer une ville';
    if (!form.quartier.trim()) errs.quartier = 'Veuillez entrer un quartier';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(3);
  };

  const goStep4 = () => {
    const errs: Record<string, string> = {};
    if (!form.surface || form.surface <= 0) errs.surface = 'Veuillez entrer une superficie valide';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setResult(calculate(form));
    setStep(4);
  };

  // ── Step 1 ────────────────────────────────────────────────────────────────
  if (step === 1) return (
    <Card>
      <ProgressBar current={1} />
      {stepTitle('Type de bien')}
      {stepSub('Sélectionnez la catégorie et le régime de votre bien')}

      <div style={field}>
        <FieldLabel>Nature du bien</FieldLabel>
        <ChipGroup
          options={[
            { val: 'appartement', label: 'Appartement' }, { val: 'villa', label: 'Villa' },
            { val: 'riad', label: 'Riad' }, { val: 'bureau', label: 'Bureau' },
            { val: 'local', label: 'Local comm.' }, { val: 'terrain', label: 'Terrain' },
          ]}
          value={form.type} onChange={v => set('type', v as string)}
        />
        <FieldError msg={errors.type} />
      </div>

      <div style={field}>
        <FieldLabel>Régime</FieldLabel>
        <ChipGroup
          options={[{ val: 'vente', label: 'Vente' }, { val: 'location', label: 'Location' }]}
          value={form.regime} onChange={v => set('regime', v as string)}
        />
        <FieldError msg={errors.regime} />
      </div>

      <div style={btnRow}><BtnPrimary onClick={goStep2}>Continuer →</BtnPrimary></div>
    </Card>
  );

  // ── Step 2 ────────────────────────────────────────────────────────────────
  if (step === 2) return (
    <Card>
      <ProgressBar current={2} />
      {stepTitle('Localisation')}
      {stepSub('Indiquez la ville et le quartier de votre bien')}

      <div style={field}>
        <FieldLabel required>Ville</FieldLabel>
        <input
          type="text" placeholder="Ex : Casablanca, Rabat, Marrakech..."
          value={form.ville}
          onChange={e => { set('ville', e.target.value); set('quartier', ''); }}
          style={inputStyle('ville')} {...fp('ville')}
        />
        <FieldError msg={errors.ville} />
      </div>

      <div style={field}>
        <FieldLabel required>Quartier</FieldLabel>
        <input
          type="text" placeholder="Ex : Anfa, Maarif, Agdal, Guéliz..."
          value={form.quartier}
          onChange={e => set('quartier', e.target.value)}
          style={inputStyle('quartier')} {...fp('quartier')}
        />
        <FieldError msg={errors.quartier} />
      </div>

      <div style={btnRow}><BtnSecondary onClick={() => setStep(1)} /><BtnPrimary onClick={goStep3}>Continuer →</BtnPrimary></div>
    </Card>
  );

  // ── Step 3 ────────────────────────────────────────────────────────────────
  if (step === 3) return (
    <Card>
      <ProgressBar current={3} />
      {stepTitle('Caractéristiques')}
      {stepSub('Décrivez votre bien pour affiner l\'estimation')}

      <div style={field}>
        <FieldLabel required>Superficie (m²)</FieldLabel>
        <input
          type="number" min={10} max={99999} placeholder="Ex : 120"
          value={form.surface === 0 ? '' : form.surface}
          onChange={e => set('surface', Number(e.target.value))}
          style={inputStyle('surface')} {...fp('surface')}
        />
        <FieldError msg={errors.surface} />
      </div>

      <div style={field}>
        <FieldLabel>Chambres</FieldLabel>
        <ChipGroup
          options={[
            { val: '0', label: 'Studio' }, { val: '1', label: '1 ch.' },
            { val: '2', label: '2 ch.' }, { val: '3', label: '3 ch.' },
            { val: '4', label: '4 ch.' }, { val: '5', label: '5+ ch.' },
          ]}
          value={form.chambres} onChange={v => set('chambres', v as string)}
        />
      </div>

      <div style={field}>
        <FieldLabel>Étage</FieldLabel>
        <ChipGroup
          options={[
            { val: 'rdc', label: 'RDC' }, { val: '1', label: '1er' },
            { val: '2', label: '2e' }, { val: '3', label: '3e' },
            { val: '4', label: '4e+' }, { val: 'dernier', label: 'Dernier' },
          ]}
          value={form.etage} onChange={v => set('etage', v as string)}
        />
      </div>

      <div style={field}>
        <FieldLabel>État général</FieldLabel>
        <ChipGroup
          options={[
            { val: 'neuf', label: 'Neuf' }, { val: 'bon', label: 'Bon état' },
            { val: 'moyen', label: 'À rafraîchir' }, { val: 'travaux', label: 'Gros travaux' },
          ]}
          value={form.etat} onChange={v => set('etat', v as string)}
        />
      </div>

      <div style={field}>
        <FieldLabel>Équipements</FieldLabel>
        <ChipGroup
          multi
          options={[
            { val: 'parking', label: 'Parking' }, { val: 'terrasse', label: 'Terrasse' },
            { val: 'piscine', label: 'Piscine' }, { val: 'gardien', label: 'Gardien' },
            { val: 'ascenseur', label: 'Ascenseur' }, { val: 'vue', label: 'Vue dégagée' },
          ]}
          value={form.equip} onChange={v => set('equip', v as string[])}
        />
      </div>

      <div style={btnRow}><BtnSecondary onClick={() => setStep(2)} /><BtnPrimary onClick={goStep4}>Estimer mon bien</BtnPrimary></div>
    </Card>
  );

  // ── Step 4 — Résultat ─────────────────────────────────────────────────────
  const r = result!;
  return (
    <Card>
      <ProgressBar current={4} />

      {!r.villeFound && (
        <div style={{
          background: 'rgba(181,87,58,0.08)', border: `1px solid rgba(181,87,58,0.25)`,
          borderRadius: '10px', padding: '12px 16px', marginBottom: '24px',
          fontSize: '13px', color: 'rgba(181,87,58,0.9)',
          fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.5,
        }}>
          ⚠️ Ville non reconnue — estimation basée sur les moyennes nationales.
        </div>
      )}

      {/* Prix central */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(200,169,110,0.08) 0%, rgba(200,169,110,0.04) 100%)',
        border: `1px solid rgba(200,169,110,0.28)`,
        borderRadius: '16px', padding: '36px 28px', textAlign: 'center', marginBottom: '24px',
      }}>
        <p style={{
          fontSize: '11px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase',
          color: T.muted, fontFamily: "'DM Sans', system-ui, sans-serif", marginBottom: '12px',
        }}>
          {r.isLocation ? 'Loyer mensuel estimé' : 'Valeur estimée'}
        </p>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 300,
          color: T.gold, lineHeight: 1, marginBottom: '10px',
        }}>
          {r.isLocation ? fmtRent(r.priceMid) : fmtMAD(r.priceMid)}
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(200,169,110,0.45)', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          Fourchette&nbsp;: {r.isLocation
            ? `${fmtRent(r.priceMin)} — ${fmtRent(r.priceMax)}`
            : `${fmtMAD(r.priceMin)} — ${fmtMAD(r.priceMax)}`}
        </p>
      </div>

      {/* Grille détails */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Prix / m²', val: `${r.pm2Mid.toLocaleString('fr-FR')} MAD/m²` },
          { label: 'Superficie', val: `${form.surface} m²` },
          { label: 'Ville', val: form.ville },
          { label: 'Quartier', val: form.quartier },
          { label: 'Type de bien', val: form.type.charAt(0).toUpperCase() + form.type.slice(1) },
          { label: 'État', val: ({ neuf: 'Neuf', bon: 'Bon état', moyen: 'À rafraîchir', travaux: 'Gros travaux' } as Record<string,string>)[form.etat] ?? form.etat },
        ].map(({ label, val }) => (
          <div key={label} style={{
            background: 'rgba(13,31,60,0.45)', border: `1px solid ${T.border}`,
            borderRadius: '10px', padding: '14px 16px',
          }}>
            <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(200,169,110,0.4)', fontFamily: "'DM Sans', system-ui, sans-serif", marginBottom: '4px' }}>{label}</p>
            <p style={{ fontSize: '15px', fontWeight: 400, color: T.ivory, fontFamily: "'DM Sans', system-ui, sans-serif" }}>{val}</p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p style={{
        fontSize: '12px', color: 'rgba(200,169,110,0.3)',
        textAlign: 'center', lineHeight: 1.7, padding: '0 8px',
        fontFamily: "'DM Sans', system-ui, sans-serif", marginBottom: '4px',
      }}>
        Estimation indicative basée sur les prix du marché marocain actuel.
        Pour une évaluation officielle, contactez nos experts LANDMARK ESTATE.
      </p>

      <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
        <BtnSecondary onClick={() => setStep(3)} />
        <BtnPrimary onClick={() => window.location.href = '/estimation/contact'}>
          Contacter un expert →
        </BtnPrimary>

      </div>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EstimationPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: rgba(122,143,163,0.45) !important; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.3; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.65s ease both; }
        .fade-1 { animation-delay: 0.05s; }
        .fade-2 { animation-delay: 0.15s; }
        .fade-3 { animation-delay: 0.25s; }
        @media (max-width: 680px) {
          .hero-title { font-size: 38px !important; }
          .card-inner { padding: 28px 20px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <main style={{
        minHeight: '100vh',
        background: `linear-gradient(160deg, ${T.navy} 0%, #091629 45%, #050D1A 100%)`,
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Ambient glow */}
        <div style={{ position: 'fixed', top: '-180px', right: '-180px', width: '580px', height: '580px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,169,110,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '-120px', left: '-120px', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,169,110,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* ── HERO ── */}
        <section style={{ padding: '88px 24px 72px', textAlign: 'center', position: 'relative', zIndex: 1, borderBottom: `1px solid ${T.border}` }}>

          {/* Badge */}
          <div className="fade-up fade-1" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 18px', borderRadius: '100px', marginBottom: '32px',
            border: `1px solid rgba(200,169,110,0.22)`,
            background: 'rgba(200,169,110,0.05)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.gold, display: 'inline-block' }} />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.gold, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              Service Gratuit · Sans engagement
            </span>
          </div>

          {/* Title */}
          <h1 className="fade-up fade-2 hero-title" style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 300,
            color: T.ivory, lineHeight: 1.1, marginBottom: '20px',
          }}>
            Estimation de<br />
            <span style={{ color: T.gold, fontStyle: 'italic' }}>votre bien immobilier</span>
          </h1>

          {/* Subtitle */}
          <p className="fade-up fade-3" style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: '16px', fontWeight: 400,
            color: 'rgba(226,201,138,0.6)',
            maxWidth: '520px', margin: '0 auto 52px', lineHeight: 1.8,
          }}>
            Obtenez une évaluation précise et gratuite basée sur les prix réels
            du marché marocain. Résultat immédiat, expertise humaine sous 24h.
          </p>

          {/* Stats */}
          <div className="stats-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px', maxWidth: '600px', margin: '0 auto',
            background: T.border, borderRadius: '12px', overflow: 'hidden',
            border: `1px solid ${T.border}`,
          }}>
            {[
              { val: '10+', label: 'Villes couvertes' },
              { val: '100+', label: 'Quartiers analysés' },
              { val: '24h', label: 'Délai de réponse' },
              { val: '100%', label: 'Gratuit' },
            ].map(({ val, label }) => (
              <div key={label} style={{ padding: '18px 12px', background: T.glassDeep, textAlign: 'center' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '24px', fontWeight: 300, color: T.gold, marginBottom: '2px' }}>{val}</p>
                <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '11px', fontWeight: 400, color: 'rgba(226,201,138,0.4)', letterSpacing: '0.04em' }}>{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FORM ── */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '72px 24px', position: 'relative', zIndex: 1 }}>
          <EstimationForm />
        </section>

        {/* ── TRUST BAR ── */}
        <section style={{ borderTop: `1px solid ${T.border}`, padding: '56px 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '36px', textAlign: 'center' }}>
            {[
              { icon: '⚡', label: 'Réponse sous 24h', sub: 'Délai garanti' },
              { icon: '🎯', label: '100% Gratuit', sub: 'Sans engagement' },
              { icon: '🔒', label: 'Confidentiel', sub: 'Données sécurisées' },
              { icon: '📊', label: 'Expertise locale', sub: 'Marché marocain' },
            ].map(({ icon, label, sub }) => (
              <div key={label}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{icon}</div>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '17px', fontWeight: 300, color: T.ivory, marginBottom: '4px' }}>{label}</p>
                <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '12px', color: 'rgba(200,169,110,0.4)' }}>{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer line */}
        <div style={{ borderTop: `1px solid ${T.border}`, padding: '20px 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '12px', color: 'rgba(200,169,110,0.25)' }}>
            © {new Date().getFullYear()} LANDMARK ESTATE · Estimation indicative, non contractuelle
          </p>
        </div>

      </main>
    </>
  );
}