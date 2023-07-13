import Link from "next/link";
import { Button } from "~/components/ui/button";
import { buttonVariants } from "~/components/ui/button";
import PomodoroTimer from "./pomodoro";

export default function LinkBar() {
  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto flex items-start justify-between"> {/* Updated class: items-start */}
        <div className="flex items-center space-x-4">
          <PomodoroTimer initialTime={25} />
          <div className="flex items-center space-x-4">
            <a className={buttonVariants({ variant: "link" })} href='https://mail.google.com/mail/u/0/#inbox' target="_blank">Gmail</a>
            <a className={buttonVariants({ variant: "link" })} href={'https://www.github.com'} target="_blank">Github</a>
          </div>
        </div>
      </div>
    </div>
  );
}
