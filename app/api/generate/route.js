import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const { athlete, coachIds } = await request.json()

    let query = supabase.from('coaches_database').select('*')
    if (coachIds && coachIds.length > 0) {
      query = query.in('id', coachIds)
    } else {
      query = query.eq('email_generated', false)
    }
    const { data: coaches, error } = await query.limit(100)
    if (error) return Response.json({ error: error.message }, { status: 500 })

    const results = []
    for (const coach of coaches) {
      try {
        const lastName = coach.coach_name?.trim().split(' ').pop() || 'Coach'
        const prompt = `Write a personalized college tennis recruiting email FROM an athlete TO a college coach.

ATHLETE:
Name: ${athlete.name} | Grad: ${athlete.grad_year} | From: ${athlete.location}
GPA: ${athlete.gpa}${athlete.sat ? ', ' + athlete.sat : ''} | Major: ${athlete.major}
School: ${athlete.high_school} | Academy: ${athlete.academy}
Height: ${athlete.height} | ${athlete.hand}
UTR: ${athlete.utr}${athlete.wtn ? ' | WTN: ' + athlete.wtn : ''}
Singles: ${athlete.singles} | Doubles: ${athlete.doubles}
National: ${athlete.national_rank} | Sectional: ${athlete.sectional_rank}
Notable results: ${athlete.notable_wins}
Playing style: ${athlete.playing_style}
Strengths: ${athlete.strengths}
Highlight video: ${athlete.highlight_url}${athlete.match_url ? '\nMatch footage: ' + athlete.match_url : ''}${athlete.resume_url ? '\nResume: ' + athlete.resume_url : ''}
Tournaments: ${athlete.tournaments}

TARGET:
School: ${coach.school_name} | Division: ${coach.division}
Coach: ${coach.coach_name} | Role: ${coach.notes}

OUTPUT FORMAT:
SUBJECT: [subject line]

[email body]

RULES:
- Address as: Coach ${lastName}
- Be specific about why this school fits
- Include media links naturally
- 200-250 words body
- End with: ${athlete.name}, ${athlete.phone}, ${athlete.email}
- No filler phrases`

        const message = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 800,
          messages: [{ role: 'user', content: prompt }],
        })

        const text = message.content[0].text
        const lines = text.trim().split('\n')
        let subject = '', body = ''
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('SUBJECT:')) {
            subject = lines[i].replace('SUBJECT:', '').trim()
            body = lines.slice(i + 2).join('\n').trim()
            break
          }
        }
        if (!subject) {
          subject = `${athlete.grad_year} | UTR ${athlete.utr} | ${coach.school_name}`
          body = text.trim()
        }

        await supabase
          .from('coaches_database')
          .update({ email_subject: subject, email_body: body, email_generated: true })
          .eq('id', coach.id)

        results.push({ id: coach.id, school: coach.school_name, success: true })
      } catch(err) {
        results.push({ id: coach.id, school: coach.school_name, error: err.message, success: false })
      }
    }
    return Response.json({ results, generated: results.filter(r => r.success).length })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
