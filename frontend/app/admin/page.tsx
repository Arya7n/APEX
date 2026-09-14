import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
export const metadata: Metadata = { title: "Admin" };
export default function AdminPage() { return <><PageHeader index="SYS" label="Administration" title="Control room." description="Archive health, imports, and content operations." /><AdminDashboard /></>; }
