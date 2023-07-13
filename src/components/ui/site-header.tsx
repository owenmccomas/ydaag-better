import { useSession } from "next-auth/react";

import { siteConfig } from "config/site";
import { buttonVariants } from "src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "src/components/ui/sheet";
import { MainNav } from "src/components/ui/main-nav";
import { ThemeToggle } from "src/components/ui/theme-toggle";

function openSheet() {
  console.log("open sheet");
}

export function SiteHeader() {
  const user = useSession().data?.user;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <Sheet>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={buttonVariants({ variant: "outline" })}
                >
                  Open
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <SheetTrigger>Profile</SheetTrigger>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <ThemeToggle /> */}
            </nav>
          </div>
          <SheetContent className="flex flex-col justify-between">
            <SheetHeader className="mt-10">
              <img
                width={120}
                className="mx-auto rounded-full"
                src={`${user?.image}`}
              />
              <SheetTitle className="text-center">
                {user?.name}
              </SheetTitle>
            </SheetHeader>
            <SheetDescription className="align-bottom">
              {`We think you're pretty cool. Here some stuff about you`}
            </SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
