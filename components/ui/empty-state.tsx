import type { ReactNode } from "react"

interface EmptyStateProps {
	title: string
	description: string
	action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
	return (
		<div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-4 text-center">
			<div className="space-y-2">
				<h3 className="text-lg font-medium">{title}</h3>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
			{action}
		</div>
	)
} 