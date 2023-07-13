import { useSession, signIn, signOut } from "next-auth/react";
import { format } from "date-fns";
import WeatherWidget from "./weather";
import dynamic from "next/dynamic";
import { Button } from "./button";
import { MainNav } from "./main-nav";

const DynamicDigitalClock = dynamic(() => import("./DigitalClock"), {
  ssr: false,
});

export default function UserTitle() {
  const user = useSession().data?.user;

  if (user)
    return (
      <>
        <div className="mx-auto flex w-full justify-between border border-red-500">
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter text-white md:text-4xl">
              Good Morning {user?.name?.split(" ")[0]},
              <br className="hidden sm:inline" />
              This is your day at a glance.
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              {format(Date.now(), "MMMM d, yyyy")}
            </p>
            <p className="text-md text-muted-foreground">
              <DynamicDigitalClock />
            </p>
          </div>
          <div className="ml-auto">
            <Button onClick={() => signOut()}>Pee Pee</Button>
            <WeatherWidget />
          </div>
        </div>
      </>
    );
  return (
    <>
      <p className="text-white">Not Logged In</p>
      <Button onClick={() => signIn()}>log in</Button>);
    </>
  );
}
