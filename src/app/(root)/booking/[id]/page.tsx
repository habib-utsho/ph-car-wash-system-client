import Link from "next/link";

// Placeholder for the booking page. The real booking form comes in the bookings step.
export default function BookingPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-[#15295e]">Book your wash</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The booking form is coming next.
      </p>
      <Link
        href="/services"
        className="mt-6 inline-block text-sm text-[#15295e] underline-offset-4 hover:underline"
      >
        Back to services
      </Link>
    </main>
  );
}
