import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ComingOnline } from "@/components/system/ComingOnline";

export const metadata: Metadata = {
  title: "Garage",
};

export default function GaragePage() {
  return (
    <>
      <PageHeader
        index="07"
        label="Garage"
        title="A private archive."
        description="Dream, track, street. Authentication and persistence arrive in Phase 7."
      />
      <ComingOnline
        title="Doors locked"
        body="The garage requires accounts, favorites, and collections. Those systems are not online yet."
      />
    </>
  );
}
