'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { User, Building2, Lock, Bell, Shield, CheckCircle2, ChevronRight } from 'lucide-react';

const T = {
  navy:      '#0D1F3C',
  gold:      '#C8A96E',
  goldLight: '#E2C98A',
  terra:     '#B5573A',
  ivory:     '#F9F5EF',
  muted:     'rgba(13,31,60,0.45)',
  border:    'rgba(200,169,110,0.18)',
  borderSoft:'rgba(13,31,60,0.08)',
};

function LMInput({ type = 'text', placeholder, defaultValue, disabled }: any) {
  const [f, setF] = useState(false);
  return (
    <input type={type} placeholder={placeholder} defaultValue={defaultValue} disabled={disabled}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ width: '100%', padding: '11px 14px', background: disabled ? 'rgba(13,31,60,0.03)' : T.ivory, border: `1px solid ${f ? T.gold : T.borderSoft}`, borderRadius: '10px', fontSize: '13px', color: disabled ? T.muted : T.navy, outline: 'none', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', boxSizing: 'border-box' as const, boxShadow: f ? '0 0 0 3px rgba(200,169,110,0.08)' : 'none', cursor: disabled ? 'not-allowed' : 'text' }} />
  );
}

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 24px', background: saved ? 'rgba(22,163,74,0.1)' : `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: saved ? '#16a34a' : T.navy, fontSize: '13px', fontWeight: 600, borderRadius: '10px', border: saved ? '1px solid rgba(22,163,74,0.3)' : 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.3s', letterSpacing: '0.02em', boxShadow: saved ? 'none' : '0 4px 14px rgba(200,169,110,0.25)' }}>
      {saved ? <><CheckCircle2 size={14} /> Enregistré</> : 'Enregistrer'}
    </button>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${T.borderSoft}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(13,31,60,0.04)' }}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.borderSoft}`, background: '#faf8f5', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(200,169,110,0.12)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.gold }}>
          {icon}
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '19px', fontWeight: 400, color: T.navy, margin: 0 }}>{title}</h2>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.muted, marginBottom: '7px', fontFamily: "'DM Sans', sans-serif" }}>
        {label}{required && <span style={{ color: T.terra, marginLeft: '3px' }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize: '11px', color: T.muted, marginTop: '5px', fontFamily: "'DM Sans', sans-serif" }}>{hint}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [savedProfile, setSavedProfile]  = useState(false);
  const [savedAgency, setSavedAgency]    = useState(false);
  const [savedPassword, setSavedPassword] = useState(false);
  const [notif, setNotif]               = useState({ leads: true, messages: true, stats: false });

  const save = (type: 'profile' | 'agency' | 'password') => {
    if (type === 'profile')  { setSavedProfile(true);  setTimeout(() => setSavedProfile(false),  2500); }
    if (type === 'agency')   { setSavedAgency(true);   setTimeout(() => setSavedAgency(false),   2500); }
    if (type === 'password') { setSavedPassword(true); setTimeout(() => setSavedPassword(false), 2500); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@400;500;600&display=swap');
        ::placeholder { color: rgba(13,31,60,0.3) !important; }
        .lm-toggle { transition: all 0.25s ease; }
        .lm-notif-row:hover { background: rgba(200,169,110,0.04) !important; }
        .lm-link:hover { color: #C8A96E !important; }
      `}</style>

      <div style={{ minHeight: '100%', background: T.ivory, padding: '32px 40px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(200,169,110,0.1)', border: `1px solid ${T.border}`, marginBottom: '12px' }}>
              <Shield size={10} style={{ color: T.gold }} />
              <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.gold }}>Compte & préférences</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '36px', fontWeight: 300, color: T.navy, margin: '0 0 6px', lineHeight: 1.1 }}>
              Paramètres <span style={{ color: T.gold, fontStyle: 'italic' }}>du compte</span>
            </h1>
            <p style={{ fontSize: '13px', color: T.muted, margin: 0 }}>Gérez vos informations personnelles et préférences</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* ── Profil ── */}
            <Card title="Profil personnel" icon={<User size={16} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(200,169,110,0.05)', borderRadius: '12px', border: `1px solid ${T.border}` }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `linear-gradient(135deg, ${T.navy}, #1e3a5f)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `2px solid ${T.gold}` }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, color: T.goldLight }}>
                      {user?.full_name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: 400, color: T.navy }}>{user?.full_name || 'Agent'}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: T.muted }}>{user?.email || 'agent@landmark.ma'}</div>
                  </div>
                  <button style={{ marginLeft: 'auto', padding: '7px 14px', background: 'transparent', border: `1px solid ${T.border}`, borderRadius: '8px', fontSize: '12px', color: T.gold, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                    Changer photo
                  </button>
                </div>

                <Field label="Nom complet" required>
                  <LMInput placeholder="Votre nom complet" defaultValue={user?.full_name} />
                </Field>
                <Field label="Email" hint="L'email ne peut pas être modifié">
                  <LMInput type="email" placeholder="email@exemple.com" defaultValue={user?.email} disabled />
                </Field>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SaveButton onClick={() => save('profile')} saved={savedProfile} />
                </div>
              </div>
            </Card>

            {/* ── Agence ── */}
            <Card title="Informations de l'agence" icon={<Building2 size={16} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Field label="Nom de l'agence">
                  <LMInput placeholder="Ex: LANDMARK ESTATE" defaultValue={user?.agency_name} />
                </Field>
                <Field label="Téléphone">
                  <LMInput type="tel" placeholder="Ex: +212 6 00 00 00 00" defaultValue={user?.phone_number} />
                </Field>
                <Field label="Ville">
                  <LMInput placeholder="Ex: Casablanca" />
                </Field>
                <Field label="Site web">
                  <LMInput type="url" placeholder="Ex: https://landmark-estate.ma" />
                </Field>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SaveButton onClick={() => save('agency')} saved={savedAgency} />
                </div>
              </div>
            </Card>

            {/* ── Mot de passe ── */}
            <Card title="Sécurité & mot de passe" icon={<Lock size={16} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Field label="Mot de passe actuel" required>
                  <LMInput type="password" placeholder="••••••••" />
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Field label="Nouveau mot de passe">
                    <LMInput type="password" placeholder="••••••••" />
                  </Field>
                  <Field label="Confirmer">
                    <LMInput type="password" placeholder="••••••••" />
                  </Field>
                </div>
                {/* Règles */}
                <div style={{ padding: '12px 14px', background: 'rgba(200,169,110,0.05)', borderRadius: '10px', border: `1px solid ${T.border}` }}>
                  {['8 caractères minimum', 'Une majuscule', 'Un chiffre'].map(r => (
                    <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: T.gold, display: 'inline-block', opacity: 0.6 }} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: T.muted }}>{r}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SaveButton onClick={() => save('password')} saved={savedPassword} />
                </div>
              </div>
            </Card>

            {/* ── Notifications ── */}
            <Card title="Notifications" icon={<Bell size={16} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { key: 'leads',    label: 'Nouveaux leads',          sub: 'Être notifié à chaque nouveau prospect qualifié' },
                  { key: 'messages', label: 'Messages conversations',  sub: 'Notifications des conversations Agent IA' },
                  { key: 'stats',    label: 'Rapport hebdomadaire',    sub: 'Résumé de vos performances chaque lundi' },
                ].map((item, i, arr) => (
                  <div key={item.key} className="lm-notif-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.borderSoft}` : 'none', transition: 'background 0.15s' }}>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: T.navy, marginBottom: '2px' }}>{item.label}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: T.muted }}>{item.sub}</div>
                    </div>
                    {/* Toggle */}
                    <button onClick={() => setNotif(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                      className="lm-toggle"
                      style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: notif[item.key as keyof typeof notif] ? T.gold : 'rgba(13,31,60,0.12)', padding: '0', position: 'relative', flexShrink: 0 }}>
                      <span style={{ position: 'absolute', top: '3px', left: notif[item.key as keyof typeof notif] ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: 'left 0.25s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* ── Zone danger ── */}
            <div style={{ padding: '20px 24px', borderRadius: '14px', border: `1px solid rgba(181,87,58,0.2)`, background: 'rgba(181,87,58,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: T.terra, marginBottom: '3px' }}>Supprimer le compte</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: T.muted }}>Cette action est irréversible. Toutes vos données seront effacées.</div>
                </div>
                <button style={{ padding: '9px 18px', background: 'transparent', border: `1px solid rgba(181,87,58,0.4)`, borderRadius: '9px', color: T.terra, fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>
                  Supprimer
                </button>
              </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'rgba(200,169,110,0.35)' }}>
                LANDMARK ESTATE · v2.0 · © {new Date().getFullYear()}
              </span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}