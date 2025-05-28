"use client";
import React from "react";
import type {Volo_Abp_Account_ProfileDto} from "@ayasofyazilim/core-saas/AccountService";
import {useParams, useRouter} from "next/navigation";
import {Card, CardHeader, CardTitle, CardContent, CardDescription} from "@/components/ui/card";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {User, KeyRound, Bell, HelpCircle, LogOut, ChevronRight, QrCode, Shield, Pencil, IdCard} from "lucide-react";
import {signOutServer} from "@repo/utils/auth";
import LanguageSelector from "@repo/ui/theme/main-admin-layout/components/language-selector";
import {useIsMobile} from "@/components/hooks/useIsMobile";
import {QRCodeSVG} from "qrcode.react";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import type {AccountServiceResource} from "src/language-data/core/AccountService";
import unirefundLogo from "public/unirefund-logo.png";
import PersonalInformation from "./_components/personal-information";
import ChangePassword from "./_components/change-password";

export default function Profile({
  ssrLanguageData,
  accountLanguageData,
  availableLocals,
  personalInformationData,
}: {
  ssrLanguageData: SSRServiceResource;
  accountLanguageData: AccountServiceResource;
  availableLocals: string[];
  personalInformationData: Volo_Abp_Account_ProfileDto;
}) {
  const router = useRouter();
  const [showQrCode, setShowQrCode] = React.useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = React.useState(false);
  const [showChangePassword, setShowChangePassword] = React.useState(false);
  const isMobile = useIsMobile();

  const getInitials = (name?: string, surname?: string) => {
    const firstInitial = name ? name[0].toUpperCase() : "";
    const lastInitial = surname ? surname[0].toUpperCase() : "";
    return firstInitial + (lastInitial || "");
  };
  const accountItems = [
    {
      icon: <User className="h-4 w-4" />,
      title: ssrLanguageData.AccountInformation || "Account Information",
      description: ssrLanguageData.ViewEditPersonalInfo || "View and edit your personal information",
      onClick: () => {
        setShowPersonalInfo(true);
      },
    },
    {
      icon: <IdCard className="h-4 w-4" />,
      title: ssrLanguageData.IdentityVerification || "Identity Verification",
      description: ssrLanguageData.ManageTwoFactorAuth || "Manage your two-factor authentication settings",
      onClick: () => {
        router.push("profile/kyc");
      },
    },
    {
      icon: <KeyRound className="h-4 w-4" />,
      title: ssrLanguageData.ChangePassword || "Change Password",
      description: ssrLanguageData.UpdateAccountSecurity || "Update your account security",
      onClick: () => {
        setShowChangePassword(true);
      },
    },
    {
      icon: <Bell className="h-4 w-4" />,
      title: ssrLanguageData.NotificationPreferences || "Notification Preferences",
      description: ssrLanguageData.ManageNotificationSettings || "Manage your notification settings",
      onClick: () => {
        router.push("/notifications");
      },
    },
    {
      icon: <Shield className="h-4 w-4" />,
      title: ssrLanguageData.SecuritySettings || "Security Settings",
      description: ssrLanguageData.ConfigureAccountSecurity || "Configure your account security",
      onClick: () => {
        router.push("/account/security");
      },
    },
    {
      icon: <HelpCircle className="h-4 w-4" />,
      title: ssrLanguageData.Support || "Support",
      description: ssrLanguageData.GetHelpSupport || "Get help and support",
      onClick: () => {
        router.push("/support");
      },
    },
  ];

  const handleLogout = () => {
    void signOutServer();
  };

  const params = useParams();
  const lang = params.lang as string;

  return (
    <div className="mx-auto max-w-full py-4 md:container md:max-w-5xl md:px-4 md:py-8">
      <div className="grid gap-4 md:gap-8 lg:grid-cols-[300px_1fr]">
        {/* Profil Kartı */}
        <div className="space-y-6">
          <Card className="overflow-hidden ">
            <CardHeader className="relative bg-gradient-to-r from-red-500 to-red-600 p-0 text-white">
              <div className="absolute top-2 flex w-full justify-between px-2">
                <Button
                  className="h-8 w-8 p-0 text-white transition-transform duration-200 hover:scale-110 hover:bg-transparent hover:text-white"
                  onClick={() => {
                    setShowPersonalInfo(true);
                  }}
                  size="icon"
                  title={ssrLanguageData.EditProfile || "Edit Profile"}
                  variant="ghost">
                  <Pencil className="h-5 w-5" />
                </Button>
                <Button
                  className="h-8 w-8 p-0 text-white transition-transform duration-200 hover:scale-110 hover:bg-transparent hover:text-white"
                  onClick={() => {
                    setShowQrCode(true);
                  }}
                  size="icon"
                  title={ssrLanguageData.QRCode || "QR Code"}
                  variant="ghost">
                  <QrCode className="h-5 w-5" />
                </Button>
              </div>
              <div className="px-6 pb-12 pt-8" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="-mt-10 flex flex-col items-center">
                <Avatar className="h-20 w-20 border-4 border-white">
                  <AvatarFallback className="bg-red-500 text-lg text-white">
                    {getInitials(
                      personalInformationData.name ?? undefined,
                      personalInformationData.surname ?? undefined,
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-2 flex flex-col items-center space-y-2 text-center">
                  <h2 className="text-xl font-semibold">
                    {personalInformationData.name} {personalInformationData.surname}
                  </h2>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">@{personalInformationData.userName}</p>
                    <p className="text-sm text-gray-500">{personalInformationData.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Çıkış Yap butonu */}{" "}
          <Button
            className="flex w-full items-center justify-center gap-2"
            onClick={handleLogout}
            variant="destructive">
            <LogOut className="h-4 w-4" />
            {ssrLanguageData.Logout || "Çıkış Yap"}
          </Button>
        </div>

        {/* Ayarlar Kartı */}
        <Card>
          <CardHeader>
            <CardTitle>{ssrLanguageData.AccountManagement || "Account Management"}</CardTitle>
            <CardDescription>
              {ssrLanguageData.ManageProfileAndPreferences || "Manage your profile and account preferences"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {" "}
            <div>
              <div className="space-y-1 overflow-hidden">
                {accountItems.map((item, index) => (
                  <button
                    className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-gray-50"
                    key={index}
                    onClick={item.onClick}>
                    <div className="flex items-center space-x-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex md:hidden">
          <CardHeader className="w-full">
            <CardTitle>{ssrLanguageData.LanguagePreferences}</CardTitle>

            <CardDescription className="flex w-full items-center justify-between">
              {ssrLanguageData.SelectLanguage}
              <LanguageSelector availableLocals={availableLocals} lang={lang} />
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* QR Kod Dialog - Desktop için */}
      {!isMobile && (
        <Dialog onOpenChange={setShowQrCode} open={showQrCode}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{ssrLanguageData.ProfileQRCode || "Profile QR Code"}</DialogTitle>
              <DialogDescription>
                {ssrLanguageData.ProfileQRCodeDescription || "You can quickly access your profile using this QR code."}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-6">
              <div className="flex h-64 w-64 items-center justify-center ">
                <QRCodeSVG
                  bgColor="#ffffff"
                  className="h-full w-full"
                  fgColor="#000000"
                  imageSettings={{
                    src: unirefundLogo.src,
                    x: undefined,
                    y: undefined,
                    height: 48,
                    width: 48,
                    opacity: 1,
                    excavate: true,
                  }}
                  level="L"
                  size={256}
                  value={JSON.stringify(personalInformationData)}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* QR Kod Sheet - Mobil için */}
      {isMobile ? (
        <Sheet onOpenChange={setShowQrCode} open={showQrCode}>
          <SheetContent className="h-[85vh] rounded-t-[20px]" side="bottom">
            <SheetHeader className="mb-4">
              <SheetTitle>{ssrLanguageData.ProfileQRCode || "Profile QR Code"}</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto pb-8">
              <div className="flex flex-col items-center">
                <p className="mb-4 text-center text-sm text-gray-500">
                  {ssrLanguageData.ProfileQRCodeDescription ||
                    "You can quickly access your profile using this QR code."}
                </p>
                <div className="flex h-64 w-64 items-center justify-center ">
                  <QRCodeSVG
                    bgColor="#ffffff"
                    className="h-full w-full"
                    fgColor="#000000"
                    imageSettings={{
                      src: unirefundLogo.src,
                      x: undefined,
                      y: undefined,
                      height: 48,
                      width: 48,
                      opacity: 1,
                      excavate: true,
                    }}
                    level="L"
                    size={256}
                    value={JSON.stringify(personalInformationData)}
                  />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : null}

      {/* Personal Information - Desktop için Dialog */}
      {!isMobile && (
        <Dialog onOpenChange={setShowPersonalInfo} open={showPersonalInfo}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{ssrLanguageData.EditProfile || "Kişisel Bilgiler"}</DialogTitle>
            </DialogHeader>
            <PersonalInformation languageData={accountLanguageData} personalInformationData={personalInformationData} />
          </DialogContent>
        </Dialog>
      )}

      {/* Personal Information - Mobil için Sheet (Drawer) */}
      {isMobile ? (
        <Sheet onOpenChange={setShowPersonalInfo} open={showPersonalInfo}>
          <SheetContent className="h-[85vh] rounded-t-[20px]" side="bottom">
            <SheetHeader className="mb-4">
              <SheetTitle>{ssrLanguageData.EditProfile || "Kişisel Bilgiler"}</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto pb-8">
              <PersonalInformation
                languageData={accountLanguageData}
                personalInformationData={personalInformationData}
              />
            </div>
          </SheetContent>
        </Sheet>
      ) : null}

      {/* Change Password - Desktop için Dialog */}
      {!isMobile && (
        <Dialog onOpenChange={setShowChangePassword} open={showChangePassword}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{ssrLanguageData.ChangePassword || "Şifre Değiştir"}</DialogTitle>
            </DialogHeader>
            <ChangePassword languageData={accountLanguageData} />
          </DialogContent>
        </Dialog>
      )}

      {/* Change Password - Mobil için Sheet (Drawer) */}
      {isMobile ? (
        <Sheet onOpenChange={setShowChangePassword} open={showChangePassword}>
          <SheetContent className="h-[85vh] rounded-t-[20px]" side="bottom">
            <SheetHeader className="mb-4">
              <SheetTitle>{ssrLanguageData.ChangePassword || "Şifre Değiştir"}</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto pb-8">
              <ChangePassword languageData={accountLanguageData} />
            </div>
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  );
}
