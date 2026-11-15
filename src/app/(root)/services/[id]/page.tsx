import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getServiceById } from "@/lib/api/services";

// Details page for one service. Example address: /services/65f1a2b3c4d5e6f7a8b9c0d1

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // In Next.js 16 the route params must be awaited.
  const { id } = await params;

  const service = await getServiceById(id);

  // If there is no such service, show the "not found" page.
  if (!service) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/services"
        className="text-sm text-[#15295e] underline-offset-4 hover:underline"
      >
        ← Back to all services
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="relative h-72 w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={service.image}
            alt={service.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <div className="space-y-4">
          <Badge variant="secondary">{service.branch}</Badge>
          <h1 className="text-2xl font-semibold text-[#15295e]">
            {service.name}
          </h1>
          <p className="text-sm text-muted-foreground">{service.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground">Price</p>
              <p className="font-medium">৳ {service.price}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium">{service.duration} min</p>
            </div>
            <div className="col-span-2 rounded-lg border p-3">
              <p className="text-muted-foreground">Slot</p>
              <p className="font-medium">{service.slot || "Not set"}</p>
            </div>
          </div>

          <div>
            <h2 className="font-medium">What is included</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {service.keyFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>

          <Link
            href={`/booking/${service._id}`}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#15295e] text-sm font-medium text-white hover:bg-[#1e3a80]"
          >
            Book Now
          </Link>
        </div>
      </div>
    </main>
  );
}
