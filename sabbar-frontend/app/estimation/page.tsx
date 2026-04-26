'use client';

import { useState, useCallback } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

const PRIX: Record<string, Record<string, { min: number; max: number }>> = {
  casablanca: {
    'Anfa': { min: 18000, max: 28000 }, 'Maarif': { min: 14000, max: 20000 },
    'Gauthier': { min: 15000, max: 22000 }, 'Ain Diab': { min: 20000, max: 35000 },
    'Bourgogne': { min: 13000, max: 19000 }, 'Sidi Maarouf': { min: 10000, max: 15000 },
    'Bouskoura': { min: 8000, max: 13000 }, 'Hay Hassani': { min: 8000, max: 12000 },
    'Californie': { min: 16000, max: 24000 }, 'Val Fleuri': { min: 12000, max: 17000 },
    'Oulfa': { min: 7000, max: 11000 }, 'Bernoussi': { min: 7000, max: 10000 },
  },
  rabat: {
    'Agdal': { min: 14000, max: 22000 }, 'Hassan': { min: 12000, max: 18000 },
    'Souissi': { min: 16000, max: 25000 }, 'Les Orangers': { min: 11000, max: 16000 },
    'Hay Riad': { min: 13000, max: 19000 }, 'Youssoufia': { min: 8000, max: 12000 },
    'Akkari': { min: 7000, max: 11000 },
  },
  marrakech: {
    'Guéliz': { min: 13000, max: 20000 }, 'Hivernage': { min: 16000, max: 25000 },
    'Palmeraie': { min: 18000, max: 35000 }, 'Mellah': { min: 9000, max: 15000 },
    'Agdal Marrakech': { min: 11000, max: 17000 }, 'Targa': { min: 8000, max: 13000 },
  },
  tanger: {
    'Malabata': { min: 12000, max: 20000 }, 'Marchane': { min: 10000, max: 16000 },
    'Iberia': { min: 11000, max: 17000 }, 'Val Fleuri Tanger': { min: 9000, max: 14000 },
    'Boukhalef': { min: 7000, max: 11000 }, 'Moghogha': { min: 6000, max: 10000 },
  },
  agadir: {
    'Founty': { min: 12000, max: 18000 }, 'Hay Mohammadi': { min: 7000, max: 11000 },
    'Talborjt': { min: 8000, max: 13000 }, 'Cité Suisse': { min: 11000, max: 16000 },
    'Anza': { min: 6000, max: 10000 },
  },
  fes: {
    'Saiss': { min: 8000, max: 14000 }, "Route d'Imouzzer": { min: 10000, max: 16000 },
    'Montfleuri': { min: 9000, max: 14000 }, 'Atlas': { min: 7000, max: 12000 },
    'Les Mérinides': { min: 8000, max: 13000 },
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
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtMAD(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace('.', ',') + ' M MAD';
  return Math.round(n / 1000) * 1000 + ' MAD';
}

function fmtRent(n: number): string {
  return n.toLocaleString('fr-FR') + ' MAD/mois';
}

function calculate(form: FormState): EstimationResult {
  // Recherche flexible ville et quartier
  const villeKey = Object.keys(PRIX).find((k) =>
    form.ville.toLowerCase().includes(k) || k.includes(form.ville.toLowerCase())
  ) ?? '';

  const quartierData = PRIX[villeKey] ?? {};
  const quartierKey = Object.keys(quartierData).find((q) =>
    q.toLowerCase() === form.quartier.toLowerCase()
  ) ?? '';

  const prixRef = quartierData[quartierKey]
    ?? (Object.values(quartierData)[0])
    ?? { min: 8000, max: 14000 };

  let cMin = 1, cMax = 1;

  if (form.type === 'villa')   { cMin *= 1.20; cMax *= 1.20; }
  if (form.type === 'riad')    { cMin *= 1.15; cMax *= 1.30; }
  if (form.type === 'bureau')  { cMin *= 0.85; cMax *= 0.85; }
  if (form.type === 'terrain') { cMin *= 0.40; cMax *= 0.50; }

  if (form.etat === 'neuf')    { cMin *= 1.15; cMax *= 1.20; }
  if (form.etat === 'moyen')   { cMin *= 0.88; cMax *= 0.88; }
  if (form.etat === 'travaux') { cMin *= 0.72; cMax *= 0.72; }

  if (form.etage === 'rdc')     { cMin *= 0.93; cMax *= 0.93; }
  if (form.etage === 'dernier') { cMin *= 1.05; cMax *= 1.05; }

  const bonus = 1 + form.equip.length * 0.025;
  cMin *= bonus; cMax *= bonus;

  const pm2Min = Math.round(prixRef.min * cMin);
  const pm2Max = Math.round(prixRef.max * cMax);
  const pm2Mid = Math.round((pm2Min + pm2Max) / 2);
  const isLocation = form.regime === 'location';

  if (isLocation) {
    const rentMin = Math.round(form.surface * pm2Min * 0.005);
    const rentMax = Math.round(form.surface * pm2Max * 0.005);
    return { priceMid: Math.round((rentMin + rentMax) / 2), priceMin: rentMin, priceMax: rentMax, pm2Mid, isLocation };
  }

  const priceMin = Math.round((form.surface * pm2Min) / 10000) * 10000;
  const priceMax = Math.round((form.surface * pm2Max) / 10000) * 10000;
  return { priceMid: Math.round((priceMin + priceMax) / 10000) * 10000, priceMin, priceMax, pm2Mid, isLocation };
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
      {options.map(({ val, label }) => (
        <button
          key={val}
          type="button"
          onClick={() => handleClick(val)}
          style={{
            padding: '10px 14px',
            background: isSelected(val) ? 'rgba(200,169,110,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isSelected(val) ? '#C8A96E' : 'rgba(200,169,110,0.2)'}`,
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: isSelected(val) ? '#C8A96E' : 'rgba(249,245,239,0.7)',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s',
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
      textTransform: 'uppercase', color: 'rgba(200,169,110,0.7)', marginBottom: '8px',
    }}>
      {children}
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <div style={{ fontSize: '12px', color: '#e87070', marginTop: '6px' }}>{msg}</div>;
}

function SelectInput({ value, onChange, children }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...inputStyle, WebkitAppearance: 'none', cursor: 'pointer' }}
    >
      {children}
    </select>
  );
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

  const fieldStyle: React.CSSProperties = { marginBottom: '22px' };
  const btnRow: React.CSSProperties = { display: 'flex', gap: '12px', marginTop: '32px' };
  const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };

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

      {/* ✅ VILLE — input texte libre */}
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

      {/* ✅ QUARTIER — input texte libre */}
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

      {/* ✅ SURFACE — input number libre */}
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

      <div style={{ ...grid2, marginBottom: '22px' }}>
        <div>
          <Label>Chambres</Label>
          <SelectInput value={form.chambres} onChange={(v) => set('chambres', v)}>
            <option value="0">Studio</option>
            <option value="1">1 chambre</option>
            <option value="2">2 chambres</option>
            <option value="3">3 chambres</option>
            <option value="4">4 chambres</option>
            <option value="5">5+ chambres</option>
          </SelectInput>
        </div>
        <div>
          <Label>Étage</Label>
          <SelectInput value={form.etage} onChange={(v) => set('etage', v)}>
            <option value="rdc">Rez-de-chaussée</option>
            <option value="1">1er étage</option>
            <option value="2">2e étage</option>
            <option value="3">3e étage</option>
            <option value="4">4e+ étage</option>
            <option value="dernier">Dernier étage</option>
          </SelectInput>
        </div>
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

      <div style={{
        background: 'rgba(200,169,110,0.07)',
        border: '1px solid rgba(200,169,110,0.3)',
        borderRadius: '12px', padding: '28px',
        textAlign: 'center', marginBottom: '24px',
      }}>
        <div style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(200,169,110,0.65)', marginBottom: '10px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          {r.isLocation ? 'Loyer mensuel estimé' : 'Valeur estimée'}
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '42px', fontWeight: 600,
          color: '#C8A96E', lineHeight: 1, marginBottom: '8px',
        }}>
          {r.isLocation ? fmtRent(r.priceMid) : fmtMAD(r.priceMid)}
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(200,169,110,0.5)', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          {r.isLocation
            ? `${fmtRent(r.priceMin)} — ${fmtRent(r.priceMax)}`
            : `${fmtMAD(r.priceMin)} — ${fmtMAD(r.priceMax)}`}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Prix / m²', val: `${r.pm2Mid.toLocaleString('fr-FR')} MAD/m²` },
          { label: 'Superficie', val: `${form.surface} m²` },
          { label: 'Quartier', val: form.quartier },
          { label: 'Type de bien', val: form.type.charAt(0).toUpperCase() + form.type.slice(1) },
        ].map(({ label, val }) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(200,169,110,0.12)',
            borderRadius: '8px', padding: '14px',
          }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(200,169,110,0.5)', marginBottom: '4px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              {label}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#F9F5EF', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
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
        Cette estimation est indicative et basée sur les prix du marché marocain.
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