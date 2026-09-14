import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { CompareClient } from "@/components/compare/CompareClient";

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
      <CompareClient />
    </>
  );
}
