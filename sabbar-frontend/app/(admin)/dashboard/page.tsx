'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import {
  Building2, Users, MessageSquare, TrendingUp,
  ArrowRight, Plus, Bot, Star, Target, Zap,
  CheckCircle2, Clock, Phone, ChevronUp, Trophy
} from 'lucide-react';

const T = {
  navy:      '#0D1F3C',
  navyMid:   '#122440',
  gold:      '#C8A96E',
  goldLight: '#E2C98A',
  terra:     '#B5573A',
  ivory:     '#F9F5EF',
  muted:     'rgba(13,31,60,0.45)',
  border:    'rgba(200,169,110,0.18)',
  borderSoft:'rgba(13,31,60,0.07)',
};

const stats = [
  { label: 'Annonces actives', value: '12',  sub: '+2 ce mois',          icon: Building2,     href: '/dashboard/properties',   accent: T.gold,    trend: '+17%' },
  { label: 'Leads qualifiés',  value: '28',  sub: '+5 cette semaine',    icon: Users,          href: '/dashboard/leads',         accent: '#16a34a', trend: '+22%' },
  { label: 'Conversations',    value: '45',  sub: '+12 aujourd\'hui',    icon: MessageSquare,  href: '/dashboard/conversations', accent: '#7c3aed', trend: '+36%' },
  { label: 'Taux conversion',  value: '87%', sub: '+3% vs mois dernier', icon: TrendingUp,     href: '/dashboard/leads',         accent: T.terra,   trend: '+3pt' },
];

const recentLeads = [
  { name: 'Karim Alaoui',     type: 'Appartement · Casablanca', score: 92, time: 'Il y a 5 min',  hot: true  },
  { name: 'Sara Benali',      type: 'Villa · Marrakech',        score: 78, time: 'Il y a 18 min', hot: false },
  { name: 'Youssef El Fassi', type: 'Bureau · Rabat',           score: 65, time: 'Il y a 1h',     hot: false },
  { name: 'Nadia Tazi',       type: 'Riad · Fès',               score: 88, time: 'Il y a 2h',     hot: true  },
];

const todayTasks = [
  { label: 'Rappeler Karim Alaoui',      done: true,  urgent: false },
  { label: 'Visite villa Marrakech 14h', done: false, urgent: true  },
  { label: 'Envoyer offre Youssef',      done: false, urgent: false },
  { label: 'Mise à jour annonce Anfa',   done: false, urgent: false },
];

function ScoreBadge({ value }: { value: number }) {
  const color = value >= 80 ? '#16a34a' : value >= 60 ? '#d97706' : '#dc2626';
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'4px 10px', borderRadius:'999px', fontSize:'12px', fontWeight:700, fontFamily:"'DM Sans',sans-serif", backgroundColor:`${color}12`, color, border:`1px solid ${color}25` }}>
      <Star size={9} style={{ fill:color, color }} /> {value}
    </span>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.full_name?.split(' ')[0] || 'Agent';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const doneTasks = todayTasks.filter(t => t.done).length;
  const totalTasks = todayTasks.length;
  const taskPct = Math.round((doneTasks / totalTasks) * 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@400;500;600&display=swap');
        .lm-stat  { transition:all 0.25s ease; text-decoration:none; display:block; }
        .lm-stat:hover  { transform:translateY(-4px); box-shadow:0 20px 48px rgba(13,31,60,0.1)!important; border-color:rgba(200,169,110,0.4)!important; }
        .lm-lead:hover  { background:rgba(200,169,110,0.04)!important; }
        .lm-task:hover  { background:rgba(200,169,110,0.06)!important; }
        .lm-newbtn:hover{ transform:translateY(-2px); box-shadow:0 16px 36px rgba(200,169,110,0.35)!important; }
        .lm-conv:hover  { background:rgba(200,169,110,0.1)!important; color:#C8A96E!important; }
        .lm-seeall:hover{ color:#C8A96E!important; }
        .lm-hotdot { animation:pulsedot 1.5s infinite; }
        .lm-activedot { animation:pulsedot 2s infinite; }
        @keyframes pulsedot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .a1{animation:slideUp .4s .05s both} .a2{animation:slideUp .4s .12s both}
        .a3{animation:slideUp .4s .18s both} .a4{animation:slideUp .4s .24s both}
        .a5{animation:slideUp .4s .30s both} .a6{animation:slideUp .4s .36s both}
      `}</style>

      <div style={{ minHeight:'100%', background:T.ivory, fontFamily:"'DM Sans',system-ui,sans-serif" }}>

        {/* ══ HERO BANNER ══ */}
        <div style={{ background:`linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 60%, #091629 100%)`, padding:'36px 40px 44px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-100px', right:'-100px', width:'360px', height:'360px', borderRadius:'50%', background:'radial-gradient(circle, rgba(200,169,110,0.1) 0%, transparent 65%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-60px', left:'25%', width:'240px', height:'240px', borderRadius:'50%', background:'radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 65%)', pointerEvents:'none' }} />

          <div style={{ maxWidth:'1200px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative', zIndex:1, flexWrap:'wrap', gap:'20px' }}>
            <div>
              {/* Date badge */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'5px 14px', borderRadius:'100px', background:'rgba(200,169,110,0.1)', border:'1px solid rgba(200,169,110,0.22)', marginBottom:'16px' }}>
                <span className="lm-activedot" style={{ width:'6px', height:'6px', borderRadius:'50%', background:T.gold, display:'inline-block' }} />
                <span style={{ fontSize:'10px', fontWeight:500, letterSpacing:'0.2em', textTransform:'uppercase', color:T.gold, fontFamily:"'DM Sans',sans-serif" }}>
                  {new Date().toLocaleDateString('fr-FR',{ weekday:'long', day:'numeric', month:'long' })}
                </span>
              </div>
              <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(32px,4vw,46px)', fontWeight:300, color:'#F9F5EF', margin:'0 0 10px', lineHeight:1.1 }}>
                {greeting}, <span style={{ color:T.gold, fontStyle:'italic' }}>{firstName}</span> 👋
              </h1>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'14px', color:'rgba(226,201,138,0.55)', margin:0, lineHeight:1.6 }}>
                Vous avez <strong style={{ color:T.goldLight }}>{totalTasks - doneTasks} tâches</strong> pour aujourd'hui et{' '}
                <strong style={{ color:'#4ade80' }}>{recentLeads.filter(l=>l.hot).length} leads chauds</strong> à contacter
              </p>
            </div>

            {/* Right side hero */}
            <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
              <div style={{ padding:'18px 22px', background:'rgba(200,169,110,0.08)', borderRadius:'14px', border:'1px solid rgba(200,169,110,0.18)', textAlign:'center' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'30px', fontWeight:300, color:T.gold, lineHeight:1 }}>87%</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', color:'rgba(226,201,138,0.45)', marginTop:'5px', letterSpacing:'0.12em', textTransform:'uppercase' }}>Conversion</div>
              </div>
              <Link href="/dashboard/properties/new" className="lm-newbtn"
                style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'14px 26px', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, color:T.navy, fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:600, borderRadius:'12px', textDecoration:'none', transition:'all 0.25s', letterSpacing:'0.03em', boxShadow:'0 4px 20px rgba(200,169,110,0.25)', whiteSpace:'nowrap' }}>
                <Plus size={16} /> Nouvelle annonce
              </Link>
            </div>
          </div>
        </div>

        <div style={{ padding:'32px 40px', maxWidth:'1200px', margin:'0 auto' }}>

          {/* ══ STATS ══ */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px' }}>
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <Link key={s.label} href={s.href} className={`lm-stat a${i+1}`}
                  style={{ background:'#fff', borderRadius:'16px', padding:'24px 22px', border:`1px solid ${T.borderSoft}`, boxShadow:'0 2px 12px rgba(13,31,60,0.04)', position:'relative', overflow:'hidden' }}>
                  {/* barre top */}
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${s.accent},${s.accent}44)` }} />
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'18px' }}>
                    <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:`${s.accent}12`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon size={18} style={{ color:s.accent }} />
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'3px', padding:'3px 8px', borderRadius:'6px', background:'rgba(22,163,74,0.08)', fontSize:'11px', fontWeight:600, color:'#16a34a', fontFamily:"'DM Sans',sans-serif" }}>
                      <ChevronUp size={11} />{s.trend}
                    </div>
                  </div>
                  <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'40px', fontWeight:300, color:T.navy, lineHeight:1, marginBottom:'4px' }}>{s.value}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:500, color:T.navy, marginBottom:'6px' }}>{s.label}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:'#16a34a', fontWeight:500 }}>{s.sub}</div>
                </Link>
              );
            })}
          </div>

          {/* ══ MAIN GRID ══ */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 320px', gap:'20px', marginBottom:'24px' }}>

            {/* Leads */}
            <div className="a5" style={{ background:'#fff', borderRadius:'16px', border:`1px solid ${T.borderSoft}`, overflow:'hidden', boxShadow:'0 2px 12px rgba(13,31,60,0.04)' }}>
              <div style={{ padding:'18px 22px', borderBottom:`1px solid ${T.borderSoft}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <Users size={15} style={{ color:T.gold }} />
                  <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'18px', fontWeight:400, color:T.navy }}>Derniers leads</span>
                </div>
                <Link href="/dashboard/leads" className="lm-seeall" style={{ fontSize:'11px', fontFamily:"'DM Sans',sans-serif", fontWeight:500, color:T.muted, textDecoration:'none', display:'flex', alignItems:'center', gap:'4px', transition:'color 0.2s' }}>
                  Voir tout <ArrowRight size={12} />
                </Link>
              </div>

              {recentLeads.map((lead, i) => (
                <div key={lead.name} className="lm-lead" style={{ padding:'13px 22px', display:'flex', alignItems:'center', gap:'13px', borderBottom: i < recentLeads.length-1 ? `1px solid ${T.borderSoft}` : 'none', cursor:'pointer', transition:'background 0.15s' }}>
                  <div style={{ position:'relative', flexShrink:0 }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:`linear-gradient(135deg,${T.navy},#1e3a5f)`, display:'flex', alignItems:'center', justifyContent:'center', color:T.goldLight, fontSize:'14px', fontFamily:"'Cormorant Garamond',serif" }}>
                      {lead.name.charAt(0)}
                    </div>
                    {lead.hot && <span className="lm-hotdot" style={{ position:'absolute', top:'-1px', right:'-1px', width:'9px', height:'9px', borderRadius:'50%', background:'#dc2626', border:'2px solid #fff' }} />}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:500, color:T.navy }}>{lead.name}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:T.muted }}>{lead.type}</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'3px' }}>
                    <ScoreBadge value={lead.score} />
                    <span style={{ fontSize:'10px', color:T.muted, fontFamily:"'DM Sans',sans-serif" }}>{lead.time}</span>
                  </div>
                </div>
              ))}

              <div style={{ padding:'12px 22px', background:'rgba(200,169,110,0.04)', borderTop:`1px solid ${T.borderSoft}` }}>
                <Link href="/dashboard/leads" style={{ display:'flex', alignItems:'center', gap:'7px', fontSize:'12px', fontFamily:"'DM Sans',sans-serif", fontWeight:500, color:T.gold, textDecoration:'none' }}>
                  <Phone size={12} /> Contacter les leads chauds maintenant
                </Link>
              </div>
            </div>

            {/* Tâches du jour */}
            <div className="a5" style={{ animationDelay:'.08s', background:'#fff', borderRadius:'16px', border:`1px solid ${T.borderSoft}`, overflow:'hidden', boxShadow:'0 2px 12px rgba(13,31,60,0.04)' }}>
              <div style={{ padding:'18px 22px', borderBottom:`1px solid ${T.borderSoft}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <Target size={15} style={{ color:T.terra }} />
                  <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'18px', fontWeight:400, color:T.navy }}>Tâches du jour</span>
                </div>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', fontWeight:600, color:T.terra, padding:'2px 8px', borderRadius:'6px', background:`${T.terra}10` }}>
                  {totalTasks - doneTasks} restantes
                </span>
              </div>

              {todayTasks.map((task, i) => (
                <div key={task.label} className="lm-task" style={{ padding:'13px 22px', display:'flex', alignItems:'center', gap:'12px', borderBottom: i < todayTasks.length-1 ? `1px solid ${T.borderSoft}` : 'none', cursor:'pointer', transition:'background 0.15s', opacity: task.done ? 0.45 : 1 }}>
                  <CheckCircle2 size={17} style={{ color: task.done ? '#16a34a' : `${T.borderSoft}`, flexShrink:0, fill: task.done ? '#16a34a' : 'none' }} />
                  <span style={{ flex:1, fontFamily:"'DM Sans',sans-serif", fontSize:'13px', color:T.navy, textDecoration: task.done ? 'line-through' : 'none', fontWeight: task.urgent ? 600 : 400 }}>
                    {task.label}
                  </span>
                  {task.urgent && !task.done && (
                    <span style={{ fontSize:'10px', fontFamily:"'DM Sans',sans-serif", fontWeight:600, color:T.terra, padding:'2px 8px', borderRadius:'6px', background:`${T.terra}10`, border:`1px solid ${T.terra}22`, whiteSpace:'nowrap' }}>Urgent</span>
                  )}
                  {!task.urgent && !task.done && <Clock size={12} style={{ color:T.muted, flexShrink:0 }} />}
                </div>
              ))}

              <div style={{ padding:'14px 22px', borderTop:`1px solid ${T.borderSoft}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'7px' }}>
                  <span style={{ fontSize:'11px', fontFamily:"'DM Sans',sans-serif", color:T.muted }}>Progression journée</span>
                  <span style={{ fontSize:'11px', fontFamily:"'DM Sans',sans-serif", fontWeight:600, color:T.navy }}>{taskPct}%</span>
                </div>
                <div style={{ height:'6px', borderRadius:'3px', background:T.borderSoft, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${taskPct}%`, background:`linear-gradient(90deg,${T.gold},${T.goldLight})`, borderRadius:'3px', transition:'width 1s ease' }} />
                </div>
              </div>
            </div>

            {/* Agent IA */}
            <div className="a6" style={{ background:T.navy, borderRadius:'16px', padding:'24px', display:'flex', flexDirection:'column', boxShadow:'0 8px 32px rgba(13,31,60,0.2)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(circle, rgba(200,169,110,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ width:'42px', height:'42px', borderRadius:'12px', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Bot size={20} style={{ color:T.navy }} />
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'17px', fontWeight:400, color:'#F9F5EF' }}>Agent IA</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', color:'rgba(226,201,138,0.4)', marginTop:'1px' }}>Qualification auto</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'5px', padding:'4px 10px', borderRadius:'100px', background:'rgba(22,163,74,0.12)', border:'1px solid rgba(22,163,74,0.2)' }}>
                  <span className="lm-activedot" style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#4ade80', display:'inline-block' }} />
                  <span style={{ fontSize:'10px', fontWeight:500, color:'#4ade80', fontFamily:"'DM Sans',sans-serif" }}>Actif</span>
                </div>
              </div>

              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'12px', color:'rgba(226,201,138,0.4)', lineHeight:1.7, margin:'0 0 18px' }}>
                Qualifie vos prospects 24h/24 et extrait automatiquement leurs critères de recherche.
              </p>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'14px' }}>
                {[{ val:'87%', label:'Précision', icon:'🎯' }, { val:'45', label:'Ce mois', icon:'📈' }].map(s => (
                  <div key={s.label} style={{ background:'rgba(200,169,110,0.07)', border:'1px solid rgba(200,169,110,0.12)', borderRadius:'10px', padding:'14px', textAlign:'center' }}>
                    <div style={{ fontSize:'14px', marginBottom:'4px' }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'26px', fontWeight:300, color:T.gold, lineHeight:1 }}>{s.val}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', color:'rgba(226,201,138,0.35)', marginTop:'4px' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ background:'rgba(200,169,110,0.06)', borderRadius:'10px', padding:'11px 13px', marginBottom:'14px', border:'1px solid rgba(200,169,110,0.1)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'5px', marginBottom:'5px' }}>
                  <Zap size={11} style={{ color:T.gold }} />
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'10px', fontWeight:500, color:T.gold }}>Dernière action</span>
                </div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'11px', color:'rgba(226,201,138,0.4)', margin:0, lineHeight:1.5 }}>
                  Lead Karim qualifié — score 92 · Appart. 3ch Casablanca
                </p>
              </div>

              <Link href="/dashboard/conversations" className="lm-conv"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', padding:'12px', borderRadius:'10px', border:'1px solid rgba(200,169,110,0.18)', color:'rgba(226,201,138,0.45)', fontFamily:"'DM Sans',sans-serif", fontSize:'12px', fontWeight:500, textDecoration:'none', transition:'all 0.2s', marginTop:'auto' }}>
                Voir les conversations <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* ══ BARRE OBJECTIF MENSUEL ══ */}
          <div style={{ padding:'20px 28px', background:`linear-gradient(135deg,${T.navy} 0%,#1a3558 100%)`, borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 4px 24px rgba(13,31,60,0.15)', flexWrap:'wrap', gap:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'rgba(200,169,110,0.12)', border:'1px solid rgba(200,169,110,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Trophy size={20} style={{ color:T.gold }} />
              </div>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'17px', fontWeight:400, color:'#F9F5EF' }}>
                  Objectif mensuel : <span style={{ color:T.gold, fontStyle:'italic' }}>5 transactions</span>
                </div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'12px', color:'rgba(226,201,138,0.4)', marginTop:'3px' }}>
                  3 conclues · 2 en cours · Vous êtes sur la bonne voie 💪
                </div>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
              <div style={{ width:'160px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'7px' }}>
                  <span style={{ fontSize:'10px', color:'rgba(226,201,138,0.4)', fontFamily:"'DM Sans',sans-serif", letterSpacing:'0.06em' }}>PROGRESSION</span>
                  <span style={{ fontSize:'11px', color:T.gold, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>60%</span>
                </div>
                <div style={{ height:'6px', borderRadius:'3px', background:'rgba(200,169,110,0.12)', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:'60%', background:`linear-gradient(90deg,${T.gold},${T.goldLight})`, borderRadius:'3px' }} />
                </div>
                {/* Jalons */}
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:'5px' }}>
                  {[1,2,3,4,5].map(n => (
                    <div key={n} style={{ width:'10px', height:'10px', borderRadius:'50%', background: n <= 3 ? T.gold : 'rgba(200,169,110,0.2)', border: n <= 3 ? 'none' : '1px solid rgba(200,169,110,0.3)' }} />
                  ))}
                </div>
              </div>
              <Link href="/dashboard/properties/new"
                style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'10px 18px', background:'rgba(200,169,110,0.15)', border:'1px solid rgba(200,169,110,0.25)', borderRadius:'10px', color:T.gold, fontSize:'12px', fontFamily:"'DM Sans',sans-serif", fontWeight:500, textDecoration:'none', whiteSpace:'nowrap', transition:'background 0.2s' }}>
                <Plus size={13} /> Ajouter une vente
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}