import Link from "next/link";
import { HeaderLinks } from "@/utils/routes"

export default async function Navbar() {
	return (
		<nav className="grid items-start pl-4 gap-4 text-base font-medium lg:px-4">
			{
				HeaderLinks.map((item, index) =>
					<Link key={`${item.label}_${index + 1}`}
						href={item.href}
						className={'header-link'}>
						{item.label}
					</Link>
				)
			}
		</nav>
	)
}