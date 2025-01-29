"use client";

import { Button } from "@/components/ui/button";
import { Routes } from "@/utils/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFoundComponent(): JSX.Element {
  const path = usePathname();

  return (
    <main className="bg-main min-h-screen flex flex-col items-center justify-center">
      <div className="p-24 rounded-xl text-lg bg-white/90 text-center gap-4 flex flex-col">
        <h1 className="text-xl font-semibold">¡Hola!</h1>
        <p className="text-lg font-normal">
          No pudimos encontrar la ruta {`"${path}"`}
        </p>
        <Link href={Routes.HOME} className="mt-4">
          <Button className="w-full bg-transvip hover:bg-transvip-dark py-4 text-lg h-12">
            Inicio
          </Button>
        </Link>
      </div>
    </main>
  );
}