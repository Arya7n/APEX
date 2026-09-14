import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ComingOnline } from "@/components/system/ComingOnline";

export const metadata: Metadata = {
  title: "Learn",
};

export default function LearnPage() {
  return (
    <>
      <PageHeader
        index="06"
        label="Learn"
        title="The language of machines."
        description="Horsepower, torque, winglets, ride-by-wire — editorial, not a wiki dump."
      />
      <ComingOnline
        title="Library sealed"
        body="Educational articles are planned for Phase 8, after the garage and recommendation engine."
      />
    </>
  );
}
