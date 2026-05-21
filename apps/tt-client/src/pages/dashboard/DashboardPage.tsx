import StatCard from '@/components/ui/card/StatCard';

import Grid from '@/components/layout/Grid';
import PageContainer from '@/components/layout/PageContainer';

export default function DashboardPage() {
  return (
    <PageContainer>
      <Grid>
        <StatCard
          title="Tournaments"
          value={12}
        />

        <StatCard
          title="Matches"
          value={124}
        />

        <StatCard
          title="Players"
          value={280}
        />

        <StatCard
          title="Members"
          value={1420}
        />
      </Grid>
    </PageContainer>
  );
}