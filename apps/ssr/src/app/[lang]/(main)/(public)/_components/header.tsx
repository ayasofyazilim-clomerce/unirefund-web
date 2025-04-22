"use client";

import Link from "next/link";
import Image from "next/image";
import {useState} from "react";
import {Menu, X} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link className="flex items-center space-x-2" href="/">
          <Image alt="UniRefund Logo" height={32} priority src="/unirefund.svg" width={140} />
        </Link>

        {/* Mobile menu button */}
        <button
          className="focus:ring-primary inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset md:hidden"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}>
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-8">
          <Link
            className="text-foreground/60 hover:text-foreground text-sm font-medium transition-colors"
            href="/about">
            About
          </Link>
          <Link
            className="text-foreground/60 hover:text-foreground text-sm font-medium transition-colors"
            href="/services">
            Services
          </Link>
          <Link
            className="text-foreground/60 hover:text-foreground text-sm font-medium transition-colors"
            href="/contact">
            Contact
          </Link>
          <Link
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
            href="/login">
            Login
          </Link>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen ? (
          <div className="absolute inset-x-0 top-16 z-50 origin-top-right transform p-2 transition md:hidden">
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex flex-col space-y-4">
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                    href="/about"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}>
                    About
                  </Link>
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                    href="/services"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}>
                    Services
                  </Link>
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                    href="/contact"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}>
                    Contact
                  </Link>
                  <Link
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-center text-sm font-medium"
                    href="/login"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}>
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
