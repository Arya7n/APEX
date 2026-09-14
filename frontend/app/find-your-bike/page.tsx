import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Questionnaire } from "@/components/recommendations/Questionnaire";

export const metadata: Metadata = { title: "Find your bike", description: "Match your riding profile to the APEX archive." };
export default function FindYourBikePage() {
  return <><PageHeader index="08" label="Recommendation engine" title="Find your machine." description="Five signals. A calculated match against every motorcycle in the archive." /><Questionnaire /></>;
}
