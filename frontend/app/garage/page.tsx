import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { GarageClient } from "@/components/garage/GarageClient";

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
        description="Dream, track, street. Your private collection of machines."
      />
      <GarageClient />
    </>
  );
}
