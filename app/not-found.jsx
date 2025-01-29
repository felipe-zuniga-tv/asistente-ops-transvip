"use client";

import { Button } from "@/components/ui/button";
import { Routes } from "@/utils/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFoundComponent() {
  const path = usePathname();

  return (
    <main className="bg-main min-h-screen flex flex-col items-center justify-center">
        <div className="p-24 rounded-xl text-lg bg-white/90 text-center gap-4 flex flex-col">
        <span className="text-xl font-semibold">¡Hola!</span>
            <span className="text-lg font-normal">No pudimos encontrar la ruta {`"${path}"`}</span>
            <Button className="bg-transvip hover:bg-transvip-dark py-4 text-lg h-12 mt-4">
                <Link href={Routes.HOME}className="text-white">
                    Inicio
                </Link>
            </Button>
        </div>
    </main>
  );
}