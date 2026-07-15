import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("wv-admin-session");

  if (sessionToken) {
    redirect("/admin/dashboard");
  } else {
    redirect("/admin/login");
  }
}
