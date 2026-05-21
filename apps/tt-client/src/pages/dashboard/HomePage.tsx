import Button from '@/components/ui/button/Button';
import Card from '@/components/ui/card/Card';
import StatCard from '@/components/ui/card/StatCard';

import Grid from '@/components/layout/Grid';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import Section from '@/components/layout/Section';
import Stack from '@/components/layout/Stack';

export default function HomePage() {
  return (
    <PageContainer>
      <Stack>

        <Section>
          <PageHeader
            title="Dashboard"
            subtitle="Manage tournaments"
            action={
              <Button>
                Create Tournament
              </Button>
            }
          />
        </Section>

        <Section>
          <Grid>
            <StatCard
              title="Players"
              value={120}
            />

            <StatCard
              title="Matches"
              value={54}
            />

            <StatCard
              title="Tournaments"
              value={9}
            />

            <StatCard
              title="Audience"
              value={1024}
            />
          </Grid>
        </Section>

        <Section>
          <Card>
            Recent tournaments
          </Card>
        </Section>

      </Stack>
    </PageContainer>
  );
}