/*
 * app/page.tsx — the app's root route just forwards straight to the login screen.
 */
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/login");
}
