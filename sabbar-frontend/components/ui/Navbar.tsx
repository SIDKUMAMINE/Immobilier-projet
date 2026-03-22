'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          SABBAR
        </Link>
        <ul className="flex gap-6">
          <li>
            <Link href="/" className="hover:text-blue-200">
              Accueil
            </Link>
          </li>
          <li>
            <Link href="/properties" className="hover:text-blue-200">
              Annonces
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-blue-200">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}