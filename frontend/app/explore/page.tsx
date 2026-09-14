import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ComingOnline } from "@/components/system/ComingOnline";

export const metadata: Metadata = {
  title: "Explore",
};

export default function ExplorePage() {
  return (
    <>
      <PageHeader
        index="02"
        label="Explore"
        title="The archive."
        description="Search, filter, and inspect every machine in APEX. Filters connect to the backend in Phase 4."
      />
      <ComingOnline
        title="Indexing machines"
        body="The explore chamber will read from MongoDB with URL-driven filters. The homepage currently uses a temporary featured set."
      />
    </>
  );
}
