import { TransvipOpsChat } from "@/components/chat/chat";
import { TransvipPanel } from "@/components/chat/panel/panel";
import SidebarList from "@/components/ui/side-list";
import { AI } from "@/lib/chat/actions";
import { getSession } from "@/lib/lib";
import { nanoid } from "@/lib/utils";

export const metadata = {
  title: 'Transvip - Tu asistente'
}

export default async function TransvipChat() {
  const id = nanoid()
  const session = await getSession()

  return (
    <div className="min-h-screen px-0 flex flex-col gap-4 items-center">
      <AI initialAIState={{ chatId: id, interactions: [], messages: [] }}>
        <TransvipPanel id={id} session={session} />
      </AI>
    </div>
    // <div className="min-h-screen px-2 flex flex-col gap-4 items-center">
    //   <AI initialAIState={{ chatId: id, interactions: [], messages: [] }}>
    //     <TransvipOpsChat id={id} session={session} />
    //   </AI>
    // </div>
  );
}
