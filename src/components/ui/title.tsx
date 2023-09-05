import { useSession } from "next-auth/react";
import { format } from "date-fns";
import WeatherWidget from "./weather";
import dynamic from "next/dynamic";

const DynamicDigitalClock = dynamic(() => import("./DigitalClock"), {
  ssr: false,
});

export default function UserTitle() {
  const user = useSession().data?.user;

  // Function to determine if the screen is small (e.g., mobile)
  const isMobileScreen = () => {
    // Replace with the actual breakpoint size you want to use (e.g., 768px)
    const breakpoint = 385;
    return window.innerWidth < breakpoint;
  };

  return (
    <>
      <div className="mx-auto flex w-full justify-between">
        <div className="flex flex-col">
          <h1 className="mb-2 text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
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
        <div className={`ml-auto ${isMobileScreen() ? "hidden" : ""}`}>
          <WeatherWidget />
        </div>
      </div>
    </>
  );
}
