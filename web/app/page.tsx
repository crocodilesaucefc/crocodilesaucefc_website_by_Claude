import { Landing } from '@/components/landing/Landing';
import { MatchHub } from '@/components/match-hub/MatchHub';
import { getFixtures } from '@/lib/api-football';

export default async function Home() {
  // Server-side today in Vancouver — matches the client default locale.
  const todayIso = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Vancouver',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  const initialFixtures = await getFixtures({ date: todayIso }).catch(() => []);

  return (
    <Landing hub={<MatchHub initialFixtures={initialFixtures} initialDate={todayIso} />} />
  );
}
