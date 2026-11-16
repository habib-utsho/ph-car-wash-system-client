import { CircleCheckIcon } from "lucide-react";
import Link from "next/link";

// Stripe sends the customer here after a successful payment.
// Example: /booking/success?bookingId=65f1a2b3c4d5e6f7a8b9c0d1

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  // In Next.js 16 the search params must be awaited.
  const { bookingId } = await searchParams;

  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center">
      <CircleCheckIcon className="mx-auto size-16 text-green-600" />

      <h1 className="mt-4 text-2xl font-semibold text-[#15295e]">
        Payment successful
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Thank you! Your payment was received.
      </p>

      {/* Show the booking reference, if Stripe sent it back. */}
      {bookingId && (
        <div className="mt-6 rounded-lg border bg-muted p-4 text-sm">
          <p className="text-muted-foreground">Booking reference</p>
          <p className="mt-1 break-all font-mono">{bookingId}</p>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/dashboard/user/bookings"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#15295e] px-5 text-sm font-medium text-white hover:bg-[#1e3a80]"
        >
          My bookings
        </Link>
        <Link
          href="/services"
          className="inline-flex h-10 items-center justify-center rounded-lg border px-5 text-sm font-medium hover:bg-muted"
        >
          Back to services
        </Link>
      </div>
    </main>
  );
}
