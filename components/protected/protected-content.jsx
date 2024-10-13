import { getSession } from "@/lib/auth";
import { Routes } from "@/utils/routes";
import { redirect } from "next/navigation";

export default async function Protected({ children }) {
    const session = await getSession()
    const accessToken = session?.user?.accessToken
  
    if (!accessToken) {
      return redirect(Routes.LOGIN);
    }

    return <>{ children }</>
}
