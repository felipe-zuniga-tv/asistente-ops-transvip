import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Routes } from "@/utils/routes";
import Link from "next/link";

export default function SeguridadPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Módulo de Seguridad</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Gestione las habilitaciones de conductores, móviles y sus asignaciones para garantizar el cumplimiento y la seguridad operacional.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href={Routes.SEGURIDAD.CONDUCTORES} passHref>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Conductores</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Administrar habilitaciones y datos de conductores.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href={Routes.SEGURIDAD.VEHICULOS} passHref>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Móviles</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Administrar habilitaciones y datos de móviles.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href={Routes.SEGURIDAD.ASIGNACIONES} passHref>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Asignaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Gestionar las asignaciones entre conductores y móviles.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href={Routes.SEGURIDAD.RESUMEN} passHref>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Resumen General</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Visualizar el estado consolidado de habilitaciones y asignaciones.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
} 