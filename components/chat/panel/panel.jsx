import { TransvipOpsChat } from "../chat"

export function TransvipPanel({ id, session }) {
	return (
		<div className="border flex h-full w-full min-h-[50vh] flex-col rounded-xl bg-muted/50 max-w-4xl mx-auto p-2 md:p-3">
			<TransvipOpsChat id={id} session={session} />
		</div>
	)
}