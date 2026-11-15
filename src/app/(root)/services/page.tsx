import Link from "next/link";
import ServiceCard from "@/components/services/ServiceCard";
import { getServices } from "@/lib/api/services";
import { BRANCHES } from "@/lib/branches";

// Public page: all services as cards.
// Optional branch filter in the address, for example /services?branch=Dhaka

// Style for a filter button. The chosen branch looks filled in.
const filterClass = (isChosen: boolean) =>
  `rounded-full border px-4 py-1.5 text-sm ${
    isChosen ? "border-[#15295e] bg-[#15295e] text-white" : "hover:bg-muted"
  }`;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string; name?: string }>;
}) {
  // In Next.js 16 the search params must be awaited.
  // const { branch } = await searchParams;

  const search = await searchParams; // object format
  const urlSearch = new URLSearchParams(search); //  object format
  console.log({ search, urlSearch, searchString: urlSearch.toString() });

  const createFilterURL = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(search);

    if (value && key) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    console.log(newParams.toString(), "from handleQUery params");

    const queryString = newParams.toString();

    return queryString ? `/services?${queryString}` : "/services";
  };

  const allServices = await getServices(urlSearch.toString());
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-[#15295e]">
        Car wash services
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick a branch, or see all services.
      </p>

      {/* These are plain links, so the filter works without any JavaScript. */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/services" className={filterClass(!search.branch)}>
          All
        </Link>
        {BRANCHES.map((branch) => (
          <Link
            key={branch}
            href={createFilterURL("branch", branch)}
            className={filterClass(search.branch === branch)}
          >
            {branch}
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/services" className={filterClass(!search.branch)}>
          All
        </Link>
        {["Aidan Sandoval", "Jonas Barber", "Express Wash"].map((name) => {
          return (
            <Link
              key={name}
              href={createFilterURL("name", name)}
              className={filterClass(search.name === name)}
            >
              {name}
            </Link>
          );
        })}
      </div>

      {allServices.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          No services found yet.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allServices.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </main>
  );
}
