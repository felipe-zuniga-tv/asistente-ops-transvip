import React from 'react';
import { NavbarLinks } from '@/utils/routes';
import Link from 'next/link'; // Add this import
import { Button } from '@/components/ui/button';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <nav className="bg-gray-800 p-4">
                <ul className="flex space-x-4">
                    {NavbarLinks.map((link) => (
                        <li key={link.label}>
                            <Button asChild>
                                <Link href={link.href} className="text-white bg-slate-600 px-4 py-2 rounded-md">
                                    {link.label}
                                </Link>
                            </Button>
                        </li>
                    ))}
                </ul>
            </nav>
            <main>{children}</main>
        </div>
    );
};

export default Layout;