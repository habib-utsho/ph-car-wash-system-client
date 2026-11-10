import Link from "next/link";
import type { SVGProps } from "react";
import { CarFront, Droplets, Phone, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/auth";
import SignoutCompo from "./Signout";

const PHONE_DISPLAY = "+880170678-5160";
const PHONE_NUMBER = "8801706785160";

// lucide-react has no brand icons, so WhatsApp is an inline SVG.
const WhatsAppIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const Header = async () => {
  const { data: session, error } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  return (
    <header className="bg-[#15295e] text-white">
      <div className="mx-auto flex h-14 max-w-[1366px] items-center justify-between px-4">
        {/* Logo — placeholder built from icons; swap for your logo image when you have it */}
        <Link
          href="/"
          aria-label="PH Car Wash home"
          className="relative grid size-12 place-items-center rounded-full bg-[#2b4386]"
        >
          <Droplets className="absolute top-1.5 size-3 text-sky-300" />
          <CarFront className="mt-2 size-6 text-[#ffc107]" />
        </Link>

        <div className="flex h-full items-center gap-5 sm:gap-8">
          <a
            href={`tel:+${PHONE_NUMBER}`}
            aria-label={`Call us now: ${PHONE_DISPLAY}`}
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#ffc107]"
          >
            <Phone className="size-4 sm:hidden" />
            <span className="hidden sm:inline">
              Call us now: {PHONE_DISPLAY}
            </span>
          </a>

          <a
            href={`https://wa.me/${PHONE_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="transition-colors hover:text-[#25d366]"
          >
            <WhatsAppIcon className="size-4" />
          </a>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button
                  type="button"
                  aria-label="Open account menu"
                  className="flex h-full items-center gap-2 px-2 transition-colors hover:text-[#ffc107]"
                >
                  <UserRound className="size-4" />
                  <span className="hidden max-w-28 truncate sm:inline">
                    {session.user?.name || "Account"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href={`/dashboard/${session.user?.role || "user"}`}>
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/profile">My profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignoutCompo />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/signin" className="flex h-full items-center px-5">
              Signin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
