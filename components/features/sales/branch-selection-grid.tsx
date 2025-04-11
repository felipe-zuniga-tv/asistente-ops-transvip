import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfigCardContainer } from '@/components/ui/tables/config-card-container'
import { Building2 } from 'lucide-react'
import { cn } from '@/utils/ui'
import type { Branch } from '@/lib/core/types/admin'

interface BranchSelectionGridProps {
	branches: Branch[]
}

export function BranchSelectionGrid({ branches }: BranchSelectionGridProps) {
	// Sort branches: active first (alphabetically), then inactive (alphabetically)
	const sortedBranches = [...branches].sort((a, b) => {
		const aActive = a.sales_form_active && a.is_active;
		const bActive = b.sales_form_active && b.is_active;
		
		// If activation status is different, active comes first
		if (aActive !== bActive) return aActive ? -1 : 1;
		
		// If activation status is the same, sort alphabetically
		return a.name.localeCompare(b.name);
	});

	return (
		<ConfigCardContainer
			title="Respuestas de Formularios por Sucursal"
			className="w-full max-w-full mx-0"
		>
			<p className="text-muted-foreground text-sm -mt-2 mb-4">
				Selecciona una sucursal para ver las respuestas a los formularios de ventas
			</p>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{sortedBranches.map((branch) => {
					const isActive = branch.sales_form_active && branch.is_active

					return (
						<div key={branch.id} className={cn(
							'block transition-all',
							isActive ? 'hover:scale-[1.02] cursor-pointer' : 'opacity-60 cursor-not-allowed'
						)}>
							{isActive ? (
								<Link href={`/ventas/respuestas/${branch.code.toLowerCase()}`}>
									<Card className="h-full bg-gray-50 hover:bg-white/80 text-black border-transvip/50 transition-shadow duration-200">
										<CardHeader>
											<CardTitle className="text-center text-xl font-semibold flex flex-col items-center justify-center gap-2">
												<Building2 className="h-6 w-6" />
												{branch.name}
											</CardTitle>
										</CardHeader>
									</Card>
								</Link>
							) : (
								<Card className="h-full bg-gray-50 text-black border-gray-200 transition-shadow duration-200">
									<CardHeader>
										<CardTitle className="text-center text-xl font-semibold flex flex-col items-center justify-center gap-2">
											<Building2 className="h-6 w-6" />
											{branch.name}
										</CardTitle>
									</CardHeader>
								</Card>
							)}
						</div>
					)
				})}
			</div>

			{branches.length === 0 && (
				<div className="text-center py-8">
					<p className="text-muted-foreground">No hay sucursales disponibles</p>
				</div>
			)}
		</ConfigCardContainer>
	)
} 