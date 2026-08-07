import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { primaryNav } from "@/lib/navigation";

export function DesktopNav() {
  return (
    <nav aria-label="Hauptnavigation" className="hidden lg:flex lg:items-center lg:gap-1">
      {primaryNav.map((item) => (
        <div key={item.href} className="group relative">
          <Link
            href={item.href}
            className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary-600"
          >
            {item.label}
            {item.children ? (
              <ChevronDown
                className="h-4 w-4 text-primary-400 transition-transform duration-150 group-hover:rotate-180 group-focus-within:rotate-180"
                aria-hidden="true"
              />
            ) : null}
          </Link>

          {item.children ? (
            <div
              className="invisible absolute left-0 top-full z-50 min-w-64 translate-y-1 rounded-xl border border-primary-100 bg-white p-2 opacity-0 shadow-lifted transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
            >
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block rounded-lg px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-primary-50 hover:text-primary-700"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </nav>
  );
}
