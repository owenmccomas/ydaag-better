import { buttonVariants } from "~/components/ui/button";
import PomodoroTimer from "./pomodoro";

export default function LinkBar() {
  return (
    <div className="bg-background">
      <div className="mx-auto flex max-w-7xl items-start justify-between">
        <div className="flex items-center space-x-4">
          {/* Hide PomodoroTimer on mobile screens */}
          <div className="hidden sm:block">
            <PomodoroTimer initialTime={25} />
          </div>
          <div className="flex items-center space-x-4">
            <a
              className={buttonVariants({ variant: "link" })}
              href="https://mail.google.com/mail/u/0/#inbox"
              target="_blank"
            >
              Gmail
            </a>
            <a
              className={buttonVariants({ variant: "link" })}
              href={"https://www.github.com"}
              target="_blank"
            >
              Github
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
