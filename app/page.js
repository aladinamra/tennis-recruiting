'use client'
import { useState, useEffect, useRef } from 'react'

const TABS = [
  { label: 'Profile', num: '01' },
  { label: 'Tennis', num: '02' },
  { label: 'Media', num: '03' },
  { label: 'Generate', num: '04' },
  { label: 'Send', num: '05' },
  { label: 'Dashboard', num: '06' },
]

const glass = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.08)',
}

const inputStyle = {
  display: 'block',
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '14px',
  color: 'white',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border 0.2s, background 0.2s',
}

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '600',
  color: 'rgba(147,197,253,0.6)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '8px',
}

const btnPrimary = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  border: '1px solid rgba(59,130,246,0.4)',
  color: 'white',
  padding: '11px 24px',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
}

const btnGhost = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: 'rgba(255,255,255,0.5)',
  padding: '11px 20px',
  borderRadius: '12px',
  fontSize: '14px',
  cursor: 'pointer',
  fontFamily: 'inherit',
}

const btnGreen = {
  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
  border: '1px solid rgba(5,150,105,0.4)',
  color: 'white',
  padding: '11px 24px',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
}

function InterestScore({ coach }) {
  let score = 0
  let factors = []
  if (coach.email_generated) { score += 20; factors.push('Email written') }
  if (coach.email_sent) { score += 30; factors.push('Email sent') }
  if (coach.email_opened) { score += 30; factors.push('Opened') }
  if (coach.replied) { score += 20; factors.push('Replied') }

  const color = score >= 70 ? '#4ade80' : score >= 40 ? '#fbbf24' : score >= 20 ? '#60a5fa' : 'rgba(255,255,255,0.2)'
  const bg = score >= 70 ? 'rgba(74,222,128,0.1)' : score >= 40 ? 'rgba(251,191,36,0.1)' : score >= 20 ? 'rgba(96,165,250,0.1)' : 'rgba(255,255,255,0.04)'
  const border = score >= 70 ? 'rgba(74,222,128,0.25)' : score >= 40 ? 'rgba(251,191,36,0.25)' : score >= 20 ? 'rgba(96,165,250,0.25)' : 'rgba(255,255,255,0.08)'

  return (
    <div style={{background:bg, border:`1px solid ${border}`, borderRadius:'16px', padding:'16px', marginBottom:'16px'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px'}}>
        <span style={{fontSize:'12px', fontWeight:'600', color:'rgba(147,197,253,0.6)', textTransform:'uppercase', letterSpacing:'0.08em'}}>Interest Score</span>
        <span style={{fontSize:'24px', fontWeight:'700', color}}>{score}</span>
      </div>
      <div style={{height:'6px', background:'rgba(255,255,255,0.06)', borderRadius:'3px', marginBottom:'10px', overflow:'hidden'}}>
        <div style={{height:'100%', width:`${score}%`, background:`linear-gradient(90deg, ${color}, ${color}aa)`, borderRadius:'3px', transition:'width 0.5s ease'}}/>
      </div>
      <div style={{display:'flex', gap:'6px', flexWrap:'wrap'}}>
        {factors.map((f,i) => (
          <span key={i} style={{fontSize:'11px', padding:'3px 8px', borderRadius:'20px', background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.5)'}}>{f}</span>
        ))}
        {factors.length === 0 && <span style={{fontSize:'11px', color:'rgba(255,255,255,0.2)'}}>No activity yet</span>}
      </div>
    </div>
  )
}

function CoachDrawer({ coach, onClose, onUpdate }) {
  const [marking, setMarking] = useState(false)

  async function markReplied() {
    setMarking(true)
    try {
      await fetch('/api/coaches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: coach.id, replied: true })
      })
      onUpdate({ ...coach, replied: true })
    } catch(e) {}
    setMarking(false)
  }

  return (
    <div style={{position:'fixed', inset:0, zIndex:50, display:'flex'}}>
      {/* Backdrop */}
      <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)'}} onClick={onClose}/>

      {/* Drawer */}
      <div style={{
        position:'absolute', right:0, top:0, bottom:0, width:'480px',
        background:'linear-gradient(135deg, #061c36, #041428)',
        border:'1px solid rgba(255,255,255,0.08)',
        boxShadow:'-20px 0 60px rgba(0,0,0,0.5)',
        overflowY:'auto', padding:'28px',
        animation:'slideIn 0.25s ease'
      }}>
        {/* Header */}
        <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'24px'}}>
          <div>
            <div style={{fontSize:'20px', fontWeight:'700', color:'white', marginBottom:'4px'}}>{coach.coach_name}</div>
            <div style={{fontSize:'14px', color:'rgba(147,197,253,0.5)'}}>{coach.school_name}</div>
            <div style={{fontSize:'12px', color:'rgba(255,255,255,0.25)', marginTop:'2px'}}>{coach.division} · {coach.notes}</div>
          </div>
          <button onClick={onClose} style={{...btnGhost, padding:'8px 12px', fontSize:'16px'}}>✕</button>
        </div>

        {/* Interest score */}
        <InterestScore coach={coach} />

        {/* Status badges */}
        <div style={{display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'24px'}}>
          {coach.email_generated && <span style={{fontSize:'12px', padding:'5px 12px', borderRadius:'20px', background:'rgba(59,130,246,0.1)', color:'#60a5fa', border:'1px solid rgba(59,130,246,0.2)', fontWeight:'500'}}>✓ Email generated</span>}
          {coach.email_sent && <span style={{fontSize:'12px', padding:'5px 12px', borderRadius:'20px', background:'rgba(74,222,128,0.1)', color:'#4ade80', border:'1px solid rgba(74,222,128,0.2)', fontWeight:'500'}}>✓ Email sent</span>}
          {coach.replied && <span style={{fontSize:'12px', padding:'5px 12px', borderRadius:'20px', background:'rgba(168,85,247,0.1)', color:'#c084fc', border:'1px solid rgba(168,85,247,0.2)', fontWeight:'500'}}>✓ Replied</span>}
        </div>

        {/* Coach details */}
        <div style={{...glass, borderRadius:'16px', padding:'16px', marginBottom:'20px'}}>
          <div style={{fontSize:'11px', fontWeight:'600', color:'rgba(147,197,253,0.5)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'12px'}}>Contact info</div>
          <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span style={{fontSize:'13px', color:'rgba(255,255,255,0.4)'}}>Email</span>
              <span style={{fontSize:'13px', color:'rgba(255,255,255,0.8)', fontWeight:'500'}}>{coach.email}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span style={{fontSize:'13px', color:'rgba(255,255,255,0.4)'}}>School</span>
              <span style={{fontSize:'13px', color:'rgba(255,255,255,0.8)', fontWeight:'500'}}>{coach.school_name}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span style={{fontSize:'13px', color:'rgba(255,255,255,0.4)'}}>Division</span>
              <span style={{fontSize:'13px', color:'rgba(255,255,255,0.8)', fontWeight:'500'}}>{coach.division}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span style={{fontSize:'13px', color:'rgba(255,255,255,0.4)'}}>Role</span>
              <span style={{fontSize:'13px', color:'rgba(255,255,255,0.8)', fontWeight:'500'}}>{coach.notes}</span>
            </div>
          </div>
        </div>

        {/* Generated email */}
        {coach.email_generated && coach.email_subject && (
          <div style={{marginBottom:'20px'}}>
            <div style={{fontSize:'11px', fontWeight:'600', color:'rgba(147,197,253,0.5)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'12px'}}>Generated email</div>
            <div style={{...glass, borderRadius:'16px', overflow:'hidden'}}>
              <div style={{padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(59,130,246,0.06)'}}>
                <div style={{fontSize:'13px', fontWeight:'600', color:'rgba(255,255,255,0.9)'}}>{coach.email_subject}</div>
                <div style={{fontSize:'11px', color:'rgba(147,197,253,0.4)', marginTop:'3px'}}>To: {coach.email}</div>
              </div>
              <div style={{padding:'16px', fontSize:'13px', color:'rgba(255,255,255,0.45)', lineHeight:'1.8', whiteSpace:'pre-wrap', maxHeight:'280px', overflowY:'auto'}}>{coach.email_body}</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          {!coach.replied && coach.email_sent && (
            <button onClick={markReplied} disabled={marking} style={{...btnPrimary, justifyContent:'center', opacity:marking?0.6:1}}>
              {marking ? 'Saving...' : '✓ Mark as replied'}
            </button>
          )}
          <a href={`mailto:${coach.email}`} style={{...btnGhost, textDecoration:'none', textAlign:'center', display:'block', padding:'11px 20px'}}>
            Open in mail app
          </a>
        </div>
      </div>

      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  )
}

export default function Home() {
  const [tab, setTab] = useState(0)
  const [athlete, setAthlete] = useState({
    name:'',grad_year:'',location:'',gpa:'',sat:'',high_school:'',academy:'',
    major:'',height:'',hand:'',phone:'',email:'',utr:'',wtn:'',singles:'',
    doubles:'',national_rank:'',sectional_rank:'',notable_wins:'',
    playing_style:'',strengths:'',highlight_url:'',match_url:'',
    resume_url:'',tournaments:''
  })
  const [coaches, setCoaches] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [genLog, setGenLog] = useState([])
  const [sending, setSending] = useState(false)
  const [sendLog, setSendLog] = useState([])
  const [fromEmail, setFromEmail] = useState('')
  const [fromName, setFromName] = useState('')
  const [selectedCoach, setSelectedCoach] = useState(null)
  const [drawerCoach, setDrawerCoach] = useState(null)

  const fields = ['name','grad_year','location','gpa','sat','high_school','academy','major','height','phone','email','utr','wtn','singles','doubles','national_rank','sectional_rank','notable_wins','playing_style','strengths','highlight_url','match_url','resume_url','tournaments']
  const refs = {}
  fields.forEach(f => { refs[f] = useRef(null) })

  useEffect(() => {
    const saved = localStorage.getItem('athlete')
    if (saved) {
      const parsed = JSON.parse(saved)
      setAthlete(parsed)
      setTimeout(() => {
        fields.forEach(f => { if (refs[f].current) refs[f].current.value = parsed[f] || '' })
      }, 50)
    }
  }, [])

  useEffect(() => { if(tab>=3) fetchCoaches() }, [tab, page])

  function saveAthlete() {
    const updated = { ...athlete }
    fields.forEach(f => { if (refs[f].current) updated[f] = refs[f].current.value })
    updated.hand = athlete.hand
    setAthlete(updated)
    localStorage.setItem('athlete', JSON.stringify(updated))
    return updated
  }

  async function fetchCoaches() {
    try {
      const res = await fetch(`/api/coaches?page=${page}`)
      const data = await res.json()
      setCoaches(data.coaches||[])
      setTotal(data.total||0)
    } catch(e) {}
  }

  async function generateAll() {
    const a = saveAthlete()
    setGenerating(true)
    setGenLog(['Starting generation...'])
    let p=1, tot=0
    while(true) {
      const res = await fetch(`/api/coaches?page=${p}`)
      const data = await res.json()
      const batch = (data.coaches||[]).filter(c=>!c.email_generated)
      if(batch.length===0){setGenLog(prev=>[...prev,'✓ All done!']);break}
      setGenLog(prev=>[...prev,`Batch ${p}: writing ${batch.length} emails...`])
      const r = await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({athlete:a,coachIds:batch.map(c=>c.id)})})
      const d = await r.json()
      tot+=d.generated||0
      setGenLog(prev=>[...prev,`✓ Batch ${p} done — ${d.generated} generated`])
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
    setSendLog([`✓ Sent ${d.sent} emails`])
    setSending(false)
    fetchCoaches()
  }

  function updateCoachInList(updated) {
    setCoaches(prev => prev.map(c => c.id === updated.id ? updated : c))
    setDrawerCoach(updated)
  }

  const inp = (id, label, placeholder, full) => (
    <div style={{gridColumn: full ? 'span 2' : 'span 1'}}>
      <label style={labelStyle}>{label}</label>
      <input ref={refs[id]} defaultValue={athlete[id]||''} placeholder={placeholder} style={inputStyle}
        onFocus={e=>{e.target.style.border='1px solid rgba(59,130,246,0.5)';e.target.style.background='rgba(59,130,246,0.06)'}}
        onBlur={e=>{e.target.style.border='1px solid rgba(255,255,255,0.08)';e.target.style.background='rgba(255,255,255,0.04)'}}
      />
    </div>
  )

  const ta = (id, label, placeholder) => (
    <div style={{gridColumn:'span 2'}}>
      <label style={labelStyle}>{label}</label>
      <textarea ref={refs[id]} defaultValue={athlete[id]||''} placeholder={placeholder}
        style={{...inputStyle, height:'88px', lineHeight:'1.6', resize:'none'}}
        onFocus={e=>{e.target.style.border='1px solid rgba(59,130,246,0.5)';e.target.style.background='rgba(59,130,246,0.06)'}}
        onBlur={e=>{e.target.style.border='1px solid rgba(255,255,255,0.08)';e.target.style.background='rgba(255,255,255,0.04)'}}
      />
    </div>
  )

  const CoachRow = ({ c }) => {
    let score = 0
    if (c.email_generated) score += 20
    if (c.email_sent) score += 30
    if (c.email_opened) score += 30
    if (c.replied) score += 20
    const scoreColor = score >= 70 ? '#4ade80' : score >= 40 ? '#fbbf24' : score >= 20 ? '#60a5fa' : 'rgba(255,255,255,0.15)'

    return (
      <div
        style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 80px 80px',padding:'14px 20px',borderTop:'1px solid rgba(255,255,255,0.04)',cursor:'pointer',transition:'background 0.15s'}}
        onMouseEnter={e=>e.currentTarget.style.background='rgba(59,130,246,0.06)'}
        onMouseLeave={e=>e.currentTarget.style.background='transparent'}
        onClick={()=>setDrawerCoach(c)}
      >
        <div style={{fontSize:'14px',fontWeight:'500',color:'rgba(255,255,255,0.8)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingRight:'12px'}}>{c.school_name}</div>
        <div style={{fontSize:'13px',color:'rgba(255,255,255,0.4)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingRight:'12px'}}>{c.coach_name}</div>
        <div style={{fontSize:'12px',color:'rgba(147,197,253,0.35)'}}>{c.division}</div>
        <div>
          {c.email_generated
            ?<span style={{fontSize:'11px',padding:'3px 10px',borderRadius:'20px',background:'rgba(74,222,128,0.1)',color:'#4ade80',border:'1px solid rgba(74,222,128,0.2)',fontWeight:'500'}}>Ready</span>
            :<span style={{fontSize:'11px',padding:'3px 10px',borderRadius:'20px',background:'rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.25)'}}>Pending</span>}
        </div>
        <div style={{fontSize:'13px',fontWeight:'700',color:scoreColor,textAlign:'right'}}>{score > 0 ? score : '—'}</div>
      </div>
    )
  }

  return (
    <div style={{minHeight:'100vh', background:'linear-gradient(135deg, #020c1b 0%, #041428 40%, #061c36 70%, #041020 100%)', padding:'0 0 60px 0'}}>
      <div style={{position:'fixed',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',top:'-15%',left:'-8%',width:'700px',height:'700px',borderRadius:'50%',background:'radial-gradient(circle, rgba(30,64,175,0.18), transparent 65%)'}}/>
        <div style={{position:'absolute',bottom:'-10%',right:'-5%',width:'600px',height:'600px',borderRadius:'50%',background:'radial-gradient(circle, rgba(29,78,216,0.12), transparent 65%)'}}/>
      </div>

      {drawerCoach && <CoachDrawer coach={drawerCoach} onClose={()=>setDrawerCoach(null)} onUpdate={updateCoachInList} />}

      <div style={{position:'relative',zIndex:1,maxWidth:'960px',margin:'0 auto',padding:'48px 32px 0'}}>
        <div style={{marginBottom:'40px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'10px'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'12px',background:'linear-gradient(135deg, #3b82f6, #1d4ed8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',boxShadow:'0 8px 32px rgba(59,130,246,0.3)'}}>🎾</div>
            <div>
              <h1 style={{fontSize:'26px',fontWeight:'700',letterSpacing:'-0.02em',color:'white'}}>Tennis Recruiting Hub</h1>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.45)',marginTop:'2px'}}>Fill in your profile · Generate personalised emails · Send to every coach</p>
            </div>
          </div>
        </div>

        <div style={{...glass, borderRadius:'20px', padding:'6px', display:'flex', gap:'4px', marginBottom:'28px', boxShadow:'0 8px 32px rgba(0,0,0,0.3)'}}>
          {TABS.map((t,i)=>(
            <button key={i} onClick={()=>{ saveAthlete(); setTab(i) }} style={{
              flex:1, padding:'12px 8px', borderRadius:'14px', cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s',
              border: tab===i ? '1px solid rgba(59,130,246,0.35)' : '1px solid transparent',
              background: tab===i ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(29,78,216,0.15))' : 'transparent',
              color: tab===i ? '#93c5fd' : 'rgba(148,163,184,0.4)',
              fontSize:'12px', fontWeight: tab===i ? '600' : '400',
              display:'flex', flexDirection:'column', alignItems:'center', gap:'4px',
            }}>
              <span style={{fontSize:'9px',color:tab===i?'rgba(147,197,253,0.4)':'rgba(100,116,139,0.3)',fontWeight:'500',letterSpacing:'0.06em'}}>{t.num}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{...glass, borderRadius:'24px', padding:'36px', boxShadow:'0 20px 60px rgba(0,0,0,0.4)'}}>

          {tab===0&&<>
            <div style={{marginBottom:'28px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',letterSpacing:'-0.01em',marginBottom:'6px'}}>Athlete profile</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>Your personal info — automatically included in every email</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              {inp('name','Full name','e.g. Amara Eddine')}
              {inp('grad_year','Graduation year','e.g. 2027')}
              {inp('location','City / State','e.g. Brooklyn, NY')}
              {inp('gpa','GPA','e.g. 3.9')}
              {inp('sat','SAT / ACT','e.g. 1550 SAT')}
              {inp('major','Intended major','e.g. Computer Science')}
              {inp('high_school','Current school','e.g. Millburn HS')}
              {inp('academy','Club / Academy','e.g. USTA Training Center')}
              {inp('height','Height',"e.g. 6'1\"")}
              <div>
                <label style={labelStyle}>Dominant hand</label>
                <select style={{...inputStyle,colorScheme:'dark'}} value={athlete.hand||''} onChange={e=>setAthlete(p=>({...p,hand:e.target.value}))}>
                  <option value="" style={{background:'#061c36'}}>Select...</option>
                  <option style={{background:'#061c36'}}>Right-handed</option>
                  <option style={{background:'#061c36'}}>Left-handed</option>
                </select>
              </div>
              {inp('phone','Phone number','e.g. (201) 555-0123')}
              {inp('email','Your email','e.g. amara@email.com')}
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',marginTop:'28px'}}>
              <button style={btnPrimary} onClick={()=>{saveAthlete();setTab(1)}}>Next: Tennis stats →</button>
            </div>
          </>}

          {tab===1&&<>
            <div style={{marginBottom:'28px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',letterSpacing:'-0.01em',marginBottom:'6px'}}>Tennis stats</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>The numbers and results coaches look at first</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              {inp('utr','UTR','e.g. 10.8')}
              {inp('wtn','WTN','e.g. 14.2')}
              {inp('singles','Singles record','e.g. 38-12 (2024)')}
              {inp('doubles','Doubles record','e.g. 22-8')}
              {inp('national_rank','National ranking','e.g. #45 USTA 18s')}
              {inp('sectional_rank','Sectional ranking','e.g. #3 Eastern')}
              {ta('notable_wins','Notable wins & results','e.g. Semifinalist USTA National Clay Courts...')}
              {ta('playing_style','Playing style','e.g. Aggressive baseliner, heavy topspin forehand...')}
              {ta('strengths','Key strengths','e.g. Consistency, first-serve %, mental toughness...')}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:'28px'}}>
              <button style={btnGhost} onClick={()=>{saveAthlete();setTab(0)}}>← Back</button>
              <button style={btnPrimary} onClick={()=>{saveAthlete();setTab(2)}}>Next: Media →</button>
            </div>
          </>}

          {tab===2&&<>
            <div style={{marginBottom:'28px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',letterSpacing:'-0.01em',marginBottom:'6px'}}>Media & documents</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>Links included in every email you send to coaches</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              {inp('highlight_url','Highlight video URL ★','https://youtube.com/watch?v=...',true)}
              {inp('match_url','Match footage URL','https://youtube.com/...')}
              {inp('resume_url','Resume URL','https://drive.google.com/...')}
              {ta('tournaments','Upcoming tournaments','- June 14: USTA Sectional (NJ)\n- Aug 3-9: USTA Nationals')}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:'28px'}}>
              <button style={btnGhost} onClick={()=>{saveAthlete();setTab(1)}}>← Back</button>
              <button style={btnPrimary} onClick={()=>{saveAthlete();setTab(3)}}>Next: Generate →</button>
            </div>
          </>}

          {tab===3&&<>
            <div style={{marginBottom:'28px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',letterSpacing:'-0.01em',marginBottom:'6px'}}>Generate emails</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>{total.toLocaleString()} coaches in database · Click a row to view profile & email</p>
            </div>
            <div style={{display:'flex',gap:'12px',marginBottom:'24px'}}>
              <button onClick={generateAll} disabled={generating} style={{...btnPrimary,opacity:generating?0.6:1}}>
                {generating&&<span style={{width:'14px',height:'14px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.7s linear infinite',display:'inline-block'}}/>}
                {generating?'Generating...':'Generate all emails'}
              </button>
              <button onClick={fetchCoaches} style={btnGhost}>Refresh</button>
            </div>
            {genLog.length>0&&(
              <div style={{background:'rgba(0,0,0,0.5)',border:'1px solid rgba(74,222,128,0.15)',borderRadius:'14px',padding:'16px',marginBottom:'24px',fontFamily:'monospace',fontSize:'12px',color:'#4ade80',maxHeight:'160px',overflowY:'auto',lineHeight:'1.8'}}>
                {genLog.map((l,i)=><div key={i}>{l}</div>)}
              </div>
            )}
            <div style={{borderRadius:'16px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.06)'}}>
              <div style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 80px 80px',padding:'12px 20px',background:'rgba(255,255,255,0.03)',fontSize:'11px',fontWeight:'600',color:'rgba(147,197,253,0.4)',textTransform:'uppercase',letterSpacing:'0.08em'}}>
                <div>School</div><div>Coach</div><div>Division</div><div>Status</div><div style={{textAlign:'right'}}>Score</div>
              </div>
              {coaches.map(c=><CoachRow key={c.id} c={c} />)}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'20px'}}>
              <span style={{fontSize:'12px',color:'rgba(255,255,255,0.2)'}}>Page {page} — {coaches.length} of {total.toLocaleString()}</span>
              <div style={{display:'flex',gap:'8px'}}>
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{...btnGhost,padding:'8px 14px',fontSize:'12px',opacity:page===1?0.3:1}}>← Prev</button>
                <button onClick={()=>setPage(p=>p+1)} disabled={coaches.length<50} style={{...btnGhost,padding:'8px 14px',fontSize:'12px',opacity:coaches.length<50?0.3:1}}>Next →</button>
              </div>
            </div>
          </>}

          {tab===4&&<>
            <div style={{marginBottom:'28px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',letterSpacing:'-0.01em',marginBottom:'6px'}}>Send emails</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>Sends all generated emails in batches of 50</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
              <div>
                <label style={labelStyle}>Your name</label>
                <input style={inputStyle} placeholder="e.g. Amara Eddine" value={fromName} onChange={e=>setFromName(e.target.value)}
                  onFocus={e=>{e.target.style.border='1px solid rgba(59,130,246,0.5)';e.target.style.background='rgba(59,130,246,0.06)'}}
                  onBlur={e=>{e.target.style.border='1px solid rgba(255,255,255,0.08)';e.target.style.background='rgba(255,255,255,0.04)'}}/>
              </div>
              <div>
                <label style={labelStyle}>Send from email</label>
                <input style={inputStyle} placeholder="you@yourdomain.com" value={fromEmail} onChange={e=>setFromEmail(e.target.value)}
                  onFocus={e=>{e.target.style.border='1px solid rgba(59,130,246,0.5)';e.target.style.background='rgba(59,130,246,0.06)'}}
                  onBlur={e=>{e.target.style.border='1px solid rgba(255,255,255,0.08)';e.target.style.background='rgba(255,255,255,0.04)'}}/>
              </div>
            </div>
            <button onClick={sendBatch} disabled={sending||!fromEmail||!fromName} style={{...btnGreen,opacity:(sending||!fromEmail||!fromName)?0.5:1}}>
              {sending&&<span style={{width:'14px',height:'14px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.7s linear infinite',display:'inline-block'}}/>}
              {sending?'Sending...':'Send next 50 emails'}
            </button>
            {sendLog.length>0&&(
              <div style={{marginTop:'20px',background:'rgba(0,0,0,0.5)',border:'1px solid rgba(74,222,128,0.15)',borderRadius:'14px',padding:'16px',fontFamily:'monospace',fontSize:'12px',color:'#4ade80'}}>
                {sendLog.map((l,i)=><div key={i}>{l}</div>)}
              </div>
            )}
          </>}

          {tab===5&&<>
            <div style={{marginBottom:'28px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',letterSpacing:'-0.01em',marginBottom:'6px'}}>Dashboard</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>Live stats from your Supabase database · Click any coach to view details</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',marginBottom:'32px'}}>
              {[
                {label:'Total coaches',val:total,bg:'rgba(59,130,246,0.1)',border:'rgba(59,130,246,0.2)',color:'#93c5fd'},
                {label:'Emails generated',val:coaches.filter(c=>c.email_generated).length,bg:'rgba(74,222,128,0.08)',border:'rgba(74,222,128,0.2)',color:'#4ade80'},
                {label:'Emails sent',val:coaches.filter(c=>c.email_sent).length,bg:'rgba(168,85,247,0.08)',border:'rgba(168,85,247,0.2)',color:'#c084fc'},
              ].map((s,i)=>(
                <div key={i} style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:'20px',padding:'24px',textAlign:'center'}}>
                  <div style={{fontSize:'36px',fontWeight:'700',color:s.color,letterSpacing:'-0.02em',lineHeight:1}}>{s.val.toLocaleString()}</div>
                  <div style={{fontSize:'12px',color:'rgba(255,255,255,0.3)',marginTop:'8px',fontWeight:'500'}}>{s.label}</div>
                </div>
              ))}
            </div>
            <button onClick={fetchCoaches} style={{...btnGhost,marginBottom:'20px'}}>Refresh stats</button>
            <div style={{borderRadius:'16px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.06)'}}>
              <div style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 80px 80px',padding:'12px 20px',background:'rgba(255,255,255,0.03)',fontSize:'11px',fontWeight:'600',color:'rgba(147,197,253,0.4)',textTransform:'uppercase',letterSpacing:'0.08em'}}>
                <div>School</div><div>Coach</div><div>Division</div><div>Status</div><div style={{textAlign:'right'}}>Score</div>
              </div>
              {coaches.slice(0,20).map(c=><CoachRow key={c.id} c={c} />)}
            </div>
          </>}

        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
