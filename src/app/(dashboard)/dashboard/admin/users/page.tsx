import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UsersTable from "@/components/dashboard/admin/UsersTable";
import { getAllUsers } from "@/lib/api/users";
import { auth } from "@/lib/auth";

// Admin page: see every user, and change their role (and branch for branch managers).
export default async function AdminUsersPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  
  if (!session) {
      redirect("/signin");
    }
    // console.log(session.session?.token, "session");

  // Only admins may see this page. Other roles go to their own dashboard.
  const role = session.user.role ?? "user";
  if (role !== "admin") {
    redirect(`/dashboard/${role}`);
  }

  const users = await getAllUsers();

//   console.log(users, "users");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[#15295e]">
          Users
        </h1>
        <p className="text-sm text-muted-foreground">
          Change a user&apos;s role. Choose a branch for every branch manager.
          Changes take effect right away.
        </p>
      </div>

      <UsersTable users={users} currentUserId={session.user.id} />
    </div>
  );
}
