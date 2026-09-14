import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ComingOnline } from "@/components/system/ComingOnline";

export const metadata: Metadata = {
  title: "Rankings",
};

export default function RankingsPage() {
  return (
    <>
      <PageHeader
        index="05"
        label="Rankings"
        title="Calculated, not curated."
        description="Fastest, lightest, most powerful — derived from MongoDB, never hardcoded."
      />
      <ComingOnline
        title="Rankings uncomputed"
        body="Dynamic ranking endpoints land in Phase 6. APEX will never hardcode a leaderboard."
      />
    </>
  );
}
