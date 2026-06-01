import { createClient } from '@supabase/supabase-js'

export async function GET(request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 50
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from('coaches_database')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('school_name')

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ coaches: data, total: count, page, limit })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
