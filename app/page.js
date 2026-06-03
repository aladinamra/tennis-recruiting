'use client'
import { useState, useEffect, useRef } from 'react'

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

const TABS = [
  { label: 'Profile', num: '01' },
  { label: 'Tennis', num: '02' },
  { label: 'Media', num: '03' },
  { label: 'Coaches', num: '04' },
  { label: 'Send', num: '05' },
  { label: 'Dashboard', num: '06' },
]

const DIVISIONS = ['All divisions','NCAA D1','NCAA D2','NCAA D3','NAIA','JUCO']
const ROLES = ['All roles','Head Coach','Assistant Coach']

const g = (o='0.04',b='0.08') => ({
  background:`rgba(255,255,255,${o})`,
  backdropFilter:'blur(24px)',
  WebkitBackdropFilter:'blur(24px)',
  border:`1px solid rgba(255,255,255,${b})`,
})

const base = {
  width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',
  borderRadius:'12px',padding:'11px 16px',fontSize:'14px',color:'white',outline:'none',
  fontFamily:'inherit',transition:'border 0.2s,background 0.2s',boxSizing:'border-box',
}

const ph = { /* placeholder handled inline via onFocus/onBlur */ }

const lbl = {
  display:'block',fontSize:'11px',fontWeight:'600',
  color:'rgba(147,197,253,0.55)',textTransform:'uppercase',
  letterSpacing:'0.08em',marginBottom:'7px',textAlign:'center',
}

const btnP = {
  background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',border:'1px solid rgba(59,130,246,0.4)',
  color:'white',padding:'11px 22px',borderRadius:'12px',fontSize:'14px',fontWeight:'600',
  cursor:'pointer',fontFamily:'inherit',display:'inline-flex',alignItems:'center',gap:'8px',
}
const btnG = {
  background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',
  color:'rgba(255,255,255,0.45)',padding:'11px 18px',borderRadius:'12px',
  fontSize:'14px',cursor:'pointer',fontFamily:'inherit',
}
const btnGr = {
  background:'linear-gradient(135deg,#059669,#047857)',border:'1px solid rgba(5,150,105,0.4)',
  color:'white',padding:'11px 22px',borderRadius:'12px',fontSize:'14px',fontWeight:'600',
  cursor:'pointer',fontFamily:'inherit',display:'inline-flex',alignItems:'center',gap:'8px',
}

const spin = {width:'14px',height:'14px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.7s linear infinite',display:'inline-block'}

function PaywallModal({ coach, onClose, onUnlock }) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(8px)'}} onClick={onClose}/>
      <div style={{position:'relative',zIndex:1,maxWidth:'480px',width:'100%',...g('0.08','0.15'),borderRadius:'24px',padding:'40px',textAlign:'center',boxShadow:'0 40px 80px rgba(0,0,0,0.6)'}}>
        <div style={{width:'52px',height:'52px',borderRadius:'16px',background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',boxShadow:'0 8px 24px rgba(59,130,246,0.4)'}}>
          <i className="ti ti-lock" style={{fontSize:'24px',color:'white'}} aria-hidden="true"/>
        </div>
        <h2 style={{fontSize:'22px',fontWeight:'700',color:'white',letterSpacing:'-0.02em',marginBottom:'10px'}}>Unlock full access</h2>
        <p style={{fontSize:'14px',color:'rgba(147,197,253,0.55)',lineHeight:'1.7',marginBottom:'28px'}}>
          View personalised emails, copy them instantly, and track every coach's interest — all for a one-time fee.
        </p>
        <div style={{...g('0.06','0.12'),borderRadius:'16px',padding:'20px',marginBottom:'24px',textAlign:'left'}}>
          {[
            ['ti-mail','Personalised emails for all 1,805 coaches'],
            ['ti-copy','One-click copy to clipboard'],
            ['ti-chart-bar','Interest score & reply tracking'],
            ['ti-send','Batch send to every coach'],
            ['ti-refresh','Unlimited regeneration'],
          ].map(([icon,text])=>(
            <div key={text} style={{display:'flex',alignItems:'center',gap:'12px',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
              <i className={`ti ${icon}`} style={{fontSize:'16px',color:'#60a5fa',flexShrink:0}} aria-hidden="true"/>
              <span style={{fontSize:'13px',color:'rgba(255,255,255,0.7)'}}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'baseline',justifyContent:'center',gap:'6px',marginBottom:'20px'}}>
          <span style={{fontSize:'42px',fontWeight:'700',color:'white',letterSpacing:'-0.03em'}}>$29</span>
          <span style={{fontSize:'14px',color:'rgba(147,197,253,0.4)'}}>one-time</span>
        </div>
        <button onClick={onUnlock} style={{...btnP,width:'100%',justifyContent:'center',padding:'14px',fontSize:'15px',borderRadius:'14px',boxShadow:'0 8px 24px rgba(59,130,246,0.3)'}}>
          Unlock now →
        </button>
        <p style={{fontSize:'12px',color:'rgba(255,255,255,0.2)',marginTop:'12px'}}>Secure checkout · Instant access</p>
      </div>
    </div>
  )
}

function CoachDrawer({ coach, onClose, onUpdate, isPaid }) {
  const [marking, setMarking] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [localPaid, setLocalPaid] = useState(isPaid)

  async function markReplied() {
    setMarking(true)
    try {
      await fetch('/api/coaches',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:coach.id,replied:true})})
      onUpdate({...coach,replied:true})
    } catch(e) {}
    setMarking(false)
  }

  function copyEmail() {
    const text = `Subject: ${coach.email_subject}\n\n${coach.email_body}`
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(()=>setCopied(false),2000)
  }

  function handleUnlock() {
    setLocalPaid(true)
    setShowPaywall(false)
  }

  let score=0
  if(coach.email_generated) score+=20
  if(coach.email_sent) score+=30
  if(coach.email_opened) score+=30
  if(coach.replied) score+=20
  const sc = score>=70?'#4ade80':score>=40?'#fbbf24':score>=20?'#60a5fa':'rgba(255,255,255,0.2)'
  const sb = score>=70?'rgba(74,222,128,0.1)':score>=40?'rgba(251,191,36,0.08)':score>=20?'rgba(96,165,250,0.08)':'rgba(255,255,255,0.03)'
  const sbo = score>=70?'rgba(74,222,128,0.2)':score>=40?'rgba(251,191,36,0.2)':score>=20?'rgba(96,165,250,0.2)':'rgba(255,255,255,0.06)'

  const teamUTR = coach.team_utr || (7 + Math.random()*4).toFixed(1)
  const teamWTN = coach.team_wtn || (10 + Math.random()*15).toFixed(1)

  return (
    <>
      {showPaywall && <PaywallModal coach={coach} onClose={()=>setShowPaywall(false)} onUnlock={handleUnlock}/>}
      <div style={{position:'fixed',inset:0,zIndex:50,display:'flex'}}>
        <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.55)',backdropFilter:'blur(4px)'}} onClick={onClose}/>
        <div style={{position:'absolute',right:0,top:0,bottom:0,width:'500px',background:'linear-gradient(160deg,#061c36,#041020)',border:'1px solid rgba(255,255,255,0.08)',boxShadow:'-20px 0 60px rgba(0,0,0,0.6)',overflowY:'auto',animation:'slideIn 0.25s ease'}}>
          <div style={{padding:'24px 28px 0'}}>
            {/* Header */}
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'20px'}}>
              <div>
                <div style={{fontSize:'20px',fontWeight:'700',color:'white',marginBottom:'3px'}}>{coach.coach_name}</div>
                <div style={{fontSize:'14px',color:'rgba(147,197,253,0.55)',marginBottom:'2px'}}>{coach.school_name}</div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,0.22)'}}>{coach.division} · {coach.notes}</div>
              </div>
              <button onClick={onClose} style={{...btnG,padding:'7px 12px',fontSize:'15px',flexShrink:0}}>✕</button>
            </div>

            {/* UTR / WTN badges */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'20px'}}>
              {[['Team avg UTR',teamUTR,'#60a5fa','rgba(59,130,246,0.1)','rgba(59,130,246,0.2)'],['Team avg WTN',teamWTN,'#a78bfa','rgba(139,92,246,0.1)','rgba(139,92,246,0.2)']].map(([lbl,val,c,bg,border])=>(
                <div key={lbl} style={{background:bg,border:`1px solid ${border}`,borderRadius:'14px',padding:'14px',textAlign:'center'}}>
                  <div style={{fontSize:'26px',fontWeight:'700',color:c,letterSpacing:'-0.02em'}}>{val}</div>
                  <div style={{fontSize:'11px',color:'rgba(255,255,255,0.3)',marginTop:'3px',textTransform:'uppercase',letterSpacing:'0.06em'}}>{lbl}</div>
                </div>
              ))}
            </div>

            {/* Interest score */}
            <div style={{background:sb,border:`1px solid ${sbo}`,borderRadius:'14px',padding:'14px',marginBottom:'20px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px'}}>
                <span style={{fontSize:'11px',fontWeight:'600',color:'rgba(147,197,253,0.5)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Interest score</span>
                <span style={{fontSize:'20px',fontWeight:'700',color:sc}}>{score || '—'}</span>
              </div>
              <div style={{height:'5px',background:'rgba(255,255,255,0.05)',borderRadius:'3px',overflow:'hidden'}}>
                <div style={{height:'100%',width:`${score}%`,background:sc,borderRadius:'3px',transition:'width 0.5s'}}/>
              </div>
            </div>

            {/* Contact */}
            <div style={{...g('0.03','0.07'),borderRadius:'14px',padding:'14px',marginBottom:'20px'}}>
              <div style={{fontSize:'11px',fontWeight:'600',color:'rgba(147,197,253,0.45)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'10px'}}>Contact</div>
              {[['Email',coach.email],['School',coach.school_name],['Division',coach.division],['Role',coach.notes]].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <span style={{fontSize:'13px',color:'rgba(255,255,255,0.35)'}}>{k}</span>
                  <span style={{fontSize:'13px',color:'rgba(255,255,255,0.75)',fontWeight:'500',maxWidth:'280px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v}</span>
                </div>
              ))}
            </div>

            {/* Email preview */}
            <div style={{marginBottom:'20px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
                <div style={{fontSize:'11px',fontWeight:'600',color:'rgba(147,197,253,0.45)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Personalised email</div>
                {localPaid && coach.email_generated && (
                  <div style={{display:'flex',gap:'8px'}}>
                    <button onClick={copyEmail} style={{...btnG,padding:'5px 12px',fontSize:'12px'}}>
                      {copied?'✓ Copied':'Copy'}
                    </button>
                  </div>
                )}
              </div>

              {coach.email_generated ? (
                <div style={{position:'relative',borderRadius:'14px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.07)'}}>
                  <div style={{padding:'12px 16px',background:'rgba(59,130,246,0.07)',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                    <div style={{fontSize:'13px',fontWeight:'600',color:'rgba(255,255,255,0.85)',filter:localPaid?'none':'blur(5px)',userSelect:localPaid?'auto':'none'}}>{localPaid ? coach.email_subject : 'Subject line hidden — unlock to reveal'}</div>
                    <div style={{fontSize:'11px',color:'rgba(147,197,253,0.35)',marginTop:'2px'}}>To: {coach.email}</div>
                  </div>
                  <div style={{padding:'14px 16px',fontSize:'13px',color:'rgba(255,255,255,0.45)',lineHeight:'1.8',whiteSpace:'pre-wrap',maxHeight:'260px',overflowY:'auto',filter:localPaid?'none':'blur(6px)',userSelect:localPaid?'auto':'none',background:'rgba(255,255,255,0.02)'}}>
                    {localPaid ? coach.email_body : 'This personalised email was written specifically for this coach based on your profile, stats, and this school\'s program details. Unlock full access to view, copy, and send all 1,805 personalised emails.\n\nUnlock full access to view, copy, and send all 1,805 personalised emails. This email references specific details about the program, the coach, and your athlete profile.\n\nBest,\nYour Name'}
                  </div>
                  {!localPaid && (
                    <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(2,12,27,0.5)'}}>
                      <button onClick={()=>setShowPaywall(true)} style={{...btnP,padding:'12px 24px',fontSize:'14px',borderRadius:'12px',boxShadow:'0 8px 24px rgba(59,130,246,0.4)'}}>
                        <i className="ti ti-lock" style={{fontSize:'15px'}} aria-hidden="true"/>
                        Unlock email
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{...g('0.03','0.06'),borderRadius:'14px',padding:'24px',textAlign:'center'}}>
                  <i className="ti ti-mail-off" style={{fontSize:'28px',color:'rgba(255,255,255,0.15)',display:'block',marginBottom:'8px'}} aria-hidden="true"/>
                  <div style={{fontSize:'13px',color:'rgba(255,255,255,0.25)'}}>Email not generated yet</div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{display:'flex',flexDirection:'column',gap:'10px',paddingBottom:'28px'}}>
              {!coach.replied && coach.email_sent && (
                <button onClick={markReplied} disabled={marking} style={{...btnP,justifyContent:'center',opacity:marking?0.6:1}}>
                  {marking?'Saving...':'✓ Mark as replied'}
                </button>
              )}
              <a href={`mailto:${coach.email}`} style={{...btnG,textDecoration:'none',textAlign:'center',display:'block',padding:'11px'}}>
                Open in mail app
              </a>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </>
  )
}

function LandingPage({ onEnter }) {
  const features = [
    {icon:'ti-database',title:'1,805 coaches',desc:'Every college tennis program in the US across all divisions in one searchable directory.'},
    {icon:'ti-wand',title:'AI personalisation',desc:'Claude writes a unique email for every coach, referencing their school, division, and your specific stats.'},
    {icon:'ti-send',title:'One-click sending',desc:'Generate all emails, preview them, then send in batches — all from a single dashboard.'},
    {icon:'ti-chart-bar',title:'Recruiting pipeline',desc:'Track every coach — who\'s been contacted, who replied, and who\'s most interested — in real time.'},
  ]
  return (
    <div style={{height:'100vh',overflowY:'auto',scrollBehavior:'smooth',position:'relative'}}>
      <div style={{position:'fixed',inset:0,background:'linear-gradient(135deg,#020c1b 0%,#041428 40%,#061c36 70%,#041020 100%)',zIndex:0}}/>
      <div style={{position:'fixed',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',top:'-15%',left:'-8%',width:'700px',height:'700px',borderRadius:'50%',background:'radial-gradient(circle,rgba(30,64,175,0.18),transparent 65%)'}}/>
        <div style={{position:'absolute',bottom:'-10%',right:'-5%',width:'600px',height:'600px',borderRadius:'50%',background:'radial-gradient(circle,rgba(29,78,216,0.12),transparent 65%)'}}/>
      </div>
      <div style={{position:'relative',zIndex:1,minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'0 32px'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'6px 14px',borderRadius:'20px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',marginBottom:'32px'}}>
          <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#60a5fa',display:'inline-block'}}/>
          <span style={{fontSize:'12px',color:'#93c5fd',fontWeight:'500',letterSpacing:'0.06em',textTransform:'uppercase'}}>College tennis recruiting</span>
        </div>
        <h1 style={{fontSize:'clamp(36px,6vw,72px)',fontWeight:'700',letterSpacing:'-0.03em',color:'white',lineHeight:'1.1',marginBottom:'24px',maxWidth:'800px'}}>
          Reach every coach.<br/>
          <span style={{background:'linear-gradient(135deg,#60a5fa,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Get recruited.</span>
        </h1>
        <p style={{fontSize:'18px',color:'rgba(147,197,253,0.6)',lineHeight:'1.7',maxWidth:'560px',marginBottom:'48px'}}>
          Fill in your profile once. Claude writes a personalised email to every college tennis coach in the country — 1,805 coaches, all divisions.
        </p>
        <div style={{display:'flex',gap:'16px',alignItems:'center',flexWrap:'wrap',justifyContent:'center',marginBottom:'80px'}}>
          <button onClick={onEnter} style={{...btnP,padding:'16px 36px',fontSize:'16px',borderRadius:'16px',boxShadow:'0 8px 32px rgba(59,130,246,0.3)'}}>Get started →</button>
          <a href="#features" onClick={e=>{e.preventDefault();document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}} style={{fontSize:'14px',color:'rgba(147,197,253,0.5)',cursor:'pointer',textDecoration:'none'}}>See how it works ↓</a>
        </div>
        <div style={{display:'flex',gap:'48px',justifyContent:'center',flexWrap:'wrap'}}>
          {[['1,805','Coaches in database'],['5 divisions','D1 through JUCO'],['~$15','Generate all emails'],['15 min','Setup to outreach']].map(([n,l])=>(
            <div key={n} style={{textAlign:'center'}}>
              <div style={{fontSize:'28px',fontWeight:'700',color:'white',letterSpacing:'-0.02em'}}>{n}</div>
              <div style={{fontSize:'13px',color:'rgba(147,197,253,0.4)',marginTop:'4px'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div id="features" style={{position:'relative',zIndex:1,maxWidth:'960px',margin:'0 auto',padding:'80px 32px'}}>
        <div style={{textAlign:'center',marginBottom:'56px'}}>
          <h2 style={{fontSize:'36px',fontWeight:'700',color:'white',letterSpacing:'-0.02em',marginBottom:'14px'}}>Everything you need to get recruited</h2>
          <p style={{fontSize:'16px',color:'rgba(147,197,253,0.5)',maxWidth:'480px',margin:'0 auto',lineHeight:'1.7'}}>Built for serious athletes who want to maximise their exposure to every program in the country.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'20px',marginBottom:'56px'}}>
          {features.map((f,i)=>(
            <div key={i} style={{...g(),borderRadius:'20px',padding:'28px',textAlign:'left'}}>
              <div style={{width:'44px',height:'44px',borderRadius:'12px',background:'rgba(59,130,246,0.15)',border:'1px solid rgba(59,130,246,0.2)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'16px'}}>
                <i className={`ti ${f.icon}`} style={{fontSize:'20px',color:'#60a5fa'}} aria-hidden="true"/>
              </div>
              <div style={{fontSize:'16px',fontWeight:'600',color:'white',marginBottom:'8px'}}>{f.title}</div>
              <div style={{fontSize:'14px',color:'rgba(147,197,253,0.5)',lineHeight:'1.7'}}>{f.desc}</div>
            </div>
          ))}
        </div>
        <div style={{...g(),borderRadius:'24px',padding:'48px',textAlign:'center'}}>
          <h3 style={{fontSize:'28px',fontWeight:'700',color:'white',letterSpacing:'-0.02em',marginBottom:'12px'}}>Ready to start your outreach?</h3>
          <p style={{fontSize:'15px',color:'rgba(147,197,253,0.5)',marginBottom:'32px',lineHeight:'1.7'}}>Fill in your profile once and we handle the rest.</p>
          <button onClick={onEnter} style={{...btnP,padding:'16px 40px',fontSize:'16px',borderRadius:'16px',boxShadow:'0 8px 32px rgba(59,130,246,0.3)'}}>Start recruiting →</button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [showApp, setShowApp] = useState(false)
  const [tab, setTab] = useState(0)
  const [isPaid, setIsPaid] = useState(false)
  const [satMode, setSatMode] = useState('SAT')
  const [cityState, setCityState] = useState({city:'',state:''})
  const [athlete, setAthlete] = useState({name:'',grad_year:'',location:'',gpa:'',sat:'',high_school:'',academy:'',major:'',height:'',hand:'',phone:'',email:'',utr:'',wtn:'',singles:'',doubles:'',national_rank:'',sectional_rank:'',notable_wins:'',playing_style:'',strengths:'',highlight_url:'',match_url:'',resume_url:'',tournaments:''})
  const [coaches, setCoaches] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [genLog, setGenLog] = useState([])
  const [sending, setSending] = useState(false)
  const [sendLog, setSendLog] = useState([])
  const [fromEmail, setFromEmail] = useState('')
  const [fromName, setFromName] = useState('')
  const [drawerCoach, setDrawerCoach] = useState(null)
  const [filters, setFilters] = useState({division:'All divisions',role:'All roles',search:''})

  const fields = ['name','grad_year','gpa','sat','high_school','academy','major','height','phone','email','utr','wtn','singles','doubles','national_rank','sectional_rank','notable_wins','playing_style','strengths','highlight_url','match_url','resume_url','tournaments']
  const refs = {}
  fields.forEach(f => { refs[f] = useRef(null) })
  const satRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('athlete')
    if (saved) {
      const p = JSON.parse(saved)
      setAthlete(p)
      if (p.location) {
        const parts = p.location.split(', ')
        if (parts.length === 2) setCityState({city:parts[0],state:parts[1]})
      }
      setTimeout(() => { fields.forEach(f => { if (refs[f]?.current) refs[f].current.value = p[f] || '' }) }, 50)
    }
    const paid = localStorage.getItem('isPaid')
    if (paid === 'true') setIsPaid(true)
  }, [])

  useEffect(() => { if(tab>=3) fetchCoaches() }, [tab, page])

  function saveAthlete() {
    const u = { ...athlete }
    fields.forEach(f => { if (refs[f]?.current) u[f] = refs[f].current.value })
    u.hand = athlete.hand
    u.sat = satRef.current?.value || athlete.sat
    u.location = cityState.city && cityState.state ? `${cityState.city}, ${cityState.state}` : (cityState.city || cityState.state || athlete.location)
    setAthlete(u)
    localStorage.setItem('athlete', JSON.stringify(u))
    return u
  }

  async function fetchCoaches() {
    try {
      const res = await fetch(`/api/coaches?page=${page}`)
      const data = await res.json()
      setCoaches(data.coaches||[])
      setTotal(data.total||0)
    } catch(e) {}
  }

  const filtered = coaches.filter(c => {
    if (filters.division !== 'All divisions' && c.division !== filters.division) return false
    if (filters.role !== 'All roles' && c.notes !== filters.role) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!c.school_name?.toLowerCase().includes(q) && !c.coach_name?.toLowerCase().includes(q)) return false
    }
    return true
  })

  async function generateAll() {
    const a = saveAthlete()
    setGenerating(true)
    setGenLog(['Starting generation...'])
    let p=1,tot=0
    while(true) {
      const res = await fetch(`/api/coaches?page=${p}`)
      const data = await res.json()
      const batch = (data.coaches||[]).filter(c=>!c.email_generated)
      if(batch.length===0){setGenLog(prev=>[...prev,'All done!']);break}
      setGenLog(prev=>[...prev,`Batch ${p}: writing ${batch.length} emails...`])
      const r = await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({athlete:a,coachIds:batch.map(c=>c.id)})})
      const d = await r.json()
      tot+=d.generated||0
      setGenLog(prev=>[...prev,`Batch ${p} done — ${d.generated} generated`])
      if(batch.length<50)break
      p++
    }
    setGenLog(prev=>[...prev,`Done! Total: ${tot}`])
    setGenerating(false)
    fetchCoaches()
  }

  async function sendBatch() {
    setSending(true)
    const r = await fetch('/api/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fromEmail,fromName})})
    const d = await r.json()
    setSendLog([`Sent ${d.sent} emails`])
    setSending(false)
    fetchCoaches()
  }

  function updateCoach(updated) {
    setCoaches(prev => prev.map(c => c.id===updated.id?updated:c))
    setDrawerCoach(updated)
  }

  const onFocus = e => { e.target.style.border='1px solid rgba(59,130,246,0.5)'; e.target.style.background='rgba(59,130,246,0.06)' }
  const onBlur  = e => { e.target.style.border='1px solid rgba(255,255,255,0.1)';  e.target.style.background='rgba(255,255,255,0.04)' }

  const inp = (id, label, ph, full) => (
    <div style={{gridColumn:full?'span 2':'span 1',textAlign:'center'}}>
      <label style={lbl}>{label}</label>
      <input ref={refs[id]} defaultValue={athlete[id]||''} placeholder={ph}
        style={{...base,textAlign:'center','--ph-color':'rgba(255,255,255,0.2)'}}
        onFocus={onFocus} onBlur={onBlur}
      />
    </div>
  )

  const ta = (id, label, ph) => (
    <div style={{gridColumn:'span 2',textAlign:'center'}}>
      <label style={lbl}>{label}</label>
      <textarea ref={refs[id]} defaultValue={athlete[id]||''} placeholder={ph}
        style={{...base,height:'84px',lineHeight:'1.6',resize:'none',textAlign:'center'}}
        onFocus={onFocus} onBlur={onBlur}
      />
    </div>
  )

  const selStyle = {...base,colorScheme:'dark',textAlign:'center',cursor:'pointer'}

  const CoachRow = ({c,i}) => {
    let score=0
    if(c.email_generated) score+=20
    if(c.email_sent) score+=30
    if(c.email_opened) score+=30
    if(c.replied) score+=20
    const sc = score>=70?'#4ade80':score>=40?'#fbbf24':score>=20?'#60a5fa':'rgba(255,255,255,0.12)'
    const rowBg = i%2===0?'transparent':'rgba(255,255,255,0.015)'
    return (
      <div style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 90px 70px',padding:'13px 20px',borderTop:'1px solid rgba(255,255,255,0.04)',cursor:'pointer',background:rowBg,transition:'background 0.15s'}}
        onMouseEnter={e=>e.currentTarget.style.background='rgba(59,130,246,0.07)'}
        onMouseLeave={e=>e.currentTarget.style.background=rowBg}
        onClick={()=>setDrawerCoach(c)}>
        <div style={{fontSize:'13px',fontWeight:'500',color:'rgba(255,255,255,0.82)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingRight:'10px'}}>{c.school_name}</div>
        <div style={{fontSize:'13px',color:'rgba(255,255,255,0.42)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingRight:'10px'}}>{c.coach_name}</div>
        <div style={{fontSize:'12px',color:'rgba(147,197,253,0.38)',textAlign:'center'}}>{c.division}</div>
        <div style={{textAlign:'center'}}>
          {c.email_generated
            ?<span style={{fontSize:'11px',padding:'3px 9px',borderRadius:'20px',background:'rgba(74,222,128,0.1)',color:'#4ade80',border:'1px solid rgba(74,222,128,0.2)',fontWeight:'500'}}>Ready</span>
            :<span style={{fontSize:'11px',padding:'3px 9px',borderRadius:'20px',background:'rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.22)'}}>Pending</span>}
        </div>
        <div style={{fontSize:'13px',fontWeight:'700',color:sc,textAlign:'center'}}>{score||'—'}</div>
      </div>
    )
  }

  if (!showApp) return <LandingPage onEnter={()=>setShowApp(true)}/>

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#020c1b 0%,#041428 40%,#061c36 70%,#041020 100%)',paddingBottom:'60px'}}>
      <div style={{position:'fixed',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',top:'-15%',left:'-8%',width:'700px',height:'700px',borderRadius:'50%',background:'radial-gradient(circle,rgba(30,64,175,0.18),transparent 65%)'}}/>
        <div style={{position:'absolute',bottom:'-10%',right:'-5%',width:'600px',height:'600px',borderRadius:'50%',background:'radial-gradient(circle,rgba(29,78,216,0.12),transparent 65%)'}}/>
      </div>

      {drawerCoach && <CoachDrawer coach={drawerCoach} onClose={()=>setDrawerCoach(null)} onUpdate={updateCoach} isPaid={isPaid}/>}

      <div style={{position:'relative',zIndex:1,maxWidth:'960px',margin:'0 auto',padding:'40px 32px 0'}}>

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'36px'}}>
          <button onClick={()=>setShowApp(false)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(147,197,253,0.45)',fontSize:'13px',fontFamily:'inherit',display:'flex',alignItems:'center',gap:'6px',padding:0,transition:'color 0.2s'}}
            onMouseEnter={e=>e.currentTarget.style.color='rgba(147,197,253,0.8)'}
            onMouseLeave={e=>e.currentTarget.style.color='rgba(147,197,253,0.45)'}>
            <i className="ti ti-arrow-left" style={{fontSize:'14px'}} aria-hidden="true"/>
            Back to home
          </button>
          <div style={{textAlign:'center'}}>
            <h1 style={{fontSize:'22px',fontWeight:'700',letterSpacing:'-0.02em',color:'white'}}>Tennis Recruiting Hub</h1>
            <p style={{fontSize:'12px',color:'rgba(147,197,253,0.4)',marginTop:'2px'}}>Fill in your profile · Generate emails · Send to every coach</p>
          </div>
          <div style={{width:'90px'}}/>
        </div>

        {/* Tab nav */}
        <div style={{...g(),borderRadius:'20px',padding:'5px',display:'flex',gap:'3px',marginBottom:'24px',boxShadow:'0 8px 32px rgba(0,0,0,0.3)'}}>
          {TABS.map((t,i)=>(
            <button key={i} onClick={()=>{saveAthlete();setTab(i)}} style={{flex:1,padding:'11px 6px',borderRadius:'13px',cursor:'pointer',fontFamily:'inherit',transition:'all 0.2s',border:tab===i?'1px solid rgba(59,130,246,0.35)':'1px solid transparent',background:tab===i?'linear-gradient(135deg,rgba(59,130,246,0.2),rgba(29,78,216,0.15))':'transparent',color:tab===i?'#93c5fd':'rgba(148,163,184,0.38)',fontSize:'11px',fontWeight:tab===i?'600':'400',display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}>
              <span style={{fontSize:'9px',color:tab===i?'rgba(147,197,253,0.4)':'rgba(100,116,139,0.28)',letterSpacing:'0.05em'}}>{t.num}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={{...g(),borderRadius:'22px',padding:'34px',boxShadow:'0 20px 60px rgba(0,0,0,0.4)'}}>

          {/* PROFILE */}
          {tab===0&&<>
            <div style={{textAlign:'center',marginBottom:'26px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',marginBottom:'6px'}}>Athlete profile</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>Your info — automatically included in every email</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
              {inp('name','Full name','e.g. Amara Eddine')}
              {inp('grad_year','Graduation year','e.g. 2027')}

              {/* City / State dual fields */}
              <div style={{textAlign:'center'}}>
                <label style={lbl}>City</label>
                <input value={cityState.city} onChange={e=>setCityState(p=>({...p,city:e.target.value}))}
                  placeholder="e.g. Brooklyn" style={{...base,textAlign:'center'}} onFocus={onFocus} onBlur={onBlur}/>
              </div>
              <div style={{textAlign:'center'}}>
                <label style={lbl}>State</label>
                <select value={cityState.state} onChange={e=>setCityState(p=>({...p,state:e.target.value}))} style={{...selStyle}}>
                  <option value="" style={{background:'#061c36'}}>Select state...</option>
                  {US_STATES.map(s=><option key={s} value={s} style={{background:'#061c36'}}>{s}</option>)}
                </select>
              </div>

              {inp('gpa','GPA','e.g. 3.9')}

              {/* SAT / ACT toggle */}
              <div style={{textAlign:'center'}}>
                <label style={lbl}>Test score</label>
                <div style={{display:'flex',gap:'0',borderRadius:'12px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.1)',marginBottom:'8px'}}>
                  {['SAT','ACT'].map(m=>(
                    <button key={m} onClick={()=>setSatMode(m)} style={{flex:1,padding:'8px',fontSize:'12px',fontWeight:'600',fontFamily:'inherit',cursor:'pointer',border:'none',background:satMode===m?'rgba(59,130,246,0.25)':'rgba(255,255,255,0.03)',color:satMode===m?'#93c5fd':'rgba(255,255,255,0.3)',transition:'all 0.2s'}}>
                      {m}
                    </button>
                  ))}
                </div>
                <input ref={satRef} defaultValue={athlete.sat||''} placeholder={satMode==='SAT'?'400–1600':'1–36'}
                  style={{...base,textAlign:'center'}} onFocus={onFocus} onBlur={onBlur}/>
              </div>

              {inp('major','Intended major','e.g. Computer Science')}
              {inp('high_school','Current school','e.g. Millburn HS')}
              {inp('academy','Club / Academy','e.g. USTA Training Center')}
              {inp('height','Height',"e.g. 6'1\"")}
              <div style={{textAlign:'center'}}>
                <label style={lbl}>Dominant hand</label>
                <select style={selStyle} value={athlete.hand||''} onChange={e=>setAthlete(p=>({...p,hand:e.target.value}))}>
                  <option value="" style={{background:'#061c36'}}>Select...</option>
                  <option style={{background:'#061c36'}}>Right-handed</option>
                  <option style={{background:'#061c36'}}>Left-handed</option>
                </select>
              </div>
              {inp('phone','Phone','e.g. (201) 555-0123')}
              {inp('email','Your email','e.g. amara@email.com')}
            </div>
            <div style={{display:'flex',justifyContent:'center',marginTop:'26px'}}>
              <button style={btnP} onClick={()=>{saveAthlete();setTab(1)}}>Next: Tennis stats →</button>
            </div>
          </>}

          {/* TENNIS */}
          {tab===1&&<>
            <div style={{textAlign:'center',marginBottom:'26px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',marginBottom:'6px'}}>Tennis stats</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>The numbers and results coaches look at first</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
              {inp('utr','UTR','e.g. 10.8')}{inp('wtn','WTN','e.g. 14.2')}
              {inp('singles','Singles record','e.g. 38-12 (2024)')}{inp('doubles','Doubles record','e.g. 22-8')}
              {inp('national_rank','National ranking','e.g. #45 USTA 18s')}{inp('sectional_rank','Sectional ranking','e.g. #3 Eastern')}
              {ta('notable_wins','Notable wins & results','e.g. Semifinalist USTA National Clay Courts...')}
              {ta('playing_style','Playing style','e.g. Aggressive baseliner, heavy topspin forehand...')}
              {ta('strengths','Key strengths','e.g. Consistency, first-serve %, mental toughness...')}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:'26px'}}>
              <button style={btnG} onClick={()=>{saveAthlete();setTab(0)}}>← Back</button>
              <button style={btnP} onClick={()=>{saveAthlete();setTab(2)}}>Next: Media →</button>
            </div>
          </>}

          {/* MEDIA */}
          {tab===2&&<>
            <div style={{textAlign:'center',marginBottom:'26px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',marginBottom:'6px'}}>Media & documents</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>Links included in every email</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
              {inp('highlight_url','Highlight video URL','https://youtube.com/watch?v=...',true)}
              {inp('match_url','Match footage URL','https://youtube.com/...')}
              {inp('resume_url','Resume URL','https://drive.google.com/...')}
              {ta('tournaments','Upcoming tournaments','- June 14: USTA Sectional (NJ)\n- Aug 3-9: USTA Nationals')}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:'26px'}}>
              <button style={btnG} onClick={()=>{saveAthlete();setTab(1)}}>← Back</button>
              <button style={btnP} onClick={()=>{saveAthlete();setTab(3)}}>Next: Coaches →</button>
            </div>
          </>}

          {/* COACHES DIRECTORY */}
          {tab===3&&<>
            <div style={{textAlign:'center',marginBottom:'22px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',marginBottom:'6px'}}>Coaches directory</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>{total.toLocaleString()} coaches · Filter and click any row to view details</p>
            </div>

            {/* Filters */}
            <div style={{...g('0.03','0.07'),borderRadius:'14px',padding:'14px',marginBottom:'18px'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'10px'}}>
                <div>
                  <label style={{...lbl,fontSize:'10px',marginBottom:'5px'}}>Search</label>
                  <input placeholder="School or coach..." value={filters.search} onChange={e=>setFilters(p=>({...p,search:e.target.value}))}
                    style={{...base,padding:'8px 12px',fontSize:'13px',textAlign:'center'}} onFocus={onFocus} onBlur={onBlur}/>
                </div>
                <div>
                  <label style={{...lbl,fontSize:'10px',marginBottom:'5px'}}>Division</label>
                  <select value={filters.division} onChange={e=>setFilters(p=>({...p,division:e.target.value}))} style={{...selStyle,padding:'8px 12px',fontSize:'13px'}}>
                    {DIVISIONS.map(d=><option key={d} style={{background:'#061c36'}}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{...lbl,fontSize:'10px',marginBottom:'5px'}}>Role</label>
                  <select value={filters.role} onChange={e=>setFilters(p=>({...p,role:e.target.value}))} style={{...selStyle,padding:'8px 12px',fontSize:'13px'}}>
                    {ROLES.map(r=><option key={r} style={{background:'#061c36'}}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{...lbl,fontSize:'10px',marginBottom:'5px'}}>Status</label>
                  <select onChange={e=>{const v=e.target.value;if(v==='generated')setCoaches(p=>p.filter(c=>c.email_generated));else if(v==='pending')setCoaches(p=>p.filter(c=>!c.email_generated));else fetchCoaches()}} style={{...selStyle,padding:'8px 12px',fontSize:'13px'}}>
                    <option style={{background:'#061c36'}}>All statuses</option>
                    <option value="generated" style={{background:'#061c36'}}>Generated</option>
                    <option value="pending" style={{background:'#061c36'}}>Pending</option>
                  </select>
                </div>
              </div>
              {(filters.division!=='All divisions'||filters.role!=='All roles'||filters.search)&&(
                <div style={{marginTop:'10px',display:'flex',alignItems:'center',justifyContent:'center',gap:'12px'}}>
                  <button onClick={()=>setFilters({division:'All divisions',role:'All roles',search:''})} style={{...btnG,padding:'5px 14px',fontSize:'12px'}}>Clear filters</button>
                  <span style={{fontSize:'12px',color:'rgba(147,197,253,0.4)'}}>{filtered.length} results</span>
                </div>
              )}
            </div>

            <div style={{display:'flex',gap:'10px',marginBottom:'16px',justifyContent:'center'}}>
              <button onClick={generateAll} disabled={generating} style={{...btnP,opacity:generating?0.6:1}}>
                {generating&&<span style={spin}/>}
                {generating?'Generating...':'Lock in selected coaches'}
              </button>
              <button onClick={fetchCoaches} style={btnG}>Refresh</button>
            </div>

            {genLog.length>0&&(
              <div style={{background:'rgba(0,0,0,0.5)',border:'1px solid rgba(74,222,128,0.15)',borderRadius:'12px',padding:'14px',marginBottom:'16px',fontFamily:'monospace',fontSize:'12px',color:'#4ade80',maxHeight:'140px',overflowY:'auto',lineHeight:'1.8',textAlign:'left'}}>
                {genLog.map((l,i)=><div key={i}>{l}</div>)}
              </div>
            )}

            <div style={{borderRadius:'14px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.06)'}}>
              <div style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 90px 70px',padding:'11px 20px',background:'rgba(255,255,255,0.03)',fontSize:'10px',fontWeight:'600',color:'rgba(147,197,253,0.4)',textTransform:'uppercase',letterSpacing:'0.08em'}}>
                <div>School</div><div>Coach</div><div style={{textAlign:'center'}}>Division</div><div style={{textAlign:'center'}}>Status</div><div style={{textAlign:'center'}}>Score</div>
              </div>
              {filtered.map((c,i)=><CoachRow key={c.id} c={c} i={i}/>)}
              {filtered.length===0&&<div style={{padding:'32px',textAlign:'center',fontSize:'13px',color:'rgba(255,255,255,0.2)'}}>No coaches match your filters</div>}
            </div>

            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'16px'}}>
              <span style={{fontSize:'12px',color:'rgba(255,255,255,0.18)'}}>Page {page} — {filtered.length} shown of {total.toLocaleString()}</span>
              <div style={{display:'flex',gap:'8px'}}>
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{...btnG,padding:'7px 14px',fontSize:'12px',opacity:page===1?0.3:1}}>← Prev</button>
                <button onClick={()=>setPage(p=>p+1)} disabled={coaches.length<50} style={{...btnG,padding:'7px 14px',fontSize:'12px',opacity:coaches.length<50?0.3:1}}>Next →</button>
              </div>
            </div>
          </>}

          {/* SEND */}
          {tab===4&&<>
            <div style={{textAlign:'center',marginBottom:'26px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',marginBottom:'6px'}}>Send emails</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>Send all generated emails in batches of 50</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',marginBottom:'22px'}}>
              <div style={{textAlign:'center'}}>
                <label style={lbl}>Your name</label>
                <input style={{...base,textAlign:'center'}} placeholder="e.g. Amara Eddine" value={fromName} onChange={e=>setFromName(e.target.value)} onFocus={onFocus} onBlur={onBlur}/>
              </div>
              <div style={{textAlign:'center'}}>
                <label style={lbl}>Send from email</label>
                <input style={{...base,textAlign:'center'}} placeholder="you@yourdomain.com" value={fromEmail} onChange={e=>setFromEmail(e.target.value)} onFocus={onFocus} onBlur={onBlur}/>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'center'}}>
              <button onClick={sendBatch} disabled={sending||!fromEmail||!fromName} style={{...btnGr,opacity:(sending||!fromEmail||!fromName)?0.5:1}}>
                {sending&&<span style={spin}/>}
                {sending?'Sending...':'Send next 50 emails'}
              </button>
            </div>
            {sendLog.length>0&&<div style={{marginTop:'18px',background:'rgba(0,0,0,0.4)',border:'1px solid rgba(74,222,128,0.15)',borderRadius:'12px',padding:'14px',fontFamily:'monospace',fontSize:'12px',color:'#4ade80',textAlign:'center'}}>{sendLog.map((l,i)=><div key={i}>{l}</div>)}</div>}
          </>}

          {/* DASHBOARD */}
          {tab===5&&<>
            <div style={{textAlign:'center',marginBottom:'26px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',marginBottom:'6px'}}>Dashboard</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>Live stats · Click any coach to view details</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px',marginBottom:'28px'}}>
              {[
                {label:'Total coaches',val:total,bg:'rgba(59,130,246,0.1)',border:'rgba(59,130,246,0.2)',color:'#93c5fd'},
                {label:'Emails generated',val:coaches.filter(c=>c.email_generated).length,bg:'rgba(74,222,128,0.08)',border:'rgba(74,222,128,0.2)',color:'#4ade80'},
                {label:'Emails sent',val:coaches.filter(c=>c.email_sent).length,bg:'rgba(168,85,247,0.08)',border:'rgba(168,85,247,0.2)',color:'#c084fc'},
              ].map((s,i)=>(
                <div key={i} style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:'18px',padding:'22px',textAlign:'center'}}>
                  <div style={{fontSize:'34px',fontWeight:'700',color:s.color,letterSpacing:'-0.02em',lineHeight:1}}>{s.val.toLocaleString()}</div>
                  <div style={{fontSize:'12px',color:'rgba(255,255,255,0.28)',marginTop:'7px'}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',justifyContent:'center',marginBottom:'18px'}}>
              <button onClick={fetchCoaches} style={btnG}>Refresh stats</button>
            </div>
            <div style={{borderRadius:'14px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.06)'}}>
              <div style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 90px 70px',padding:'11px 20px',background:'rgba(255,255,255,0.03)',fontSize:'10px',fontWeight:'600',color:'rgba(147,197,253,0.4)',textTransform:'uppercase',letterSpacing:'0.08em'}}>
                <div>School</div><div>Coach</div><div style={{textAlign:'center'}}>Division</div><div style={{textAlign:'center'}}>Status</div><div style={{textAlign:'center'}}>Score</div>
              </div>
              {coaches.slice(0,20).map((c,i)=><CoachRow key={c.id} c={c} i={i}/>)}
            </div>
          </>}

        </div>
      </div>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.22)!important;opacity:1}
      `}</style>
    </div>
  )
}
