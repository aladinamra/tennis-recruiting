'use client'
import { useState, useEffect } from 'react'

const TABS = [
  { label: 'Profile', icon: '◈' },
  { label: 'Tennis', icon: '◎' },
  { label: 'Media', icon: '◇' },
  { label: 'Generate', icon: '⟡' },
  { label: 'Send', icon: '◈' },
  { label: 'Dashboard', icon: '▦' },
]

const glass = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.08)',
}

const glassBlue = {
  background: 'rgba(59,130,246,0.08)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(59,130,246,0.2)',
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
  transition: 'all 0.2s',
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

  useEffect(() => { const s = localStorage.getItem('athlete'); if(s) setAthlete(JSON.parse(s)) }, [])
  useEffect(() => { localStorage.setItem('athlete', JSON.stringify(athlete)) }, [athlete])
  useEffect(() => { if(tab>=3) fetchCoaches() }, [tab, page])

  async function fetchCoaches() {
    try {
      const res = await fetch(`/api/coaches?page=${page}`)
      const data = await res.json()
      setCoaches(data.coaches||[])
      setTotal(data.total||0)
    } catch(e) {}
  }

  function set(f,v) { setAthlete(p=>({...p,[f]:v})) }

  async function generateAll() {
    setGenerating(true)
    setGenLog(['Starting generation...'])
    let p=1, tot=0
    while(true) {
      const res = await fetch(`/api/coaches?page=${p}`)
      const data = await res.json()
      const batch = (data.coaches||[]).filter(c=>!c.email_generated)
      if(batch.length===0){setGenLog(prev=>[...prev,'✓ All emails generated!']);break}
      setGenLog(prev=>[...prev,`Batch ${p}: writing ${batch.length} emails...`])
      const r = await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({athlete,coachIds:batch.map(c=>c.id)})})
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

  const Field = ({id, label, placeholder, full, type='text'}) => (
    <div style={{gridColumn: full ? 'span 2' : 'span 1'}}>
      <label style={{display:'block',fontSize:'11px',fontWeight:'600',color:'rgba(147,197,253,0.6)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>{label}</label>
      <input
        type={type}
        style={inputStyle}
        placeholder={placeholder}
        value={athlete[id]||''}
        onChange={e=>set(id,e.target.value)}
        onFocus={e=>{e.target.style.border='1px solid rgba(59,130,246,0.5)';e.target.style.background='rgba(59,130,246,0.06)'}}
        onBlur={e=>{e.target.style.border='1px solid rgba(255,255,255,0.08)';e.target.style.background='rgba(255,255,255,0.04)'}}
      />
    </div>
  )

  const TextArea = ({id, label, placeholder}) => (
    <div style={{gridColumn:'span 2'}}>
      <label style={{display:'block',fontSize:'11px',fontWeight:'600',color:'rgba(147,197,253,0.6)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>{label}</label>
      <textarea
        style={{...inputStyle,height:'88px',lineHeight:'1.6',resize:'none'}}
        placeholder={placeholder}
        value={athlete[id]||''}
        onChange={e=>set(id,e.target.value)}
        onFocus={e=>{e.target.style.border='1px solid rgba(59,130,246,0.5)';e.target.style.background='rgba(59,130,246,0.06)'}}
        onBlur={e=>{e.target.style.border='1px solid rgba(255,255,255,0.08)';e.target.style.background='rgba(255,255,255,0.04)'}}
      />
    </div>
  )

  const btnPrimary = {
    background:'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    border:'1px solid rgba(59,130,246,0.4)',
    color:'white',
    padding:'11px 24px',
    borderRadius:'12px',
    fontSize:'14px',
    fontWeight:'600',
    cursor:'pointer',
    fontFamily:'inherit',
    display:'flex',
    alignItems:'center',
    gap:'8px',
    transition:'all 0.2s',
    letterSpacing:'0.01em',
  }

  const btnGhost = {
    background:'rgba(255,255,255,0.04)',
    border:'1px solid rgba(255,255,255,0.08)',
    color:'rgba(255,255,255,0.5)',
    padding:'11px 20px',
    borderRadius:'12px',
    fontSize:'14px',
    fontWeight:'500',
    cursor:'pointer',
    fontFamily:'inherit',
    transition:'all 0.2s',
  }

  const btnGreen = {
    background:'linear-gradient(135deg, #059669 0%, #047857 100%)',
    border:'1px solid rgba(5,150,105,0.4)',
    color:'white',
    padding:'11px 24px',
    borderRadius:'12px',
    fontSize:'14px',
    fontWeight:'600',
    cursor:'pointer',
    fontFamily:'inherit',
    display:'flex',
    alignItems:'center',
    gap:'8px',
    transition:'all 0.2s',
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg, #020c1b 0%, #041428 40%, #061c36 70%, #041020 100%)',padding:'0 0 60px 0'}}>

      {/* Background orbs */}
      <div style={{position:'fixed',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
        <div style={{position:'absolute',top:'-15%',left:'-8%',width:'700px',height:'700px',borderRadius:'50%',background:'radial-gradient(circle, rgba(30,64,175,0.18), transparent 65%)'}}/>
        <div style={{position:'absolute',bottom:'-10%',right:'-5%',width:'600px',height:'600px',borderRadius:'50%',background:'radial-gradient(circle, rgba(29,78,216,0.12), transparent 65%)'}}/>
        <div style={{position:'absolute',top:'45%',left:'55%',width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle, rgba(59,130,246,0.07), transparent 65%)'}}/>
      </div>

      <div style={{position:'relative',zIndex:1,maxWidth:'960px',margin:'0 auto',padding:'48px 32px 0'}}>

        {/* Header */}
        <div style={{marginBottom:'40px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'10px'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'12px',background:'linear-gradient(135deg, #3b82f6, #1d4ed8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',boxShadow:'0 8px 32px rgba(59,130,246,0.3)'}}>⚾</div>
            <div>
              <h1 style={{fontSize:'26px',fontWeight:'700',letterSpacing:'-0.02em',color:'white'}}>Tennis Recruiting Hub</h1>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.45)',marginTop:'2px',fontWeight:'400'}}>Fill in your profile · Generate personalised emails · Send to every coach</p>
            </div>
          </div>
        </div>

        {/* Tab Nav — glass pill */}
        <div style={{...glass, borderRadius:'20px', padding:'6px', display:'flex', gap:'4px', marginBottom:'28px', boxShadow:'0 8px 32px rgba(0,0,0,0.3)'}}>
          {TABS.map((t,i)=>(
            <button key={i} onClick={()=>setTab(i)} style={{
              flex:1,
              padding:'12px 8px',
              borderRadius:'14px',
              border: tab===i ? '1px solid rgba(59,130,246,0.35)' : '1px solid transparent',
              background: tab===i ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(29,78,216,0.15))' : 'transparent',
              color: tab===i ? '#93c5fd' : 'rgba(148,163,184,0.4)',
              fontSize:'12px',
              fontWeight: tab===i ? '600' : '400',
              cursor:'pointer',
              fontFamily:'inherit',
              transition:'all 0.2s',
              display:'flex',
              flexDirection:'column',
              alignItems:'center',
              gap:'4px',
              backdropFilter: tab===i ? 'blur(12px)' : 'none',
            }}>
              <span style={{fontSize:'9px',color:tab===i?'rgba(147,197,253,0.4)':'rgba(100,116,139,0.3)',fontWeight:'500',letterSpacing:'0.06em'}}>{String(i+1).padStart(2,'0')}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Main card */}
        <div style={{...glass, borderRadius:'24px', padding:'36px', boxShadow:'0 20px 60px rgba(0,0,0,0.4)'}}>

          {/* PROFILE */}
          {tab===0&&<>
            <div style={{marginBottom:'28px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',letterSpacing:'-0.01em',marginBottom:'6px'}}>Athlete profile</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)',fontWeight:'400'}}>Your personal information — automatically included in every email</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <Field id="name" label="Full name" placeholder="e.g. Amara Eddine" />
              <Field id="grad_year" label="Graduation year" placeholder="e.g. 2027" />
              <Field id="location" label="City / State" placeholder="e.g. Brooklyn, NY" />
              <Field id="gpa" label="GPA" placeholder="e.g. 3.9" />
              <Field id="sat" label="SAT / ACT" placeholder="e.g. 1550 SAT" />
              <Field id="major" label="Intended major" placeholder="e.g. Computer Science" />
              <Field id="high_school" label="Current school" placeholder="e.g. Millburn HS" />
              <Field id="academy" label="Club / Academy" placeholder="e.g. USTA Training Center" />
              <Field id="height" label="Height" placeholder="e.g. 6'1&quot;" />
              <div>
                <label style={{display:'block',fontSize:'11px',fontWeight:'600',color:'rgba(147,197,253,0.6)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>Dominant hand</label>
                <select style={{...inputStyle,colorScheme:'dark'}} value={athlete.hand||''} onChange={e=>set('hand',e.target.value)}>
                  <option value="" style={{background:'#061c36'}}>Select...</option>
                  <option style={{background:'#061c36'}}>Right-handed</option>
                  <option style={{background:'#061c36'}}>Left-handed</option>
                </select>
              </div>
              <Field id="phone" label="Phone number" placeholder="e.g. (201) 555-0123" />
              <Field id="email" label="Your email" placeholder="e.g. amara@email.com" />
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',marginTop:'28px'}}>
              <button style={btnPrimary} onClick={()=>setTab(1)}>Next: Tennis stats →</button>
            </div>
          </>}

          {/* TENNIS */}
          {tab===1&&<>
            <div style={{marginBottom:'28px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',letterSpacing:'-0.01em',marginBottom:'6px'}}>Tennis stats</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>The numbers and results coaches look at first</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <Field id="utr" label="UTR" placeholder="e.g. 10.8" />
              <Field id="wtn" label="WTN" placeholder="e.g. 14.2" />
              <Field id="singles" label="Singles record" placeholder="e.g. 38-12 (2024 season)" />
              <Field id="doubles" label="Doubles record" placeholder="e.g. 22-8" />
              <Field id="national_rank" label="National ranking" placeholder="e.g. #45 USTA 18s" />
              <Field id="sectional_rank" label="Sectional ranking" placeholder="e.g. #3 Eastern" />
              <TextArea id="notable_wins" label="Notable wins & tournament results" placeholder="e.g. Semifinalist at 2024 USTA National Clay Courts; defeated 3 players ranked top-20 nationally..." />
              <TextArea id="playing_style" label="Playing style — be specific" placeholder="e.g. Aggressive baseliner with heavy topspin forehand. Strong server who attacks short balls. Competes well in tight third sets..." />
              <TextArea id="strengths" label="Key strengths" placeholder="e.g. Consistency, first-serve percentage, two-handed backhand, mental toughness under pressure..." />
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:'28px'}}>
              <button style={btnGhost} onClick={()=>setTab(0)}>← Back</button>
              <button style={btnPrimary} onClick={()=>setTab(2)}>Next: Media →</button>
            </div>
          </>}

          {/* MEDIA */}
          {tab===2&&<>
            <div style={{marginBottom:'28px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',letterSpacing:'-0.01em',marginBottom:'6px'}}>Media & documents</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>Links that get included in every email you send to coaches</p>
            </div>
            <div style={{...glassBlue,borderRadius:'14px',padding:'14px 18px',marginBottom:'24px',fontSize:'13px',color:'rgba(147,197,253,0.7)'}}>
              Host your videos on YouTube or Vimeo and paste the links below. Coaches click directly from the email.
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <Field id="highlight_url" label="Highlight video URL ★" placeholder="https://youtube.com/watch?v=..." full />
              <Field id="match_url" label="Match footage URL" placeholder="https://youtube.com/..." />
              <Field id="resume_url" label="Resume / profile URL" placeholder="https://drive.google.com/..." />
              <TextArea id="tournaments" label="Upcoming tournaments" placeholder={"- June 14: USTA Sectional (NJ)\n- Aug 3-9: USTA Nationals (Kalamazoo, MI)"} />
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:'28px'}}>
              <button style={btnGhost} onClick={()=>setTab(1)}>← Back</button>
              <button style={btnPrimary} onClick={()=>setTab(3)}>Next: Generate →</button>
            </div>
          </>}

          {/* GENERATE */}
          {tab===3&&<>
            <div style={{marginBottom:'28px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',letterSpacing:'-0.01em',marginBottom:'6px'}}>Generate emails</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>{total.toLocaleString()} coaches in database — Claude writes a unique personalised email for each one</p>
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
              <div style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 1fr',padding:'12px 20px',background:'rgba(255,255,255,0.03)',fontSize:'11px',fontWeight:'600',color:'rgba(147,197,253,0.4)',textTransform:'uppercase',letterSpacing:'0.08em'}}>
                <div>School</div><div>Coach</div><div>Division</div><div>Status</div>
              </div>
              {coaches.map(c=>(
                <div key={c.id}
                  style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 1fr',padding:'14px 20px',borderTop:'1px solid rgba(255,255,255,0.04)',cursor:'pointer',transition:'background 0.15s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(59,130,246,0.06)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  onClick={()=>setSelectedCoach(selectedCoach?.id===c.id?null:c)}>
                  <div style={{fontSize:'14px',fontWeight:'500',color:'rgba(255,255,255,0.8)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingRight:'12px'}}>{c.school_name}</div>
                  <div style={{fontSize:'13px',color:'rgba(255,255,255,0.4)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingRight:'12px'}}>{c.coach_name}</div>
                  <div style={{fontSize:'12px',color:'rgba(147,197,253,0.35)'}}>{c.division}</div>
                  <div>
                    {c.email_generated
                      ?<span style={{fontSize:'11px',padding:'3px 10px',borderRadius:'20px',background:'rgba(74,222,128,0.1)',color:'#4ade80',border:'1px solid rgba(74,222,128,0.2)',fontWeight:'500'}}>Ready</span>
                      :<span style={{fontSize:'11px',padding:'3px 10px',borderRadius:'20px',background:'rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.25)'}}>Pending</span>}
                  </div>
                </div>
              ))}
            </div>
            {selectedCoach?.email_generated&&(
              <div style={{marginTop:'20px',borderRadius:'16px',overflow:'hidden',border:'1px solid rgba(59,130,246,0.2)'}}>
                <div style={{padding:'14px 20px',background:'rgba(59,130,246,0.08)',borderBottom:'1px solid rgba(59,130,246,0.15)'}}>
                  <div style={{fontSize:'14px',fontWeight:'500',color:'rgba(255,255,255,0.9)',marginBottom:'4px'}}>{selectedCoach.email_subject}</div>
                  <div style={{fontSize:'12px',color:'rgba(147,197,253,0.4)'}}>To: {selectedCoach.coach_name} &lt;{selectedCoach.email}&gt;</div>
                </div>
                <div style={{padding:'16px 20px',fontSize:'13px',color:'rgba(255,255,255,0.45)',lineHeight:'1.8',whiteSpace:'pre-wrap',maxHeight:'260px',overflowY:'auto'}}>{selectedCoach.email_body}</div>
              </div>
            )}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'20px'}}>
              <span style={{fontSize:'12px',color:'rgba(255,255,255,0.2)'}}>Page {page} — {coaches.length} of {total.toLocaleString()}</span>
              <div style={{display:'flex',gap:'8px'}}>
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{...btnGhost,padding:'8px 14px',fontSize:'12px',opacity:page===1?0.3:1}}>← Prev</button>
                <button onClick={()=>setPage(p=>p+1)} disabled={coaches.length<50} style={{...btnGhost,padding:'8px 14px',fontSize:'12px',opacity:coaches.length<50?0.3:1}}>Next →</button>
              </div>
            </div>
          </>}

          {/* SEND */}
          {tab===4&&<>
            <div style={{marginBottom:'28px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',letterSpacing:'-0.01em',marginBottom:'6px'}}>Send emails</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>Sends all generated emails in batches of 50 via Resend</p>
            </div>
            <div style={{background:'rgba(251,191,36,0.07)',border:'1px solid rgba(251,191,36,0.2)',borderRadius:'14px',padding:'14px 18px',fontSize:'13px',color:'rgba(251,191,36,0.75)',marginBottom:'24px'}}>
              Requires a Resend account with a verified sending domain. Free tier includes 3,000 emails/month.
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
              <div>
                <label style={{display:'block',fontSize:'11px',fontWeight:'600',color:'rgba(147,197,253,0.6)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>Your name</label>
                <input style={inputStyle} placeholder="e.g. Amara Eddine" value={fromName} onChange={e=>setFromName(e.target.value)}
                  onFocus={e=>{e.target.style.border='1px solid rgba(59,130,246,0.5)';e.target.style.background='rgba(59,130,246,0.06)'}}
                  onBlur={e=>{e.target.style.border='1px solid rgba(255,255,255,0.08)';e.target.style.background='rgba(255,255,255,0.04)'}}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:'11px',fontWeight:'600',color:'rgba(147,197,253,0.6)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>Send from email</label>
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

          {/* DASHBOARD */}
          {tab===5&&<>
            <div style={{marginBottom:'28px'}}>
              <h2 style={{fontSize:'18px',fontWeight:'600',letterSpacing:'-0.01em',marginBottom:'6px'}}>Dashboard</h2>
              <p style={{fontSize:'13px',color:'rgba(147,197,253,0.4)'}}>Live stats pulled directly from your Supabase database</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',marginBottom:'32px'}}>
              {[
                {label:'Total coaches',val:total,bg:'rgba(59,130,246,0.1)',border:'rgba(59,130,246,0.2)',color:'#93c5fd'},
                {label:'Emails generated',val:coaches.filter(c=>c.email_generated).length,bg:'rgba(74,222,128,0.08)',border:'rgba(74,222,128,0.2)',color:'#4ade80'},
                {label:'Emails sent',val:coaches.filter(c=>c.email_sent).length,bg:'rgba(168,85,247,0.08)',border:'rgba(168,85,247,0.2)',color:'#c084fc'},
              ].map((s,i)=>(
                <div key={i} style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:'20px',padding:'24px',textAlign:'center',backdropFilter:'blur(12px)'}}>
                  <div style={{fontSize:'36px',fontWeight:'700',color:s.color,letterSpacing:'-0.02em',lineHeight:1}}>{s.val.toLocaleString()}</div>
                  <div style={{fontSize:'12px',color:'rgba(255,255,255,0.3)',marginTop:'8px',fontWeight:'500'}}>{s.label}</div>
                </div>
              ))}
            </div>
            <button onClick={fetchCoaches} style={{...btnGhost,marginBottom:'20px'}}>Refresh stats</button>
            <div style={{borderRadius:'16px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.06)'}}>
              <div style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 1fr',padding:'12px 20px',background:'rgba(255,255,255,0.03)',fontSize:'11px',fontWeight:'600',color:'rgba(147,197,253,0.4)',textTransform:'uppercase',letterSpacing:'0.08em'}}>
                <div>School</div><div>Coach</div><div>Division</div><div>Status</div>
              </div>
              {coaches.slice(0,20).map(c=>(
                <div key={c.id} style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 1fr',padding:'14px 20px',borderTop:'1px solid rgba(255,255,255,0.04)'}}>
                  <div style={{fontSize:'14px',fontWeight:'500',color:'rgba(255,255,255,0.8)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingRight:'12px'}}>{c.school_name}</div>
                  <div style={{fontSize:'13px',color:'rgba(255,255,255,0.4)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',paddingRight:'12px'}}>{c.coach_name}</div>
                  <div style={{fontSize:'12px',color:'rgba(147,197,253,0.35)'}}>{c.division}</div>
                  <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                    {c.email_generated&&<span style={{fontSize:'11px',padding:'3px 10px',borderRadius:'20px',background:'rgba(74,222,128,0.1)',color:'#4ade80',border:'1px solid rgba(74,222,128,0.2)',fontWeight:'500'}}>Generated</span>}
                    {c.email_sent&&<span style={{fontSize:'11px',padding:'3px 10px',borderRadius:'20px',background:'rgba(168,85,247,0.1)',color:'#c084fc',border:'1px solid rgba(168,85,247,0.2)',fontWeight:'500'}}>Sent</span>}
                    {!c.email_generated&&<span style={{fontSize:'11px',padding:'3px 10px',borderRadius:'20px',background:'rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.25)'}}>Pending</span>}
                  </div>
                </div>
              ))}
            </div>
          </>}

        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}
