import Link from "next/link";
import { NavItem } from "types/nav";
import { cn } from "src/utils";
import { useRouter } from "next/router";

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  const router = useRouter();

  return (
    <div className="flex gap-6 md:gap-10">
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map((item, index) =>
            item.href ? (
              <Link key={index} href={item.href}>
                <p
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    router.asPath === item.href && "text-fg"
                  )}
                >
                  {item.title}
                </p>
              </Link>
            ) : null
          )}
        </nav>
      ) : null}
    </div>
  );
}
