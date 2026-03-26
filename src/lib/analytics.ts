import { createClient } from '@/lib/supabase/client'

export async function trackEvent(eventType: string, data?: Record<string, unknown>) {
  try {
    if (typeof window === 'undefined') return;
    
    const supabase = createClient()
    await supabase.from('analytics_events').insert({
      event_type: eventType,
      event_data: data || {},
      user_agent: window.navigator.userAgent,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    // Silently fail - analytics should never break the app
    console.debug('Analytics tracking skipped:', error)
  }
}
