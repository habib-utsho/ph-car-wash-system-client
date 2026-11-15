import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AddServiceDialog from "@/components/dashboard/branchManager/AddServiceDialog";
import ServicesTable from "@/components/dashboard/branchManager/ServicesTable";
import { getServices } from "@/lib/api/services";
import { auth } from "@/lib/auth";

const ALLOWED_ROLES = ["branchManager", "admin"];

export default async function BranchManagerServicesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  const role = session.user.role ?? "user";

  if (!ALLOWED_ROLES.includes(role)) {
    redirect(`/dashboard/${role}`);
  }

  const services = await getServices();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#15295e]">
            My Services
          </h1>
          <p className="text-sm text-muted-foreground">
            Services you have created for your branch.
          </p>
        </div>
        <AddServiceDialog />
      </div>

      <ServicesTable services={services} />
    </div>
  );
}
