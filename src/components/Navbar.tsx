import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
    const pathName = usePathname()

    return (
        <nav className="bg-white border-gray-200 p-4 shadow">
            <ul className="flex space-x-5 justify-center items-center">
                <li><Link href="/" className={`p-1 px-3 rounded ${pathName == '/' && 'text-teal-600 font-semibold bg-gray-200'}`}>Home</Link></li>
                <li><Link href="/favorites" className={`p-1 px-3 rounded ${pathName == '/favorites' && 'text-teal-600 font-semibold bg-gray-200'}`}>Favorites</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
