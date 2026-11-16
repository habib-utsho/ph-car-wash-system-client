import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getServiceById } from "@/lib/api/services";
import { auth } from "@/lib/auth";
import PayNowButton from "../_components/PayNow";

// Booking page for one service.
// It shows the service details, who is booking, and a Pay Now button.
// Example address: /booking/65f1a2b3c4d5e6f7a8b9c0d1

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // In Next.js 16 the route params must be awaited.
  const { id } = await params;

  const service = await getServiceById(id);

  // If the service does not exist, show the "not found" page.
  if (!service) {
    notFound();
  }

  // Read the signed-in user on the server. "user" is undefined when nobody is signed in.
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href={`/services/${id}`}
        className="text-sm text-[#15295e] underline-offset-4 hover:underline"
      >
        ← Back to service
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-[#15295e]">
        Confirm your booking
      </h1>

      {/* One short message that tells the user what to do next. */}
      <p
        className={`mt-3 rounded-lg border p-3 text-sm ${
          user ? "bg-muted" : "border-amber-300 bg-amber-50"
        }`}
      >
        {user
          ? "Check the details below. When everything looks right, press Pay Now."
          : "Please sign in before you can book. The service details are shown below."}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Left side: the service details */}
        <section className="rounded-xl border p-4">
          <h2 className="font-medium">Service</h2>

          <div className="relative mt-3 h-48 w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={service.image}
              alt={service.name}
              fill
              unoptimized
              priority
              className="object-cover"
            />
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <p className="text-base font-medium">{service.name}</p>
            <Badge variant="secondary">{service.branch}</Badge>
            <p className="text-muted-foreground">{service.description}</p>
            <p>Duration: {service.duration} min</p>
            <p>Slot: {service.slot || "Not set"}</p>
          </div>

          <h3 className="mt-4 text-sm font-medium">What is included</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {service.keyFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        {/* Right side: who is booking, and the payment */}
        <section className="rounded-xl border p-4">
          <h2 className="font-medium">Your details</h2>

          {user ? (
            <div className="mt-3 space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Name: </span>
                {user.name}
              </p>
              <p>
                <span className="text-muted-foreground">Email: </span>
                {user.email}
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-3 text-sm">
              <p className="text-muted-foreground">
                You are not signed in yet.
              </p>
              <Link
                href="/signin"
                className="inline-flex h-9 items-center rounded-lg border px-4 hover:bg-muted"
              >
                Sign in
              </Link>
            </div>
          )}

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Total</span>
              <span className="font-semibold">৳ {service.price}</span>
            </div>

            {user ? (
              <PayNowButton service={service} user={user} />
            ) : (
              <Button className="mt-4 w-full bg-[#15295e] text-white hover:bg-[#1e3a80]">
                Sign in to pay
              </Button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
