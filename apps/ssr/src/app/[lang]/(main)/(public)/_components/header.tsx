"use client";

import Link from "next/link";
import Image from "next/image";
import {useState} from "react";
import {Menu, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useParams} from "next/navigation";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import unirefundLogo from "public/unirefund.png";
import {getBaseLink} from "src/utils";
import {useLocale} from "src/providers/locale";
import {getResourceDataClient} from "src/language-data/core/Default";

// Desteklenen diller
const languages = [
  {code: "en", name: "English", flag: "gb"},
  {code: "tr", name: "Türkçe", flag: "tr"},
  {code: "de", name: "Deutsch", flag: "de"},
  {code: "fr", name: "Français", flag: "fr"},
  {code: "es", name: "Español", flag: "es"},
  {code: "it", name: "Italiano", flag: "it"},
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const params = useParams();
  const lang = params.lang as string;
  const {changeLocale} = useLocale();

  // Dil verilerini doğrudan JSON dosyalarından al
  const languageData = getResourceDataClient(lang);

  // Güncel dil bilgisini al
  const currentLanguage = languages.find((l) => l.code === lang) || languages[0];

  // Dil değiştirme işlemi
  const handleLanguageChange = (languageCode: string) => {
    if (changeLocale) {
      changeLocale(languageCode);
    } else {
      // changeLocale mevcut değilse manuel olarak yönlendirme yap
      const pathParts = window.location.pathname.split("/").slice(2);
      const newPath = `/${languageCode}/${pathParts.join("/")}`;
      window.location.href = newPath;
    }
  };

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link className="flex items-center space-x-2" href={getBaseLink("", lang)}>
          <Image alt="UniRefund Logo" height={32} priority src={unirefundLogo.src} width={140} />
        </Link>

        {/* Mobile menu button */}
        <Button
          className="inline-flex items-center justify-center border-none p-2 text-gray-700 shadow-none md:hidden"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          variant="outline">
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-8">
          <Link
            className="text-foreground/60 hover:text-foreground text-sm font-medium transition-colors"
            href={`https://unirefund.com/${lang}/about-us`}>
            {languageData.About}
          </Link>
          <Link
            className="text-foreground/60 hover:text-foreground text-sm font-medium transition-colors"
            href={`https://unirefund.com/${lang}/shoppers`}>
            {languageData.Services}
          </Link>
          <Link
            className="text-foreground/60 hover:text-foreground text-sm font-medium transition-colors"
            href={`https://unirefund.com/${lang}/contact`}>
            {languageData.Contact}
          </Link>

          {/* Dil seçici dropdown (Desktop - en sağda) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="ml-4 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full"
                size="icon"
                variant="ghost">
                <img
                  alt={currentLanguage.name}
                  className="h-5 w-5 rounded-full object-cover"
                  src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/1x1/${currentLanguage.flag}.svg`}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((language) => (
                <DropdownMenuItem
                  className={`flex items-center gap-2 ${lang === language.code ? "bg-muted" : ""}`}
                  key={language.code}
                  onClick={() => {
                    handleLanguageChange(language.code);
                  }}>
                  <img
                    alt={language.name}
                    className="h-4 w-4 rounded-full"
                    src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/1x1/${language.flag}.svg`}
                  />
                  <span>{language.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen ? (
          <div className="absolute inset-x-0 top-16 z-50 origin-top-right transform p-2 transition md:hidden">
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex flex-col space-y-4">
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                    href={`https://unirefund.com/${lang}/about-us`}
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}>
                    {languageData.About}
                  </Link>
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                    href={`https://unirefund.com/${lang}/shoppers`}
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}>
                    {languageData.Services}
                  </Link>
                  <Link
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                    href={`https://unirefund.com/${lang}/contact`}
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}>
                    {languageData.Contact}
                  </Link>

                  {/* Mobil görünümde dil seçenekleri */}
                  <div className="border-t border-gray-100 pt-2">
                    <p className="mb-2 text-sm text-gray-500">{languageData.SelectLanguage}:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {languages.map((language) => (
                        <button
                          className={`flex items-center gap-1 rounded px-2 py-1 ${lang === language.code ? "bg-gray-100" : ""}`}
                          key={language.code}
                          onClick={() => {
                            handleLanguageChange(language.code);
                            setIsMenuOpen(false);
                          }}>
                          <img
                            alt={language.name}
                            className="h-4 w-4 rounded-full"
                            src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/1x1/${language.flag}.svg`}
                          />
                          <span className="text-sm">{language.code.toUpperCase()}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Mobil ekranda görünecek dil seçici (header'ın en sağında) */}
        {/* Bu dil seçiciyi gizliyoruz çünkü zaten mobil menü içinde var */}
        <div className="hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full"
                size="icon"
                variant="ghost">
                <img
                  alt={currentLanguage.name}
                  className="h-5 w-5 rounded-full object-cover"
                  src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/1x1/${currentLanguage.flag}.svg`}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((language) => (
                <DropdownMenuItem
                  className={`flex items-center gap-2 ${lang === language.code ? "bg-muted" : ""}`}
                  key={language.code}
                  onClick={() => {
                    handleLanguageChange(language.code);
                  }}>
                  <img
                    alt={language.name}
                    className="h-4 w-4 rounded-full"
                    src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/1x1/${language.flag}.svg`}
                  />
                  <span>{language.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
