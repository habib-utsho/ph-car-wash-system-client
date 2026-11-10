import Link from "next/link";
import {
    ArrowLeftRight,
    CalendarCheck,
    CarFront,
    ClipboardList,
    Droplets,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const highlights = [
    {
        icon: CalendarCheck,
        title: "Book in seconds",
        text: "Pick a package and a time slot that suits your day.",
    },
    {
        icon: ArrowLeftRight,
        title: "Compare packages",
        text: "See exactly what each wash includes before you pay.",
    },
    {
        icon: ClipboardList,
        title: "Track every visit",
        text: "Your bookings and service history, all in one place.",
    },
];

// Same placeholder mark as the site Header — swap for your logo image when you have it.
const LogoMark = ({ className }: { className?: string }) => (
    <span
        className={cn(
            "relative grid size-11 place-items-center rounded-full bg-[#2b4386] ring-1 ring-white/10",
            className
        )}
    >
        <Droplets className="absolute top-1.5 size-3 text-sky-300" />
        <CarFront className="mt-2 size-5 text-[#ffc107]" />
    </span>
);

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="grid min-h-svh flex-1 lg:grid-cols-2">
            {/* Brand panel — desktop only */}
            <aside className="relative hidden overflow-hidden bg-[#15295e] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
                {/* Decorative background */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-40 -right-40 size-[30rem] rounded-full bg-[#2b4386] opacity-80 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-48 -left-24 size-[32rem] rounded-full bg-sky-400/15 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.09)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
                />

                <Link href="/" className="relative flex w-fit items-center gap-3">
                    <LogoMark />
                    <span className="text-lg font-semibold tracking-tight">PH Car Wash</span>
                </Link>

                <div className="relative max-w-md">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-[#ffc107] backdrop-blur">
                        <Sparkles className="size-3.5" />
                        Premium car care
                    </span>

                    <h1 className="mt-5 text-4xl leading-[1.1] font-semibold tracking-tight xl:text-5xl">
                        Showroom shine,
                        <br />
                        <span className="text-[#ffc107]">without the wait.</span>
                    </h1>

                    <p className="mt-5 text-base leading-relaxed text-white/70">
                        Book washes, manage your vehicles and keep track of every service, all from one account.
                    </p>

                    <ul className="mt-10 space-y-5">
                        {highlights.map(({ icon: Icon, title, text }) => (
                            <li key={title} className="flex items-start gap-4">
                                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5">
                                    <Icon className="size-5 text-[#ffc107]" />
                                </span>
                                <div>
                                    <p className="font-medium">{title}</p>
                                    <p className="text-sm text-white/60">{text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative text-sm text-white/50">© PH Car Wash. All rights reserved.</p>
            </aside>

            {/* Form panel */}
            <main className="flex flex-col items-center justify-center bg-white px-4 py-10 sm:px-8">
                <Link href="/" className="mb-10 flex items-center gap-3 lg:hidden">
                    <LogoMark className="bg-[#15295e]" />
                    <span className="text-lg font-semibold tracking-tight text-[#15295e]">PH Car Wash</span>
                </Link>

                <div className="w-full max-w-sm">{children}</div>
            </main>
        </div>
    );
};

export default AuthLayout;
