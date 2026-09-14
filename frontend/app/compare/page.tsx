import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ComingOnline } from "@/components/system/ComingOnline";

export const metadata: Metadata = {
  title: "Compare",
};

export default function ComparePage() {
  return (
    <>
      <PageHeader
        index="03"
        label="Compare"
        title="Measure difference."
        description="Two to four machines. Calculated deltas — never a manufactured conclusion."
      />
      <ComingOnline
        title="Comparison engine offline"
        body="The comparison API and radar charts arrive in Phase 6. Selection and animated deltas will live here."
      />
    </>
  );
}
