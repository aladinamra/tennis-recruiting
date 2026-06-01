import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export async function POST(request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { fromEmail, fromName } = await request.json()

    const { data: coaches, error } = await supabase
      .from('coaches_database')
      .select('*')
      .eq('email_generated', true)
      .eq('email_sent', false)
      .limit(50)

    if (error) return Response.json({ error: error.message }, { status: 500 })

    const results = []
    for (const coach of coaches) {
      try {
        await resend.emails.send({
          from: `${fromName} <${fromEmail}>`,
          to: coach.email,
          subject: coach.email_subject,
          text: coach.email_body,
        })
        await supabase
          .from('coaches_database')
          .update({ email_sent: true, email_sent_at: new Date().toISOString() })
          .eq('id', coach.id)
        results.push({ id: coach.id, school: coach.school_name, success: true })
        await new Promise(r => setTimeout(r, 200))
      } catch(err) {
        results.push({ id: coach.id, school: coach.school_name, error: err.message, success: false })
      }
    }
    return Response.json({ results, sent: results.filter(r => r.success).length })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
