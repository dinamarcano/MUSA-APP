// supabaseRealtime.ts
import supabase  from '../supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function subscribePosts(
  handler: (event: { type: 'INSERT' | 'UPDATE' | 'DELETE'; new?: any; old?: any }) => void,
): RealtimeChannel {
  const channel = supabase
    .channel('realtime-posts')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'posts' },
      payload => {
        if (payload.eventType === 'INSERT') {
          handler({ type: 'INSERT', new: payload.new });
        } else if (payload.eventType === 'UPDATE') {
          handler({ type: 'UPDATE', new: payload.new, old: payload.old });
        } else if (payload.eventType === 'DELETE') {
          handler({ type: 'DELETE', old: payload.old });
        }
      },
    )
    .subscribe();

  return channel;
}
