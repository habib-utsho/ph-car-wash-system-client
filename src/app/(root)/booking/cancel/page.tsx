import { OctagonXIcon } from "lucide-react";
import Link from "next/link";

// Stripe sends the customer here if they leave the payment page without paying.
// Example: /booking/cancel

export default function BookingCancelPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center">
      <OctagonXIcon className="mx-auto size-16 text-amber-600" />

      <h1 className="mt-4 text-2xl font-semibold text-[#15295e]">
        Payment cancelled
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You left the payment page before paying, so no money was taken.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Your booking was not confirmed. You can try again from the service page.
      </p>

      <div className="mt-8">
        <Link
          href="/services"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#15295e] px-5 text-sm font-medium text-white hover:bg-[#1e3a80]"
        >
          Back to services
        </Link>
      </div>
    </main>
  );
}
