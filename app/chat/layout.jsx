import Protected from "@/components/protected/protected-content";
// import Header from "@/components/ui/navigation/header";

export default async function ChatLayout({ children }) {
    return (
        <Protected>
            <div className="flex min-h-screen w-full flex-col bg-buildings bg-cover bg-center overflow-auto">
                { children }
            </div>
        </Protected>
    )
}