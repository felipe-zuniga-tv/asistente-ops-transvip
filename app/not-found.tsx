"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Routes } from "@/utils/routes";

export default function NotFoundComponent() {
	const path = usePathname();

	return (
		<div className="bg-main bg-cover bg-top min-h-screen flex flex-col items-center justify-center px-4 md:px-0">
			<div className="p-24 rounded-xl text-lg bg-white/90 text-center gap-4 flex flex-col">
				<h1 className="text-xl font-semibold">¡Hola!</h1>
				<span className="text-lg font-normal">
					No pudimos encontrar la ruta {`"${path}"`}
				</span>
				<Link href={Routes.HOME}>
					<Button className="w-full bg-transvip hover:bg-transvip-dark py-4 text-lg h-12">
						<HomeIcon className="w-4 h-4" />
						Volver al inicio
					</Button>
				</Link>
			</div>
		</div>
	);
}