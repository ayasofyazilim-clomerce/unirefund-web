"use client";

import Link from "next/link";
import Image from "next/image";
import {useState} from "react";
import {Menu, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useParams} from "next/navigation";
import LanguageSelector from "@repo/ui/theme/main-admin-layout/components/language-selector";
import unirefundLogo from "public/unirefund.png";
import {getBaseLink} from "src/utils";
import type {SSRServiceResource} from "src/language-data/unirefund/SSRService";

export default function Header({
  languageData,
  availableLocals,
}: {
  languageData: SSRServiceResource;
  availableLocals: string[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const params = useParams();
  const lang = params.lang as string;

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link className="flex items-center space-x-2" href={getBaseLink("", lang)}>
          <Image alt="UniRefund Logo" height={32} priority src={unirefundLogo.src} width={140} />
        </Link>

        {/* Mobile menu button and language selector */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Mobile language selector outside menu */}
          <LanguageSelector availableLocals={availableLocals} lang={lang} />

          <Button
            className="inline-flex items-center justify-center border-none p-2 text-gray-700 shadow-none"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            variant="outline">
            <span className="sr-only">{languageData.OpenMainMenu}</span>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-8">
          <Link
            className="text-foreground/60 hover:text-foreground text-sm font-medium transition-colors"
            href="https://unirefund.com/about-us">
            {languageData.About}
          </Link>
          <Link
            className="text-foreground/60 hover:text-foreground text-sm font-medium transition-colors"
            href="https://unirefund.com/shoppers">
            {languageData.Services}
          </Link>
          <Link
            className="text-foreground/60 hover:text-foreground text-sm font-medium transition-colors"
            href="https://unirefund.com//contact">
            {languageData.Contact}
          </Link>

          {/* LanguageSelector for desktop (far right) */}
          <div className="ml-4">
            <LanguageSelector availableLocals={availableLocals} lang={lang} />
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen ? (
          <div className="absolute inset-x-0 top-16 z-50 origin-top-right transform p-2 transition md:hidden">
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex flex-col space-y-4">
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                    href="https://unirefund.com/about-us"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}>
                    {languageData.About}
                  </Link>
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                    href="https://unirefund.com/shoppers"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}>
                    {languageData.Services}
                  </Link>
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                    href="https://unirefund.com/contact"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}>
                    {languageData.Contact}
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
