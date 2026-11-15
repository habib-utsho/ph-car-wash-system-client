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
  searchParams: Promise<{ branch?: string }>;
}) {
  // In Next.js 16 the search params must be awaited.
  // const { branch } = await searchParams;

  const search = await searchParams;
  const urlSearch = new URLSearchParams(search);
  const query = urlSearch.toString() ? `?${urlSearch.toString()}` : "";
  console.log(search, urlSearch.toString());

  const allServices = await getServices(query);

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
        {BRANCHES.map((name) => (
          <Link
            key={name}
            href={`/services?branch=${name}`}
            className={filterClass(search.branch === name)}
          >
            {name}
          </Link>
        ))}
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
