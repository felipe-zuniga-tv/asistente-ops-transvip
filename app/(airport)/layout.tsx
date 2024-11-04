import { getSession } from "@/lib/auth";
import { Session } from "@/lib/chat/types";
import { Routes } from "@/utils/routes";
import { redirect } from "next/navigation";

export default async function AirportLayout({ children } : { children : React.ReactNode }) {
    const session = await getSession() as unknown;
	const accessToken = (session as Session)?.user?.accessToken || null;

	if (!accessToken) {
		return redirect(Routes.LOGIN);
	}

    return <>{ children } </>
}