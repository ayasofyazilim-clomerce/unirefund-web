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
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import type {AccountServiceResource} from "src/language-data/core/AccountService";
import PersonalInformation from "./_components/personal-information";

export default function Profile({
  languageData,
  availableLocals,
  personalInformationData,
}: {
  languageData: SSRServiceResource;
  availableLocals: string[];
  personalInformationData: Volo_Abp_Account_ProfileDto;
}) {
  const router = useRouter();
  const [showQrCode, setShowQrCode] = React.useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = React.useState(false);
  const isMobile = useIsMobile();

  const getInitials = (name?: string, surname?: string) => {
    const firstInitial = name ? name[0].toUpperCase() : "";
    const lastInitial = surname ? surname[0].toUpperCase() : "";
    return firstInitial + (lastInitial || "");
  };
  const accountItems = [
    {
      icon: <User className="h-4 w-4" />,
      title: languageData.AccountInformation || "Account Information",
      description: languageData.ViewEditPersonalInfo || "View and edit your personal information",
      onClick: () => {
        router.push("/account/personal-information");
      },
    },
    {
      icon: <IdCard className="h-4 w-4" />,
      title: languageData.IdentityVerification || "Identity Verification",
      description: languageData.ManageTwoFactorAuth || "Manage your two-factor authentication settings",
      onClick: () => {
        router.push("profile/kyc");
      },
    },
    {
      icon: <KeyRound className="h-4 w-4" />,
      title: languageData.ChangePassword || "Change Password",
      description: languageData.UpdateAccountSecurity || "Update your account security",
      onClick: () => {
        router.push("/account/change-password");
      },
    },
    {
      icon: <Bell className="h-4 w-4" />,
      title: languageData.NotificationPreferences || "Notification Preferences",
      description: languageData.ManageNotificationSettings || "Manage your notification settings",
      onClick: () => {
        router.push("/notifications");
      },
    },
    {
      icon: <Shield className="h-4 w-4" />,
      title: languageData.SecuritySettings || "Security Settings",
      description: languageData.ConfigureAccountSecurity || "Configure your account security",
      onClick: () => {
        router.push("/account/security");
      },
    },
    {
      icon: <HelpCircle className="h-4 w-4" />,
      title: languageData.Support || "Support",
      description: languageData.GetHelpSupport || "Get help and support",
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
                  title={languageData.EditProfile || "Edit Profile"}
                  variant="ghost">
                  <Pencil className="h-5 w-5" />
                </Button>
                <Button
                  className="h-8 w-8 p-0 text-white transition-transform duration-200 hover:scale-110 hover:bg-transparent hover:text-white"
                  onClick={() => {
                    setShowQrCode(true);
                  }}
                  size="icon"
                  title={languageData.QRCode || "QR Code"}
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

          {/* Çıkış Yap butonu */}
          <Button
            className="flex w-full items-center justify-center gap-2"
            onClick={handleLogout}
            variant="destructive">
            <LogOut className="h-4 w-4" />
            {languageData.Logout || "Çıkış Yap"}
          </Button>
        </div>

        {/* Ayarlar Kartı */}
        <Card>
          <CardHeader>
            <CardTitle>{languageData.AccountManagement || "Account Management"}</CardTitle>
            <CardDescription>
              {languageData.ManageProfileAndPreferences || "Manage your profile and account preferences"}
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
            <CardTitle>{languageData.LanguagePreferences}</CardTitle>

            <CardDescription className="flex w-full items-center justify-between">
              {languageData.SelectLanguage}
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
              <DialogTitle>{languageData.ProfileQRCode || "Profile QR Code"}</DialogTitle>
              <DialogDescription>
                {languageData.ProfileQRCodeDescription || "You can quickly access your profile using this QR code."}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-6">
              <div className="flex h-64 w-64 items-center justify-center rounded-md border bg-gray-100">
                <span className="text-gray-500">{languageData.QRCode || "QR Code"}</span>
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
              <SheetTitle>{languageData.ProfileQRCode || "Profile QR Code"}</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto pb-8">
              <div className="flex flex-col items-center">
                <p className="mb-4 text-center text-sm text-gray-500">
                  {languageData.ProfileQRCodeDescription || "You can quickly access your profile using this QR code."}
                </p>
                <div className="flex h-64 w-64 items-center justify-center rounded-md border bg-gray-100">
                  <span className="text-gray-500">{languageData.QRCode || "QR Code"}</span>
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
              <DialogTitle>{languageData.EditProfile || "Kişisel Bilgiler"}</DialogTitle>
            </DialogHeader>
            <PersonalInformation
              languageData={languageData as unknown as AccountServiceResource}
              personalInformationData={personalInformationData}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Personal Information - Mobil için Sheet (Drawer) */}
      {isMobile ? (
        <Sheet onOpenChange={setShowPersonalInfo} open={showPersonalInfo}>
          <SheetContent className="h-[85vh] rounded-t-[20px]" side="bottom">
            <SheetHeader className="mb-4">
              <SheetTitle>{languageData.EditProfile || "Kişisel Bilgiler"}</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto pb-8">
              <PersonalInformation
                languageData={languageData as unknown as AccountServiceResource}
                personalInformationData={personalInformationData}
              />
            </div>
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  );
}
