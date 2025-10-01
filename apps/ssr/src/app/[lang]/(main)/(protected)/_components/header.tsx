"use client";

import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {cn} from "@/lib/utils";
import {NotificationPopover} from "@repo/ui/notification";
import LanguageSelector from "@repo/ui/theme/main-admin-layout/components/language-selector";
import {signOutServer} from "@repo/utils/auth";
import {Home, LogOut, MapPin, Menu, Tag, User, X} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useParams, usePathname} from "next/navigation";
import {useState} from "react";
import type {Volo_Abp_LanguageManagement_Dto_LanguageDto} from "@ayasofyazilim/saas/AdministrationService";
import Straight from "public/straight.png";
import unirefundLogo from "public/unirefund.png";
import type {SSRServiceResource} from "src/language-data/unirefund/SSRService";
import {getBaseLink} from "src/utils";

const navigationItems = [
  {
    name: "Home",
    href: "home",
    icon: Home,
  },
  {
    name: "Explore",
    href: "explore",
    icon: MapPin,
  },
  {
    name: "Profile",
    href: "profile",
    icon: User,
  },
];
type NovuProps = {
  appId: string;
  appUrl: string;
  subscriberId: string;
};

export default function Header({
  languageData,
  availableLocals,
  novu,
  languagesList,
}: {
  languageData: SSRServiceResource;
  availableLocals: string[];
  novu: NovuProps;
  languagesList: Volo_Abp_LanguageManagement_Dto_LanguageDto[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {lang} = useParams<{lang: string}>();
  const pathname = usePathname();
  const handleLogout = async () => {
    await signOutServer({redirectTo: getBaseLink("evidence-new-login/login-with-email", lang)});
  };

  return (
    <>
      {/* Masaüstü için mevcut header */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 hidden w-full border-b backdrop-blur md:block">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <Link className="flex items-center space-x-2" href={getBaseLink("home", lang)}>
            <Image alt="UniRefund Logo" height={32} priority src={unirefundLogo.src} width={140} />
          </Link>

          {/* Mobile menu button and language selector */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile language selector outside menu */}
            <LanguageSelector availableLocals={availableLocals} lang={lang} languagesList={languagesList} />

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
          <nav className="hidden md:flex md:items-center md:gap-4">
            {/* Explore button (desktop) */}

            <Link
              className="mr-2 flex items-center justify-center"
              href={getBaseLink("tags", lang)}
              title={languageData.Tags}>
              <p className="hover:text-primary flex items-center text-sm font-medium transition-colors">
                {languageData.Tags}
                <Tag className="ml-2 inline h-4 w-4" />
              </p>
            </Link>
            <Link
              className="mr-2 flex items-center justify-center"
              href={getBaseLink("explore", lang)}
              title={languageData.Explore}>
              <p className="hover:text-primary flex items-center text-sm font-medium transition-colors">
                {languageData.Explore}
                <MapPin className="ml-2 inline h-4 w-4" />
              </p>
            </Link>
            {/* LanguageSelector for desktop */}
            <LanguageSelector availableLocals={availableLocals} lang={lang} languagesList={languagesList} />
            <NotificationPopover
              appearance={{}}
              langugageData={languageData}
              popoverContentProps={{
                className: "h-[300px] max-h-[300px] max-w-[300px] rounded-lg",
              }}
              {...novu}
            />

            {/* Avatar with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="relative h-8 w-8 rounded-full" variant="ghost">
                  <Avatar className="border-primary rounded-full border-2">
                    <AvatarImage alt="Straight" src={Straight.src} />
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" forceMount>
                <DropdownMenuLabel>{languageData.MyAccount}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/profile" passHref>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>{languageData.Profile}</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuItem onSelect={() => void handleLogout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{languageData.Logout}</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Navigation */}
          {/* {isMenuOpen ? (
            <div className="absolute inset-x-0 top-16 z-50 origin-top-right transform p-2 transition md:hidden">
              <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-5 pb-6 pt-5">
                  <div className="flex flex-col space-y-4">
                    <div className="space-y-1">
                      <div className="px-2 text-sm font-semibold">{languageData.MyAccount}</div>
                      <div className="flex flex-col space-y-1">
                        <Link href="/profile" passHref>
                          <Button
                            className="w-full justify-start"
                            onClick={() => {
                              setIsMenuOpen(false);
                            }}
                            variant="ghost">
                            <User className="mr-2 h-4 w-4" />
                            <span>{languageData.Profile}</span>
                          </Button>
                        </Link>
                        <Button
                          className="w-full justify-start"
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleLogout();
                          }}
                          variant="ghost">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>{languageData.Logout}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null} */}
        </div>
      </header>

      {/* Mobil için alt tab navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-white md:hidden">
        {/* Home Tab */}
        {navigationItems.map((item) => {
          if (item.href === "explore") {
            return (
              <Link
                className="relative -mt-8 flex flex-col items-center justify-center"
                href={getBaseLink("explore", lang)}
                key={item.name}>
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-red-600 shadow-lg">
                  <item.icon className="h-8 w-8 text-white" />
                </span>
              </Link>
            );
          }
          const isActive = pathname.startsWith(getBaseLink(item.href.padStart(1), lang));
          return (
            <Link
              className={cn(
                "flex flex-1 flex-col items-center justify-center",
                isActive ? "text-primary" : "text-gray-700",
              )}
              href={getBaseLink(item.href, lang)}
              key={item.name}>
              <item.icon className="size-6" />
              <span className="text-xs">{languageData[item.name as keyof SSRServiceResource]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
