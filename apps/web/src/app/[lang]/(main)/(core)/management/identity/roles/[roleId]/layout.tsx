"use server";
import {SidebarMenuButton} from "@/components/ui/sidebar";
import {getRoleDetailsByIdApi} from "@repo/actions/core/IdentityService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {isErrorOnRequest} from "@repo/utils/api";
import {ArrowLeft, KeyIcon} from "lucide-react";
import Link from "next/link";
import React from "react";
import {SidebarTemplate} from "@/components/sidebar-template";
import type {NavItem} from "@/components/sidebar-template";
import {getResourceData} from "@/language-data/core/IdentityService";
import {DeleteRoleDialog} from "./_components/delete-role";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {lang: string; roleId: string};
}) {
  const {lang, roleId} = params;
  const baseLink = `/${lang}/management/identity/roles/${roleId}`;
  const {languageData} = await getResourceData(lang);
  const roleDetailsResponse = await getRoleDetailsByIdApi(roleId);
  if (isErrorOnRequest(roleDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={roleDetailsResponse.message} />;
  }

  const nav: NavItem[] = [
    {
      id: "Details",
      action: `${baseLink}`,
      icon: "SquarePen",
      name: languageData["Role.Edit"],
      permissions: ["AbpAccount.SettingManagement"],
      condition: true,
    },
    {
      id: "AssignableRoles",
      icon: "Users",
      action: `${baseLink}/assignable-roles`,
      name: languageData["Role.Assignable"],
    },
    {id: "Claims", icon: "UserStar", action: `${baseLink}/claims`, name: languageData["Role.Claims"]},
    {
      id: "MoveAllUsers",
      icon: "UserPlus",
      action: `${baseLink}/move-all-users`,
      name: languageData["Role.MoveAllUsers"],
    },
    {id: "Permissions", icon: "UserCog", action: `${baseLink}/permissions`, name: languageData["Role.Permissions"]},
  ];

  const Header = (
    <>
      <SidebarMenuButton asChild tooltip={languageData.BackToList}>
        <Link className="flex rounded-md" data-testid="back-to-list" href={`/${lang}/management/identity/roles`}>
          <ArrowLeft className="size-4" />
          <span className="w-full truncate">{languageData.BackToList}</span>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuButton className="cursor-auto !bg-transparent" tooltip={roleDetailsResponse.data.name || ""}>
        <KeyIcon className="size-4" />
        <span className="w-full truncate font-bold capitalize">{roleDetailsResponse.data.name}</span>
      </SidebarMenuButton>
    </>
  );

  return (
    <SidebarTemplate footer={<DeleteRoleDialog languageData={languageData} />} header={Header} items={nav}>
      {children}
    </SidebarTemplate>
  );
}
