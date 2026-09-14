import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ComingOnline } from "@/components/system/ComingOnline";

export const metadata: Metadata = {
  title: "Lab",
};

export default function LabPage() {
  return (
    <>
      <PageHeader
        index="04"
        label="Performance lab"
        title="Telemetry, not theatre."
        description="Visualize horsepower, mass, and ratio. Charts animate from APEX calculations."
      />
      <ComingOnline
        title="Lab instruments warming"
        body="Interactive analytics are scheduled for Phase 6, after the comparison engine is in place."
      />
    </>
  );
}
