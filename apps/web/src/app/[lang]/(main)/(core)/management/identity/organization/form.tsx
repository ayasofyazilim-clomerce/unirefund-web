/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: we need to fix this*/
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DataTable from "@repo/ayasofyazilim-ui/molecules/tables";
import type { Row, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import type { Role, User } from "./action";
import { fetchRoles, fetchUsers } from "./action";

interface SelectAllCheckboxProps<T> {
  table: Table<T>;
  selectedItems: Set<string>;
  handleToggleAll: (_value: boolean, _rows: Row<T>[]) => void;
}

function SelectAllCheckbox<T>({
  table,
  selectedItems,
  handleToggleAll,
}: SelectAllCheckboxProps<T>) {
  const rows = table.getRowModel().rows;
  const isAllSelected = rows.every((row: Row<T>) =>
    selectedItems.has((row.original as User | Role).id),
  );

  return (
    <Checkbox
      aria-label="Select all"
      checked={isAllSelected}
      onCheckedChange={(value) => {
        table.toggleAllPageRowsSelected(Boolean(value));
        handleToggleAll(Boolean(value), rows);
      }}
    />
  );
}

interface RowCheckboxProps<T> {
  row: Row<T>;
  selectedItems: Set<string>;
  handleToggleItem: (_id: string) => void;
}

function RowCheckbox<T>({
  row,
  selectedItems,
  handleToggleItem,
}: RowCheckboxProps<T>) {
  const id = (row.original as User | Role).id;

  return (
    <Checkbox
      aria-label="Select row"
      checked={row.getIsSelected() || selectedItems.has(id)}
      className="mr-6"
      onCheckedChange={(value) => {
        row.toggleSelected(Boolean(value));
        handleToggleItem(id);
      }}
    />
  );
}

interface EnchancedColumnsProps<T> {
  columns: {
    header: string;
    accessorKey: keyof T;
    cell?: (_row: any) => JSX.Element;
  }[];
  checkboxColumnKey: keyof T;
  selectedItems: Set<string>;
  handleToggleAll: (_value: boolean, _rows: Row<T>[]) => void;
  handleToggleItem: (_id: string) => void;
}

const enhancedColumns = <T,>({
  columns,
  checkboxColumnKey,
  selectedItems,
  handleToggleAll,
  handleToggleItem,
}: EnchancedColumnsProps<T>) => [
  {
    id: "select",
    header: ({ table }: { table: Table<any> }) => (
      <SelectAllCheckbox<T>
        handleToggleAll={handleToggleAll}
        selectedItems={selectedItems}
        table={table}
      />
    ),
    cell: ({ row }: { row: Row<T> }) => (
      <RowCheckbox<T>
        handleToggleItem={handleToggleItem}
        row={row}
        selectedItems={selectedItems}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  ...columns.map((column) => {
    if (column.accessorKey === checkboxColumnKey) {
      return {
        ...column,
      };
    }
    return column;
  }),
];

interface GenericModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSave: (_selectedItems: T[]) => void;
  addedItems: T[];
  fetchItems: () => Promise<T[]>;
  columns: {
    header: string;
    accessorKey: keyof T;
    cell?: (_row: any) => JSX.Element;
  }[];
  title: string;
  checkboxColumnKey: keyof T;
}

export function GenericModal<T extends { id: string }>({
  isOpen,
  onClose,
  onSave,
  addedItems,
  fetchItems,
  columns,
  title,
  checkboxColumnKey,
}: GenericModalProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const loadItems = async () => {
        const _items = await fetchItems();
        const filteredItems = _items.filter(
          (item) => !addedItems.some((addedItem) => addedItem.id === item.id),
        );
        setItems(filteredItems);
        setSelectedItems(new Set(addedItems.map((item) => item.id)));
        setLoading(false);
      };
      void loadItems();
    } else {
      setSelectedItems(new Set());
    }
  }, [isOpen, addedItems, fetchItems]);

  const handleToggleItem = (itemId: string) => {
    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return newSelected;
    });
  };

  const handleSave = () => {
    const selectedItemList = items.filter((item) => selectedItems.has(item.id));
    onSave(selectedItemList);
  };

  const handleToggleAll = (selectAll: boolean, rows: Row<T>[]) => {
    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected);
      rows.forEach((row) => {
        if (selectAll) {
          newSelected.add(row.original.id);
        } else {
          newSelected.delete(row.original.id);
        }
      });
      return newSelected;
    });
  };

  const columnsData = enhancedColumns<T>({
    columns,
    checkboxColumnKey,
    selectedItems,
    handleToggleAll,
    handleToggleItem,
  });

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DataTable
          columnsData={{ type: "Custom", data: { columns: columnsData } }}
          data={items}
          isLoading={loading}
        />
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const UserModal: React.FC<
  Omit<
    GenericModalProps<User>,
    "fetchItems" | "columns" | "filterBy" | "title" | "checkboxColumnKey"
  >
> = (props) => (
  <GenericModal
    {...props}
    checkboxColumnKey="userName"
    columns={[
      {
        header: "User Name",
        accessorKey: "userName",
      },
      {
        header: "Email Address",
        accessorKey: "email",
      },
    ]}
    fetchItems={fetchUsers}
    title="Select users"
  />
);

export const RoleModal: React.FC<
  Omit<
    GenericModalProps<Role>,
    "fetchItems" | "columns" | "filterBy" | "title" | "checkboxColumnKey"
  >
> = (props) => (
  <GenericModal
    {...props}
    checkboxColumnKey="name"
    columns={[
      {
        header: "Role Name",
        accessorKey: "name",
      },
    ]}
    fetchItems={fetchRoles}
    title="Select roles"
  />
);

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p>{description}</p>
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button className="bg-primary text-white" onClick={onConfirm}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
