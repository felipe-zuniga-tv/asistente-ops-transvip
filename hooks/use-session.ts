import { useEffect, useState } from "react";
import { getSession } from "@/lib/core/auth";
import { JWTPayload } from "jose";

export function useSession() {
	const [session, setSession] = useState<JWTPayload | null>(null); // Update the type of session

	useEffect(() => {
		const fetchSession = async () => {
			const sessionData = await getSession();
			setSession(sessionData);
		};

		fetchSession();
	}, []);

	return session;
}
