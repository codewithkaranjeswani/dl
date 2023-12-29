import { getServerAuthSession } from "@/server/auth";
import { ModeToggle } from "./mode-toggle";
import { SignOutButton } from "./ui/signout-button";
import { Button } from "./ui/button";
import Link from "next/link";

export default async function Menubar() {
  const session = await getServerAuthSession();
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-4 border-b px-10 py-5">
      <div className="flex items-center justify-center font-bold">QuizApp</div>
      <div className="flex gap-x-2">
        {session ? (
          <SignOutButton variant={"outline"} />
        ) : (
          <Button asChild size={"default"} variant={"outline"}>
            <Link href="/api/auth/signin">Sign In</Link>
          </Button>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}
