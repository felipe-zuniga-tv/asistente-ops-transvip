import { redirect } from "next/navigation";
import { Routes } from "@/utils/routes";
import { getSession } from "@/lib/lib";

export default async function ProtectedRoute({ children }) {
  const session = await getSession()
  const accessToken = session?.user?.accessToken
  
  if (!accessToken) {
    return redirect(`${Routes.LOGIN}`);
  }
  return <>{children}</>;
}