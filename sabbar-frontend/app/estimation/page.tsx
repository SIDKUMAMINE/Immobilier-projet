'use client';

import { useState, useCallback } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

const PRIX: Record<string, Record<string, { min: number; max: number }>> = {
  casablanca: {
    'Anfa': { min: 18000, max: 28000 },
    'Maarif': { min: 14000, max: 20000 },
    'Gauthier': { min: 15000, max: 22000 },
    'Ain Diab': { min: 20000, max: 35000 },
    'Bourgogne': { min: 13000, max: 19000 },
    'Sidi Maarouf': { min: 10000, max: 15000 },
    'Bouskoura': { min: 8000, max: 13000 },
    'Hay Hassani': { min: 8000, max: 12000 },
    'Californie': { min: 16000, max: 24000 },
    'Val Fleuri': { min: 12000, max: 17000 },
    'Oulfa': { min: 7000, max: 11000 },
    'Bernoussi': { min: 7000, max: 10000 },
    'Ain Sbaa': { min: 7000, max: 11000 },
    'Hay Mohammadi': { min: 6000, max: 9000 },
    'Sidi Bernoussi': { min: 6500, max: 10000 },
    'Sbata': { min: 7000, max: 10500 },
    'Derb Sultan': { min: 7500, max: 11000 },
    'Ben Msik': { min: 6500, max: 9500 },
    'Salmia': { min: 7000, max: 10000 },
    'Roches Noires': { min: 8000, max: 12000 },
    'Polo': { min: 11000, max: 16000 },
    'Racine': { min: 15000, max: 22000 },
    'CIL': { min: 9000, max: 14000 },
    'Beauséjour': { min: 13000, max: 19000 },
    'Oasis': { min: 12000, max: 18000 },
    'Quartier des Hopitaux': { min: 11000, max: 16000 },
    'Hay Nour': { min: 6500, max: 10000 },
    'Lissasfa': { min: 8000, max: 12000 },
    'Attacharouk': { min: 7000, max: 10500 },
    'Lahraouiyine': { min: 5500, max: 9000 },
    'Dar Bouazza': { min: 9000, max: 14000 },
    'Mediouna': { min: 5000, max: 8000 },
    'Nassim': { min: 10000, max: 15000 },
    'Les Princesses': { min: 11000, max: 16000 },
    'Hay Oulfa': { min: 7000, max: 11000 },
    'Ain Chock': { min: 8000, max: 12000 },
    'Belvedere': { min: 10000, max: 15000 },
    'Palmier': { min: 12000, max: 18000 },
    'Ghandi': { min: 9000, max: 13000 },
    'Maârif Extension': { min: 12000, max: 18000 },
    'Hay Ennakhil': { min: 7500, max: 11000 },
    'Sidi Belyout': { min: 8000, max: 13000 },
    'Habous': { min: 9000, max: 14000 },
    'Triangle d Or': { min: 14000, max: 21000 },
    'Quartier Riviera': { min: 13000, max: 19000 },
    'Ain Sebaa': { min: 7000, max: 11000 },
    'Zenata': { min: 6000, max: 9500 },
    'Medina': { min: 8000, max: 13000 },
  },
  rabat: {
    'Agdal': { min: 14000, max: 22000 },
    'Hassan': { min: 12000, max: 18000 },
    'Souissi': { min: 16000, max: 25000 },
    'Les Orangers': { min: 11000, max: 16000 },
    'Hay Riad': { min: 13000, max: 19000 },
    'Youssoufia': { min: 8000, max: 12000 },
    'Akkari': { min: 7000, max: 11000 },
    'Hay Nahda': { min: 8000, max: 12000 },
    'Ocean': { min: 10000, max: 15000 },
    'Diour Jamaa': { min: 9000, max: 14000 },
    'Aviation': { min: 9000, max: 13000 },
    'Madinat Al Irfane': { min: 11000, max: 16000 },
    'Takaddoum': { min: 7500, max: 11000 },
    'Hay Salam': { min: 7000, max: 11000 },
    'Temara': { min: 7000, max: 11000 },
    'Sale': { min: 6000, max: 10000 },
    'Hay Karima': { min: 6500, max: 9500 },
    'Hay Inara': { min: 7000, max: 11000 },
    'Medina Rabat': { min: 9000, max: 15000 },
    'Ryad': { min: 13000, max: 19000 },
    'Hay Fadila': { min: 7000, max: 10500 },
    'Quartier des Ministeres': { min: 12000, max: 18000 },
  },
  marrakech: {
    'Gueliz': { min: 13000, max: 20000 },
    'Hivernage': { min: 16000, max: 25000 },
    'Palmeraie': { min: 18000, max: 35000 },
    'Mellah': { min: 9000, max: 15000 },
    'Agdal Marrakech': { min: 11000, max: 17000 },
    'Targa': { min: 8000, max: 13000 },
    'Medina Marrakech': { min: 10000, max: 18000 },
    'Sidi Ghanem': { min: 9000, max: 14000 },
    'Semlalia': { min: 10000, max: 16000 },
    'Massira': { min: 7000, max: 11000 },
    'Mhamid': { min: 6500, max: 10000 },
    'Amelkis': { min: 12000, max: 20000 },
    'Route de Fes': { min: 8000, max: 13000 },
    'Douar Laarab': { min: 5000, max: 8000 },
    'Hay Hassani Marrakech': { min: 7000, max: 11000 },
    'Bab Doukkala': { min: 9000, max: 14000 },
    'M Hamid': { min: 6500, max: 10000 },
    'Sidi Youssef Ben Ali': { min: 6000, max: 9500 },
    'Route de Casablanca': { min: 8000, max: 13000 },
    'Nouvelle Ville': { min: 9000, max: 14000 },
  },
  tanger: {
    'Malabata': { min: 12000, max: 20000 },
    'Marchane': { min: 10000, max: 16000 },
    'Iberia': { min: 11000, max: 17000 },
    'Val Fleuri Tanger': { min: 9000, max: 14000 },
    'Boukhalef': { min: 7000, max: 11000 },
    'Moghogha': { min: 6000, max: 10000 },
    'Medina Tanger': { min: 8000, max: 14000 },
    'California Tanger': { min: 10000, max: 16000 },
    'Mesnana': { min: 7000, max: 11000 },
    'Charf': { min: 8000, max: 13000 },
    'Beni Makada': { min: 6000, max: 9500 },
    'Tanja Balia': { min: 5500, max: 9000 },
    'Cap Spartel': { min: 12000, max: 20000 },
    'Gzenaya': { min: 6500, max: 10000 },
    'Souani': { min: 7000, max: 11000 },
    'Dradeb': { min: 6000, max: 9500 },
    'Branes': { min: 7000, max: 11000 },
    'Hay Al Amal': { min: 6000, max: 9000 },
    'Quartier Administratif': { min: 9000, max: 14000 },
    'Achakar': { min: 10000, max: 16000 },
  },
  agadir: {
    'Founty': { min: 12000, max: 18000 },
    'Hay Mohammadi Agadir': { min: 7000, max: 11000 },
    'Talborjt': { min: 8000, max: 13000 },
    'Cite Suisse': { min: 11000, max: 16000 },
    'Anza': { min: 6000, max: 10000 },
    'Hay Dakhla': { min: 6500, max: 10000 },
    'Tilila': { min: 7000, max: 11000 },
    'Quartier Industriel Agadir': { min: 5000, max: 8000 },
    'Bensergao': { min: 8000, max: 13000 },
    'Tikiouine': { min: 6000, max: 9500 },
    'Hay Massira': { min: 7000, max: 11000 },
    'Agadir Marina': { min: 13000, max: 20000 },
    'Quartier Industriel': { min: 5000, max: 8000 },
    'Hay Al Matar': { min: 6500, max: 10000 },
    'Cité Al Wahda': { min: 7000, max: 11000 },
  },
  fes: {
    'Saiss': { min: 8000, max: 14000 },
    'Route d Imouzzer': { min: 10000, max: 16000 },
    'Montfleuri': { min: 9000, max: 14000 },
    'Atlas': { min: 7000, max: 12000 },
    'Les Merinides': { min: 8000, max: 13000 },
    'Narjiss': { min: 8000, max: 13000 },
    'Andalous': { min: 7000, max: 11000 },
    'Agdal Fes': { min: 9000, max: 14000 },
    'Medina Fes': { min: 6000, max: 10000 },
    'Aouinet Hajjaj': { min: 6500, max: 10000 },
    'Ville Nouvelle Fes': { min: 8000, max: 13000 },
    'Zouagha': { min: 7000, max: 11000 },
    'Hay Amal Fes': { min: 6500, max: 10000 },
    'Ain Chkef': { min: 7000, max: 11000 },
    'Bensouda': { min: 6000, max: 9500 },
  },
  meknes: {
    'Hamria': { min: 7000, max: 12000 },
    'Nouvelle Ville Meknes': { min: 8000, max: 13000 },
    'Medina Meknes': { min: 5500, max: 9000 },
    'Hay Salam Meknes': { min: 6000, max: 9500 },
    'Marjane': { min: 7500, max: 12000 },
    'Bassatine': { min: 6500, max: 10000 },
    'Zitoune': { min: 6000, max: 9000 },
  },
  oujda: {
    'Hay Qods': { min: 5000, max: 8000 },
    'Hay Al Wifaq': { min: 5500, max: 8500 },
    'Centre Ville Oujda': { min: 6000, max: 9500 },
    'Sidi Yahya': { min: 5000, max: 8000 },
    'Lazaret': { min: 6000, max: 9000 },
  },
  kenitra: {
    'Centre Ville Kenitra': { min: 7000, max: 11000 },
    'Bir Rami': { min: 8000, max: 13000 },
    'Hay Mahtat': { min: 6000, max: 9500 },
    'Saknia': { min: 6500, max: 10000 },
  },
  tetouan: {
    'Martil': { min: 7000, max: 12000 },
    'M Diq': { min: 9000, max: 15000 },
    'Centre Ville Tetouan': { min: 6000, max: 10000 },
    'Cabo Negro': { min: 10000, max: 18000 },
    'Medina Tetouan': { min: 5500, max: 9000 },
  },
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormState {
  type: string;
  regime: string;
  ville: string;
  quartier: string;
  surface: number;
  chambres: string;
  etage: string;
  etat: string;
  equip: string[];
}

interface EstimationResult {
  priceMid: number;
  priceMin: number;
  priceMax: number;
  pm2Mid: number;
  isLocation: boolean;
  villeFound: boolean;
  quartierFound: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtMAD(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace('.', ',') + ' M MAD';
  return Math.round(n / 1000) * 1000 + ' MAD';
}

function fmtRent(n: number): string {
  return n.toLocaleString('fr-FR') + ' MAD/mois';
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function findBestMatch(input: string, candidates: string[]): string {
  const nInput = normalize(input);
  if (!nInput) return '';

  // 1. Exact match
  const exact = candidates.find(c => normalize(c) === nInput);
  if (exact) return exact;

  // 2. Contains match
  const contains = candidates.find(c => {
    const nc = normalize(c);
    return nc.includes(nInput) || nInput.includes(nc);
  });
  if (contains) return contains;

  // 3. Levenshtein fuzzy (tolerance proportional to length)
  if (nInput.length >= 4) {
    const maxDist = nInput.length <= 6 ? 1 : nInput.length <= 10 ? 2 : 3;
    let bestCandidate = '';
    let bestDist = Infinity;
    for (const c of candidates) {
      const nc = normalize(c);
      const dist = levenshtein(nInput, nc);
      if (dist <= maxDist && dist < bestDist) {
        bestDist = dist;
        bestCandidate = c;
      }
    }
    if (bestCandidate) return bestCandidate;
  }

  return '';
}

function calculate(form: FormState): EstimationResult {
  const isLocation = form.regime === 'location';

  // ── Recherche ville ──
  const villeNorm = normalize(form.ville);
  const villeKey = findBestMatch(form.ville, Object.keys(PRIX));
  const villeFound = !!villeKey;
  const quartierData = PRIX[villeKey] ?? {};

  // ── Recherche quartier ──
  const quartierKey = findBestMatch(form.quartier, Object.keys(quartierData));
  const quartierFound = !!quartierKey;

  // ── Prix de référence ──
  let prixRef: { min: number; max: number };
  if (quartierKey) {
    prixRef = quartierData[quartierKey];
  } else if (villeKey && Object.values(quartierData).length > 0) {
    const vals = Object.values(quartierData);
    prixRef = {
      min: Math.round(vals.reduce((a, v) => a + v.min, 0) / vals.length),
      max: Math.round(vals.reduce((a, v) => a + v.max, 0) / vals.length),
    };
  } else {
    prixRef = { min: 8000, max: 14000 };
  }

  // ── Coefficients type de bien ──
  let cMin = 1, cMax = 1;
  const typeCoeffs: Record<string, [number, number]> = {
    villa:       [1.25, 1.35],
    riad:        [1.15, 1.30],
    bureau:      [0.80, 0.90],
    local:       [0.75, 0.85],
    terrain:     [0.35, 0.50],
    appartement: [1.00, 1.00],
  };
  const [tc1, tc2] = typeCoeffs[form.type] ?? [1, 1];
  cMin *= tc1; cMax *= tc2;

  // ── Coefficients état ──
  const etatCoeffs: Record<string, [number, number]> = {
    neuf:    [1.18, 1.25],
    bon:     [1.00, 1.00],
    moyen:   [0.85, 0.88],
    travaux: [0.68, 0.75],
  };
  const [ec1, ec2] = etatCoeffs[form.etat] ?? [1, 1];
  cMin *= ec1; cMax *= ec2;

  // ── Coefficients étage ──
  const etageCoeffs: Record<string, [number, number]> = {
    rdc:     [0.90, 0.93],
    '1':     [0.96, 0.98],
    '2':     [0.98, 1.00],
    '3':     [1.00, 1.02],
    '4':     [1.01, 1.03],
    dernier: [1.05, 1.10],
  };
  const [etc1, etc2] = etageCoeffs[form.etage] ?? [1, 1];
  cMin *= etc1; cMax *= etc2;

  // ── Bonus chambres ──
  const chambresBonus: Record<string, number> = {
    '0': 0.90, '1': 0.95, '2': 1.00, '3': 1.05, '4': 1.08, '5': 1.12,
  };
  const cb = chambresBonus[form.chambres] ?? 1;
  cMin *= cb; cMax *= cb;

  // ── Bonus équipements ──
  const bonus = 1 + form.equip.length * 0.03;
  cMin *= bonus; cMax *= bonus;

  // ── Calcul final ──
  const pm2Min = Math.round(prixRef.min * cMin);
  const pm2Max = Math.round(prixRef.max * cMax);
  const pm2Mid = Math.round((pm2Min + pm2Max) / 2);

  if (isLocation) {
    const tauxMin = form.type === 'bureau' || form.type === 'local' ? 0.006 : 0.004;
    const tauxMax = form.type === 'bureau' || form.type === 'local' ? 0.008 : 0.006;
    const rentMin = Math.round(form.surface * pm2Min * tauxMin / 100) * 100;
    const rentMax = Math.round(form.surface * pm2Max * tauxMax / 100) * 100;
    return {
      priceMid: Math.round((rentMin + rentMax) / 2 / 100) * 100,
      priceMin: rentMin, priceMax: rentMax,
      pm2Mid, isLocation, villeFound, quartierFound,
    };
  }

  const priceMin = Math.round((form.surface * pm2Min) / 10000) * 10000;
  const priceMax = Math.round((form.surface * pm2Max) / 10000) * 10000;
  return {
    priceMid: Math.round((priceMin + priceMax) / 2 / 10000) * 10000,
    priceMin, priceMax, pm2Mid, isLocation, villeFound, quartierFound,
  };
}

// ─── Styles communs ───────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(200,169,110,0.2)',
  borderRadius: '8px',
  padding: '12px 16px',
  fontFamily: "'DM Sans', system-ui, sans-serif",
  fontSize: '15px',
  color: '#F9F5EF',
  outline: 'none',
  boxSizing: 'border-box',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function ChipGroup({
  options, value, multi = false, onChange,
}: {
  options: { val: string; label: string }[];
  value: string | string[];
  multi?: boolean;
  onChange: (v: string | string[]) => void;
}) {
  const isSelected = (v: string) =>
    multi ? (value as string[]).includes(v) : value === v;

  const handleClick = (v: string) => {
    if (multi) {
      const arr = value as string[];
      onChange(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    } else {
      onChange(v);
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {options.map(({ val, label }) => (
        <button
          key={val}
          type="button"
          onClick={() => handleClick(val)}
          style={{
            padding: '10px 18px',
            background: isSelected(val) ? 'rgba(200,169,110,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isSelected(val) ? '#C8A96E' : 'rgba(200,169,110,0.2)'}`,
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: isSelected(val) ? '#C8A96E' : 'rgba(249,245,239,0.7)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: 'rgba(200,169,110,0.7)', marginBottom: '10px',
    }}>
      {children}
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <div style={{ fontSize: '12px', color: '#e87070', marginTop: '6px' }}>{msg}</div>;
}

function BtnNext({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1, padding: '13px 24px',
        background: '#C8A96E', border: 'none', borderRadius: '8px',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: '14px', fontWeight: 500, color: '#0D1F3C',
        cursor: 'pointer', letterSpacing: '0.05em',
      }}
    >
      {children}
    </button>
  );
}

function BtnBack({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '13px 24px',
        background: 'transparent',
        border: '1px solid rgba(200,169,110,0.25)',
        borderRadius: '8px',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: '14px', fontWeight: 500,
        color: 'rgba(200,169,110,0.7)',
        cursor: 'pointer',
      }}
    >
      Retour
    </button>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
      {[1, 2, 3, 4].map((n, i) => (
        <div key={n} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: n === current ? '#C8A96E' : n < current ? 'rgba(200,169,110,0.3)' : 'rgba(200,169,110,0.12)',
            border: `1px solid ${n <= current ? '#C8A96E' : 'rgba(200,169,110,0.25)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 500,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: n === current ? '#0D1F3C' : n < current ? '#C8A96E' : 'rgba(200,169,110,0.5)',
            transition: 'all 0.3s',
          }}>
            {n < current ? '✓' : n}
          </div>
          {i < 3 && (
            <div style={{
              width: '60px', height: '1px',
              background: n < current ? 'rgba(200,169,110,0.5)' : 'rgba(200,169,110,0.2)',
              transition: 'background 0.3s',
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main form component ──────────────────────────────────────────────────────

function EstimationForm() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [form, setForm] = useState<FormState>({
    type: '', regime: '', ville: '', quartier: '',
    surface: 0, chambres: '2', etage: 'rdc', etat: 'bon', equip: [],
  });

  const set = useCallback(<K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: '' }));
  }, []);

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

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(200,169,110,0.15)',
    borderRadius: '16px',
    padding: '36px 32px',
    maxWidth: '720px',
    margin: '0 auto',
  };

  const stepTitleStyle: React.CSSProperties = {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '28px', fontWeight: 600,
    color: '#F9F5EF', marginBottom: '6px',
  };

  const stepSubStyle: React.CSSProperties = {
    fontSize: '14px', color: 'rgba(200,169,110,0.65)', marginBottom: '28px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  };

  const fieldStyle: React.CSSProperties = { marginBottom: '24px' };
  const btnRow: React.CSSProperties = { display: 'flex', gap: '12px', marginTop: '32px' };

  // ── Step 1 ────────────────────────────────────────────────────────────────

  if (step === 1) return (
    <div style={cardStyle}>
      <ProgressBar current={1} />
      <div style={stepTitleStyle}>Type de bien</div>
      <div style={stepSubStyle}>Sélectionnez la catégorie qui correspond à votre bien</div>

      <div style={fieldStyle}>
        <Label>Nature du bien</Label>
        <ChipGroup
          options={[
            { val: 'appartement', label: 'Appartement' },
            { val: 'villa', label: 'Villa' },
            { val: 'riad', label: 'Riad' },
            { val: 'bureau', label: 'Bureau' },
            { val: 'local', label: 'Local comm.' },
            { val: 'terrain', label: 'Terrain' },
          ]}
          value={form.type}
          onChange={(v) => set('type', v as string)}
        />
        <FieldError msg={errors.type} />
      </div>

      <div style={fieldStyle}>
        <Label>Régime</Label>
        <ChipGroup
          options={[
            { val: 'vente', label: 'Vente' },
            { val: 'location', label: 'Location' },
          ]}
          value={form.regime}
          onChange={(v) => set('regime', v as string)}
        />
        <FieldError msg={errors.regime} />
      </div>

      <div style={btnRow}>
        <BtnNext onClick={goStep2}>Continuer</BtnNext>
      </div>
    </div>
  );

  // ── Step 2 ────────────────────────────────────────────────────────────────

  if (step === 2) return (
    <div style={cardStyle}>
      <ProgressBar current={2} />
      <div style={stepTitleStyle}>Localisation</div>
      <div style={stepSubStyle}>Où se situe votre bien ?</div>

      <div style={fieldStyle}>
        <Label>Ville</Label>
        <input
          type="text"
          placeholder="Ex : Casablanca, Rabat, Marrakech..."
          value={form.ville}
          onChange={(e) => { set('ville', e.target.value); set('quartier', ''); }}
          style={inputStyle}
        />
        <FieldError msg={errors.ville} />
      </div>

      <div style={fieldStyle}>
        <Label>Quartier</Label>
        <input
          type="text"
          placeholder="Ex : Anfa, Maarif, Agdal, Guéliz..."
          value={form.quartier}
          onChange={(e) => set('quartier', e.target.value)}
          style={inputStyle}
        />
        <FieldError msg={errors.quartier} />
      </div>

      <div style={btnRow}>
        <BtnBack onClick={() => setStep(1)} />
        <BtnNext onClick={goStep3}>Continuer</BtnNext>
      </div>
    </div>
  );

  // ── Step 3 ────────────────────────────────────────────────────────────────

  if (step === 3) return (
    <div style={cardStyle}>
      <ProgressBar current={3} />
      <div style={stepTitleStyle}>Caractéristiques</div>
      <div style={stepSubStyle}>Décrivez les détails de votre bien</div>

      <div style={fieldStyle}>
        <Label>Superficie (m²)</Label>
        <input
          type="number"
          min={10}
          max={99999}
          placeholder="Ex : 120"
          value={form.surface === 0 ? '' : form.surface}
          onChange={(e) => set('surface', Number(e.target.value))}
          style={inputStyle}
        />
        <FieldError msg={errors.surface} />
      </div>

      <div style={fieldStyle}>
        <Label>Chambres</Label>
        <ChipGroup
          options={[
            { val: '0', label: 'Studio' },
            { val: '1', label: '1 ch.' },
            { val: '2', label: '2 ch.' },
            { val: '3', label: '3 ch.' },
            { val: '4', label: '4 ch.' },
            { val: '5', label: '5+ ch.' },
          ]}
          value={form.chambres}
          onChange={(v) => set('chambres', v as string)}
        />
      </div>

      <div style={fieldStyle}>
        <Label>Étage</Label>
        <ChipGroup
          options={[
            { val: 'rdc', label: 'RDC' },
            { val: '1', label: '1er' },
            { val: '2', label: '2e' },
            { val: '3', label: '3e' },
            { val: '4', label: '4e+' },
            { val: 'dernier', label: 'Dernier' },
          ]}
          value={form.etage}
          onChange={(v) => set('etage', v as string)}
        />
      </div>

      <div style={fieldStyle}>
        <Label>État général</Label>
        <ChipGroup
          options={[
            { val: 'neuf', label: 'Neuf' },
            { val: 'bon', label: 'Bon état' },
            { val: 'moyen', label: 'À rafraîchir' },
            { val: 'travaux', label: 'Gros travaux' },
          ]}
          value={form.etat}
          onChange={(v) => set('etat', v as string)}
        />
      </div>

      <div style={fieldStyle}>
        <Label>Équipements (multi-sélection)</Label>
        <ChipGroup
          multi
          options={[
            { val: 'parking', label: 'Parking' },
            { val: 'terrasse', label: 'Terrasse' },
            { val: 'piscine', label: 'Piscine' },
            { val: 'gardien', label: 'Gardien' },
            { val: 'ascenseur', label: 'Ascenseur' },
            { val: 'vue', label: 'Vue dégagée' },
          ]}
          value={form.equip}
          onChange={(v) => set('equip', v as string[])}
        />
      </div>

      <div style={btnRow}>
        <BtnBack onClick={() => setStep(2)} />
        <BtnNext onClick={goStep4}>Estimer mon bien</BtnNext>
      </div>
    </div>
  );

  // ── Step 4 — Résultat ─────────────────────────────────────────────────────

  const r = result!;
  return (
    <div style={cardStyle}>
      <ProgressBar current={4} />
      <div style={stepTitleStyle}>Estimation</div>
      <div style={stepSubStyle}>
        {r.isLocation ? 'Estimation locative basée sur le marché actuel' : 'Résultat basé sur le marché actuel'}
      </div>

      {/* Avertissement uniquement si ville non reconnue */}
      {!r.villeFound && (
        <div style={{
          background: 'rgba(200,169,110,0.08)',
          border: '1px solid rgba(200,169,110,0.25)',
          borderRadius: '8px', padding: '12px 16px',
          fontSize: '13px', color: 'rgba(200,169,110,0.8)',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          marginBottom: '20px', lineHeight: 1.5,
        }}>
          ⚠️ Ville non reconnue — estimation basée sur les moyennes nationales.
        </div>
      )}

      {/* Prix principal */}
      <div style={{
        background: 'rgba(200,169,110,0.07)',
        border: '1px solid rgba(200,169,110,0.3)',
        borderRadius: '12px', padding: '28px',
        textAlign: 'center', marginBottom: '20px',
      }}>
        <div style={{
          fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'rgba(200,169,110,0.65)', marginBottom: '10px',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}>
          {r.isLocation ? 'Loyer mensuel estimé' : 'Valeur estimée'}
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '42px', fontWeight: 600,
          color: '#C8A96E', lineHeight: 1, marginBottom: '8px',
        }}>
          {r.isLocation ? fmtRent(r.priceMid) : fmtMAD(r.priceMid)}
        </div>
        <div style={{
          fontSize: '13px', color: 'rgba(200,169,110,0.5)',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}>
          Fourchette : {r.isLocation
            ? `${fmtRent(r.priceMin)} — ${fmtRent(r.priceMax)}`
            : `${fmtMAD(r.priceMin)} — ${fmtMAD(r.priceMax)}`}
        </div>
      </div>

      {/* Détails */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Prix / m²', val: `${r.pm2Mid.toLocaleString('fr-FR')} MAD/m²` },
          { label: 'Superficie', val: `${form.surface} m²` },
          { label: 'Ville', val: form.ville },
          { label: 'Quartier', val: form.quartier },
          { label: 'Type de bien', val: form.type.charAt(0).toUpperCase() + form.type.slice(1) },
          { label: 'État', val: { neuf: 'Neuf', bon: 'Bon état', moyen: 'À rafraîchir', travaux: 'Gros travaux' }[form.etat] ?? form.etat },
        ].map(({ label, val }) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(200,169,110,0.12)',
            borderRadius: '8px', padding: '14px',
          }}>
            <div style={{
              fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'rgba(200,169,110,0.5)', marginBottom: '4px',
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}>
              {label}
            </div>
            <div style={{
              fontSize: '15px', fontWeight: 500, color: '#F9F5EF',
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}>
              {val}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        fontSize: '12px', color: 'rgba(200,169,110,0.4)',
        textAlign: 'center', lineHeight: 1.6, padding: '0 16px',
        fontFamily: "'DM Sans', system-ui, sans-serif", marginBottom: '0',
      }}>
        Estimation indicative basée sur les prix du marché marocain actuel.
        Pour une évaluation officielle, contactez nos experts LANDMARK ESTATE.
      </div>

      <div style={btnRow}>
        <BtnBack onClick={() => setStep(3)} />
        <BtnNext onClick={() => window.location.href = '/contact'}>
          Contacter un expert
        </BtnNext>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EstimationPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D1F3C 0%, #162D4F 50%, #0D1F3C 100%)',
    }}>
      <section style={{
        padding: '80px 24px 60px', textAlign: 'center',
        borderBottom: '1px solid rgba(200, 169, 110, 0.15)',
      }}>
        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: '13px', fontWeight: 500,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#C8A96E', marginBottom: '16px',
        }}>
          Service Gratuit
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 600,
          color: '#F9F5EF', lineHeight: 1.15, marginBottom: '20px',
        }}>
          Estimation de Votre Bien
        </h1>
        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: '17px', color: 'rgba(226, 201, 138, 0.75)',
          maxWidth: '560px', margin: '0 auto', lineHeight: 1.7,
        }}>
          Recevez une évaluation précise et gratuite de votre bien immobilier
          par nos experts. Résultat sous 24h.
        </p>
      </section>

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px' }}>
        <EstimationForm />
      </section>

      <section style={{ borderTop: '1px solid rgba(200, 169, 110, 0.15)', padding: '60px 24px' }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px', textAlign: 'center',
        }}>
          {[
            { icon: '⚡', label: 'Réponse sous 24h', sub: 'Délai garanti' },
            { icon: '🎯', label: '100% Gratuit', sub: 'Sans engagement' },
            { icon: '🔒', label: 'Confidentiel', sub: 'Données sécurisées' },
            { icon: '📊', label: 'Expertise locale', sub: 'Marché casablancais' },
          ].map(({ icon, label, sub }) => (
            <div key={label}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '18px', fontWeight: 600, color: '#F9F5EF', marginBottom: '4px',
              }}>{label}</p>
              <p style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: '13px', color: 'rgba(200, 169, 110, 0.7)',
              }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}