import { createClient } from '@/lib/supabase/server';
import UserDayDetailView from './client-view';

export default async function UserDayDetailPage({
  params,
}: {
  params: Promise<{ monthId: string; day: string }>;
}) {
  const { monthId: monthIdStr, day: dayStr } = await params;
  const monthId = Number(monthIdStr);
  const day = Number(dayStr);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>No autenticado</div>; // O redirigir
  }

  // Fetch initial completion status
  const { data: progress } = await supabase
    .from('user_progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('month_id', monthId)
    .eq('day_number', day)
    .single();

  const isCompleted = !!progress;

  return (
    <UserDayDetailView
      monthId={monthId}
      day={day}
      initialIsCompleted={isCompleted}
    />
  );
}
