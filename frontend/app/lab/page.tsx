import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { LabClient } from "@/components/lab/LabClient";

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
      <LabClient />
    </>
  );
}
