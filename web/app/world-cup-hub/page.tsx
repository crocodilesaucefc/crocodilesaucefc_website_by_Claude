import { MatchHub } from '@/components/match-hub/MatchHub';
import { getFixtures } from '@/lib/api-football';

export const metadata = {
  title: 'Match Hub — CrocodileSauce F.C.',
};

export default async function WorldCupHubPage() {
  // Server-side today in Vancouver — matches the client default locale.
  const todayIso = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Vancouver',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  const initialFixtures = await getFixtures({ date: todayIso }).catch(() => []);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--surface-bg)',
        backgroundAttachment: 'fixed',
        paddingTop: '2rem',
        paddingBottom: '2rem',
      }}
    >
      <MatchHub initialFixtures={initialFixtures} initialDate={todayIso} />
    </main>
  );
}
