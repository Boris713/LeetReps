import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

export async function dbLoad(key, fallback) {
  try {
    const { data, error } = await supabase
      .from('app_state')
      .select('value')
      .eq('key', key)
      .maybeSingle()
    if (error || !data) return fallback
    return data.value
  } catch {
    return fallback
  }
}

export async function dbSave(key, value) {
  try {
    await supabase
      .from('app_state')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  } catch { /* ignore — next save will retry */ }
}
