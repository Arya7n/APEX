import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
export const metadata: Metadata = { title: "Admin sign in" };
export default function AdminLoginPage() { return <AuthForm mode="login" admin />; }
