import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { MTTVehicleInfo } from "@/types/domain/mtt/types";

export function VehicleInfoCard({ result }: { result: MTTVehicleInfo }) {
	return (
		<Card className="w-full">
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">
						{result.licensePlate} · {result.details?.data.regulation || 'Sin Regulación'}
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				{result.details?.data && (
					<div className="grid grid-cols-1 gap-4">
						{/* Vehicle Info */}
						<div className="space-y-2">
							<div className="flex gap-2">
								<span className="text-sm font-medium text-muted-foreground">
									{result.details.displayLabels.serviceType}:
								</span>
								<span className="text-sm">{result.details.data.serviceType}</span>
							</div>
							<div className="flex gap-2">
								<span className="text-sm font-medium text-muted-foreground">
									{result.details.displayLabels.vehicleModel}:
								</span>
								<span className="text-sm">{result.details.data.vehicleModel}</span>
							</div>
							<div className="flex gap-2">
								<span className="text-sm font-medium text-muted-foreground">
									{result.details.displayLabels.manufacturingInfo}:
								</span>
								<span className="text-sm">{result.details.data.manufacturingInfo}</span>
							</div>
						</div>

						{/* Status Info */}
						<div className="space-y-2">
							<div className="flex gap-2">
								<div className="flex gap-1">
									<span className="text-sm font-medium text-muted-foreground">
										{result.details.displayLabels.region}:
									</span>
									<span className="text-sm">{result.details.data.region}</span>
								</div>
								<span>·</span>
								<div className="flex gap-1">
									<span className="text-sm font-medium text-muted-foreground">
										{result.details.displayLabels.vehicleStatus}:
									</span>
									<span className="text-sm">{result.details.data.vehicleStatus}</span>
								</div>
							</div>
						</div>

						{/* Service Info */}
						{(result.details.data.serviceStatus || result.details.data.serviceInfo || result.details.data.serviceFleet || result.details.data.responsible) && (
							<div className="space-y-2">
								{result.details.data.serviceStatus && (
									<div className="flex gap-2">
										<div className="flex gap-1">
											<span className="text-sm font-medium text-muted-foreground">
												{result.details.displayLabels.serviceStatus}:
											</span>
											<span className="text-sm">{result.details.data.serviceStatus}</span>
										</div>
										<span>·</span>
										<div className="flex gap-1">
											<span className="text-sm font-medium text-muted-foreground">
												{result.details.displayLabels.serviceInfo}:
											</span>
											<span className="text-sm">{result.details.data.serviceInfo}</span>
										</div>
										{Number(result.details.data.serviceFleet) > 0 && (
											<>
												<span>·</span>
												<div className="flex gap-1">
													<span className="text-sm font-medium text-muted-foreground">
														{result.details.displayLabels.serviceFleet}:
													</span>
													<span className="text-sm">{result.details.data.serviceFleet}</span>
												</div>
											</>
										)}
									</div>
								)}
								{result.details.data.responsible && (
									<div className="flex gap-2">
										<span className="text-sm font-medium text-muted-foreground">
											{result.details.displayLabels.responsible}:
										</span>
										<span className="text-sm">{result.details.data.responsible}</span>
									</div>
								)}
							</div>
						)}
					</div>
				)}
				{result.error && (
					<CardDescription className="text-red-600 mt-2">
						{result.error}
					</CardDescription>
				)}
			</CardContent>
		</Card>
	);
} 