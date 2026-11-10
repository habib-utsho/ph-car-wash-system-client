import Link from "next/link";
import { ArrowLeftRight, Info, LayoutGrid } from "lucide-react";

const navLinks = [
    { href: "/services", label: "Services", icon: LayoutGrid },
    { href: "/compare", label: "Compare", icon: ArrowLeftRight },
    { href: "/about", label: "About Us", icon: Info },
];

const Navbar = () => {
    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex h-16 max-w-[1366px] items-center justify-between gap-4 px-4">
                <ul className="flex items-center gap-6 sm:gap-8 sm:pl-4">
                    {navLinks.map(({ href, label, icon: Icon }) => (
                        <li key={href}>
                            <Link
                                href={href}
                                className="flex items-center gap-2 text-[15px] text-gray-700 transition-colors hover:text-[#15295e]"
                            >
                                <Icon className="size-4" />
                                {/* Icons only on small screens; label stays readable for screen readers */}
                                <span className="sr-only sm:not-sr-only">{label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <Link
                    href="/booking"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[#ffc107] px-6 text-base font-medium text-white transition-colors hover:bg-[#f0b400] sm:w-50"
                >
                    Book Now
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
