"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { updateUser } from "@/lib/action/users";
import { BRANCHES } from "@/lib/branches";
import type { TAdminUser, TUserRole } from "@/types";

const ROLES: TUserRole[] = ["admin", "user", "branchManager"];

// The words shown in the role menu.
const ROLE_LABELS: Record<TUserRole, string> = {
  admin: "Admin",
  user: "User",
  branchManager: "Branch manager",
};

type UsersTableProps = {
  users: TAdminUser[];
  currentUserId: string;
};

// The table of all users. Each row can change one user's role and branch.
const UsersTable = ({ users, currentUserId }: UsersTableProps) => {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead className="pr-4">Save</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              isCurrentUser={user._id === currentUserId}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// One row. It keeps its own copy of the role and branch, so the admin can change them before saving.
const UserRow = ({
  user,
  isCurrentUser,
}: {
  user: TAdminUser;
  isCurrentUser: boolean;
}) => {
  const [role, setRole] = useState<TUserRole>(user.role);
  const [branch, setBranch] = useState<string>(user.branch ?? "");
  const [isPending, startTransition] = useTransition();

  // Only branch managers have a branch, so the branch only matters for them.
  const savedBranch = user.branch ?? "";
  const hasChanges =
    role !== user.role || (role === "branchManager" && branch !== savedBranch);

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateUser({
        userId: user._id,
        role,
        branch: role === "branchManager" ? branch : null,
      });

      toast.add({
        title: result.success ? "User updated" : "Could not update user",
        description: result.message,
      });
    });
  };

  const controlsDisabled = isCurrentUser || isPending;

  return (
    <TableRow>
      <TableCell className="pl-4 font-medium">
        {user.name}
        {isCurrentUser && (
          <span className="ml-2 text-xs text-muted-foreground">(you)</span>
        )}
      </TableCell>

      <TableCell className="text-muted-foreground">{user.email}</TableCell>

      <TableCell>
        <NativeSelect
          value={role}
          onChange={(e) => setRole(e.target.value as TUserRole)}
          disabled={controlsDisabled}
        >
          {ROLES.map((r) => (
            <NativeSelectOption key={r} value={r}>
              {ROLE_LABELS[r]}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </TableCell>

      <TableCell>
        {role === "branchManager" ? (
          <NativeSelect
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            disabled={controlsDisabled}
          >
            <NativeSelectOption value="">Choose a branch</NativeSelectOption>
            {BRANCHES.map((b) => (
              <NativeSelectOption key={b} value={b}>
                {b}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      <TableCell className="pr-4">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || controlsDisabled}
          className="bg-[#15295e] text-white hover:bg-[#1e3a80]"
        >
          {isPending ? "Saving…" : "Save"}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default UsersTable;
