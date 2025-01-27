"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  PagedResultDto_IdentityRoleDto,
  PagedResultDto_IdentityUserDto,
  PagedResultDto_OrganizationUnitWithDetailsDto,
  Volo_Abp_Identity_IdentityRoleDto,
  Volo_Abp_Identity_IdentityUserDto,
  Volo_Abp_Identity_OrganizationUnitWithDetailsDto,
} from "@ayasofyazilim/saas/IdentityService";
import {
  $Volo_Abp_Identity_OrganizationUnitCreateDto,
  $Volo_Abp_Identity_OrganizationUnitUpdateDto,
} from "@ayasofyazilim/saas/IdentityService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type { TableActionCustomDialog } from "@repo/ayasofyazilim-ui/molecules/dialog";
import {
  default as AutoformDialog,
  default as CustomTableActionDialog,
} from "@repo/ayasofyazilim-ui/molecules/dialog";
import { TreeView } from "@repo/ayasofyazilim-ui/molecules/tree-view";
import { SectionNavbarBase } from "@repo/ayasofyazilim-ui/templates/section-layout";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { TreeViewElement } from "node_modules/@repo/ayasofyazilim-ui/src/molecules/tree-view/tree-view-api";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  handleDeleteResponse,
  handlePostResponse,
  handlePutResponse,
} from "src/actions/core/api-utils-client";
import {
  getOrganizationUnitsByIdMembersApi,
  getOrganizationUnitsByIdRolesApi,
} from "src/actions/core/IdentityService/actions";
import {
  deleteOrganizationUnitsApi,
  deleteOrganizationUnitsByIdMembersByMemberIdApi,
  deleteOrganizationUnitsByIdRolesByRoleIdApi,
} from "src/actions/core/IdentityService/delete-actions";
import { postOrganizationUnitsApi } from "src/actions/core/IdentityService/post-actions";
import {
  putOrganizationUnitsByIdApi,
  putOrganizationUnitsByIdMoveAllUsersApi,
} from "src/actions/core/IdentityService/put-actions";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";
import OrganizationRolesTable from "./_components/roles/table";
import OrganizationUsersTable from "./_components/users/table";

function getChildrens(
  parentId: string,
  data: Volo_Abp_Identity_OrganizationUnitWithDetailsDto[],
) {
  const childrens: TreeViewElement[] = [];
  data
    .filter((i) => i.parentId === parentId)
    .forEach((i) => {
      const childData: TreeViewElement = {
        id: i.id || "",
        name: i.displayName || "",
        children: [],
        isSelectable: true,
      };
      childData.children = getChildrens(i.id || "", data);
      childrens.push(childData);
    });
  return childrens;
}

export default function OrganizationComponent({
  languageData,
  organizationUnitList,
  userList,
  roleList,
}: {
  languageData: IdentityServiceResource;
  organizationUnitList: PagedResultDto_OrganizationUnitWithDetailsDto;
  userList: PagedResultDto_IdentityUserDto;
  roleList: PagedResultDto_IdentityRoleDto;
}) {
  const initializeOrganizationTree = () => {
    const parentUnits =
      organizationUnitList.items?.filter((i) => !i.parentId) || [];
    return parentUnits.map((parent) => ({
      id: parent.id || "",
      name: parent.displayName || "",
      children: getChildrens(parent.id || "", organizationUnitList.items || []),
      isSelectable: true,
    }));
  };
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | undefined>();
  const [triggerData, setTriggerData] = useState<
    Record<string, string> | undefined
  >(undefined);
  const [organizationUnits, setOrganizationUnits] = useState<
    Volo_Abp_Identity_OrganizationUnitWithDetailsDto[]
  >(organizationUnitList.items || []);
  const [action, setAction] = useState<TableActionCustomDialog | undefined>(
    undefined,
  );
  const [unitUsers, setUnitUsers] = useState<
    Volo_Abp_Identity_IdentityUserDto[]
  >([]);
  const [unitRoles, setUnitRoles] = useState<
    Volo_Abp_Identity_IdentityRoleDto[]
  >([]);
  const [activeTab, setActiveTab] = useState("Users");
  const [openUsersDialog, setOpenUsersDialog] = useState(false);
  const [openRolesDialog, setOpenRolesDialog] = useState(false);
  const organizationName = organizationUnits.find(
    (i) => i.id === selectedUnitId,
  )?.displayName;

  function getUnitUsers() {
    void getOrganizationUnitsByIdMembersApi({
      id: selectedUnitId || "",
    }).then((res) => {
      if (res.type === "success") {
        setUnitUsers(res.data.items || []);
      }
    });
  }

  function getUnitRoles() {
    void getOrganizationUnitsByIdRolesApi({
      id: selectedUnitId || "",
    }).then((res) => {
      if (res.type === "success") {
        setUnitRoles(res.data.items || []);
      }
    });
  }

  useEffect(() => {
    getUnitUsers();
    getUnitRoles();
  }, [selectedUnitId]);

  const handleAddUnit = (parentUnitId: string | null) => {
    const selectedUnit = parentUnitId
      ? organizationUnits.find((i) => i.id === parentUnitId)
      : null;
    setAction({
      type: "Dialog",
      componentType: "Autoform",
      cta: languageData["Organization.New"],
      description: selectedUnit
        ? `${languageData["Organization.Parent"]}: ${selectedUnit.displayName}`
        : languageData["Organization.New.Description"],
      autoFormArgs: {
        formSchema: createZodObject(
          $Volo_Abp_Identity_OrganizationUnitCreateDto,
          ["displayName"],
        ),
        fieldConfig: {
          all: {
            withoutBorder: true,
          },
        },
      },
      callback: (e: { displayName: string }, _triggerData) => {
        void postOrganizationUnitsApi({
          requestBody: {
            displayName: e.displayName,
            parentId: parentUnitId,
          },
        }).then((res) => {
          handlePostResponse(res, router);
          if (res.type === "success") {
            setOrganizationUnits([...organizationUnits, res.data]);
            setTriggerData({});
            setOpen(false);
          }
        });
      },
    });
    setTriggerData({ id: parentUnitId || "" });
    setOpen(true);
  };

  const handleEditUnit = () => {
    setAction({
      type: "Dialog",
      componentType: "Autoform",
      cta: languageData["Organization.Edit"],
      description: languageData["Organization.Edit.Description"],
      autoFormArgs: {
        formSchema: createZodObject(
          $Volo_Abp_Identity_OrganizationUnitUpdateDto,
          ["displayName"],
        ),
        fieldConfig: {
          all: {
            withoutBorder: true,
          },
        },
      },
      callback: (e: { displayName: string }, _triggerData) => {
        void putOrganizationUnitsByIdApi({
          id: selectedUnitId || "",
          requestBody: {
            displayName: e.displayName,
          },
        }).then((res) => {
          handlePutResponse(res, router);
          if (res.type === "success") {
            const newOrganizationUnits = organizationUnits.map((i) => {
              if (i.id === selectedUnitId) {
                return {
                  ...i,
                  displayName: e.displayName,
                };
              }
              return i;
            });
            setOrganizationUnits(newOrganizationUnits);
            setSelectedUnitId(selectedUnitId);
            setTriggerData({});
            setOpen(false);
          }
        });
      },
    });
    setTriggerData({
      displayName: organizationName || "",
      id: selectedUnitId || "",
    });
    setOpen(true);
  };

  const handleDeleteUnit = (unitId: string) => {
    void deleteOrganizationUnitsApi(unitId || "").then((res) => {
      handleDeleteResponse(res, router);
      if (res.type === "success") {
        const updatedUnits = organizationUnits.filter(
          (unit) => unit.id !== unitId,
        );
        setOrganizationUnits(updatedUnits);
        setSelectedUnitId(undefined);
      }
    });
  };

  const handleMoveAllUsers = () => {
    if (unitUsers.length === 0) {
      toast.warning(languageData["Organization.User.Empty"]);
      return;
    }
    const availableUnits = organizationUnits.filter(
      (u) => u.id !== selectedUnitId,
    );
    const unitOptions = availableUnits.map((unit) => {
      const parentUnit = organizationUnits.find((u) => u.id === unit.parentId);
      return {
        id: unit.id,
        displayName: unit.displayName,
        parentName: parentUnit ? parentUnit.displayName : "",
      };
    });
    if (unitOptions.length === 0) {
      toast.warning(languageData["Organization.Empty"]);
      return;
    }
    const selectedUnit = organizationUnits.find((i) => i.id === selectedUnitId);
    const placeholder = languageData["Organization.Select"];
    const DynamicEnum = z.enum([
      placeholder,
      ...unitOptions.map(
        (u) =>
          `${u.displayName} ${u.parentName ? `${languageData["Organization.Parent"]}: ${u.parentName}` : ""}`,
      ),
    ]);
    setTriggerData({
      displayName: selectedUnit?.displayName || "",
      id: selectedUnitId || "",
    });
    setAction({
      type: "Dialog",
      componentType: "Autoform",
      cta: languageData["Organization.Move.Users"],
      description: `${languageData["Organization.Move.Users.Description"]} ${organizationName}:`,
      autoFormArgs: {
        formSchema: z.object({
          targetUnit: DynamicEnum.default(placeholder),
        }),
        fieldConfig: {
          all: { withoutBorder: true },
        },
      },
      callback: (
        e: { targetUnit: string; displayName: string },
        _triggerData,
      ) => {
        const _selectedUnit = unitOptions.find(
          (u) =>
            `${u.displayName} ${
              u.parentName
                ? `${languageData["Organization.Parent"]}: ${u.parentName}`
                : ""
            }` === e.targetUnit,
        );
        if (!_selectedUnit) {
          toast.warning(languageData["Organization.Select.Fail"]);
          return false;
        }
        void putOrganizationUnitsByIdMoveAllUsersApi({
          id: selectedUnitId || "",
          organizationId: _selectedUnit.id,
        }).then((res) => {
          handlePutResponse(res, router);
          if (res.type === "success") {
            const newOrganizationUnits = organizationUnits.map((i) => {
              if (i.id === selectedUnitId) {
                return {
                  ...i,
                  displayName: e.displayName,
                };
              }
              return i;
            });
            setOrganizationUnits(newOrganizationUnits);
            setTriggerData({});
            setOpen(false);
          }
        });
      },
    });
    setOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    void deleteOrganizationUnitsByIdMembersByMemberIdApi({
      id: selectedUnitId || "",
      memberId: userId || "",
    }).then((res) => {
      handleDeleteResponse(res);
      if (res.type === "success") {
        getUnitUsers();
      }
    });
  };

  const handleDeleteRole = (roleId: string) => {
    void deleteOrganizationUnitsByIdRolesByRoleIdApi({
      id: selectedUnitId || "",
      roleId: roleId || "",
    }).then((res) => {
      handleDeleteResponse(res);
      if (res.type === "success") {
        getUnitRoles();
      }
    });
  };

  return (
    <>
      <div className="flex min-h-[60vh] w-full flex-row">
        <Card className="m-2 max-h-[60vh] w-1/2 overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl">{languageData["Organization.Tree"]}</h2>
              <Button
                className="bg-primary rounded px-4 py-2 text-white"
                onClick={() => {
                  setSelectedUnitId(undefined);
                  setTriggerData({});
                  handleAddUnit(null);
                }}
              >
                {languageData["Organization.Add.Root.Unit"]}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {organizationUnits.length > 0 ? (
              <TreeView
                elements={initializeOrganizationTree()}
                optionsDropdownContent={
                  <>
                    <DropdownMenuItem
                      onClick={() => {
                        handleEditUnit();
                      }}
                    >
                      {languageData.Edit}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        handleAddUnit(selectedUnitId || "");
                      }}
                    >
                      {languageData["Organization.Add.Sub.Unit"]}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        handleMoveAllUsers();
                      }}
                    >
                      {languageData["Organization.Move.Users"]}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        handleDeleteUnit(selectedUnitId || "");
                      }}
                    >
                      {languageData.Delete}
                    </DropdownMenuItem>
                  </>
                }
                selectedId={selectedUnitId}
                setSelectedId={setSelectedUnitId}
              />
            ) : (
              <p>{languageData["Organization.Tree.Empty"]}</p>
            )}
          </CardContent>
        </Card>

        <Card className="m-2 max-h-[60vh] w-1/2 overflow-y-auto">
          <CardContent>
            <SectionNavbarBase
              activeSectionId={activeTab}
              navClassName="p-0"
              navContainerClassName="shadow-none"
              onSectionChange={(newActiveSection) => {
                setActiveTab(newActiveSection);
              }}
              sections={[
                { id: "Users", name: "Users" },
                { id: "Roles", name: "Roles" },
              ]}
              showContentInSamePage
            />
            {selectedUnitId ? (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex w-full justify-end">
                    {activeTab === "Users" ? (
                      <Button
                        className="bg-primary rounded px-4 py-2 text-white"
                        onClick={() => {
                          setOpenUsersDialog(true);
                        }}
                      >
                        {languageData["Organization.Add.Users"]}
                      </Button>
                    ) : (
                      <Button
                        className="bg-primary rounded px-4 py-2 text-white"
                        onClick={() => {
                          setOpenRolesDialog(true);
                        }}
                      >
                        {languageData["Organization.Add.Roles"]}
                      </Button>
                    )}
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {activeTab === "Users" ? (
                        <>
                          <TableHead>
                            {languageData["Form.Organization.User.Name"]}
                          </TableHead>
                          <TableHead>
                            {languageData["Form.Organization.User.Email"]}
                          </TableHead>
                        </>
                      ) : (
                        <TableHead>
                          {languageData["Form.Organization.Role.Name"]}
                        </TableHead>
                      )}
                      <TableHead className="text-right" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTab === "Users" && unitUsers.length > 0
                      ? unitUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.userName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                onClick={() => {
                                  handleDeleteUser(user.id || "");
                                }}
                                variant="link"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      : activeTab === "Users" && (
                          <TableRow>
                            <TableCell>
                              {
                                languageData[
                                  "Organization.User.Empty.Description"
                                ]
                              }
                            </TableCell>
                          </TableRow>
                        )}
                    {activeTab === "Roles" && unitRoles.length > 0
                      ? unitRoles.map((role) => (
                          <TableRow key={role.id}>
                            <TableCell>{role.name}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                onClick={() => {
                                  handleDeleteRole(role.id || "");
                                }}
                                variant="link"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      : activeTab === "Roles" && (
                          <TableRow>
                            <TableCell>
                              {
                                languageData[
                                  "Organization.Role.Empty.Description"
                                ]
                              }
                            </TableCell>
                          </TableRow>
                        )}
                  </TableBody>
                </Table>
                <p className="mt-10 text-sm">
                  {activeTab === "Users" ? unitUsers.length : unitRoles.length}{" "}
                  {languageData["Organization.Count"]}
                </p>
              </div>
            ) : (
              <p>{languageData["Organization.Tree.Select.Description"]}</p>
            )}
          </CardContent>
        </Card>
      </div>
      {open
        ? action !== undefined && (
            <AutoformDialog
              action={action}
              onOpenChange={setOpen}
              open={open}
              triggerData={triggerData}
            />
          )
        : null}
      {openUsersDialog ? (
        <CustomTableActionDialog
          action={{
            type: "Sheet",
            cta: `${languageData.Organization} ( ${organizationName} )`,
            description: languageData["Organization.Add.Users.Description"],
            componentType: "CustomComponent",
            loadingContent: <></>,
            content: (
              <OrganizationUsersTable
                languageData={languageData}
                selectedUnitId={selectedUnitId || ""}
                unitUsers={unitUsers}
                userList={userList}
              />
            ),
          }}
          onOpenChange={setOpenUsersDialog}
          open={openUsersDialog}
          type="Sheet"
        />
      ) : null}
      {openRolesDialog ? (
        <CustomTableActionDialog
          action={{
            type: "Sheet",
            cta: `${languageData.Organization} ( ${organizationName} )`,
            description: languageData["Organization.Add.Roles.Description"],
            componentType: "CustomComponent",
            loadingContent: <></>,
            content: (
              <OrganizationRolesTable
                languageData={languageData}
                roleList={roleList}
                selectedUnitId={selectedUnitId || ""}
                unitRoles={unitRoles}
              />
            ),
          }}
          onOpenChange={setOpenRolesDialog}
          open={openRolesDialog}
          type="Sheet"
        />
      ) : null}
    </>
  );
}
