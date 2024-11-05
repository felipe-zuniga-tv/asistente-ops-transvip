import LogoutButton from "@/components/auth/logout"
import { TransvipOpsChat } from "../chat"

export function TransvipPanel({ id, session }) {
	return (
		<div className="grid h-screen size-full bg-white">
			<div className="flex flex-col">
				<header className="sticky top-0 z-10 flex h-[56px] items-center gap-1 bg-background px-4">
					<div className="ml-auto flex gap-4 items-center">
						<LogoutButton className="ml-auto" />
					</div>
				</header>
				<div className="flex-1 overflow-auto p-0 md:p-3 md:pt-1">
					<div className="border flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50  max-w-5xl mx-auto p-2 md:p-3">
						<TransvipOpsChat id={id} session={session} />
					</div>
				</div>
			</div>
		</div>
	)
}