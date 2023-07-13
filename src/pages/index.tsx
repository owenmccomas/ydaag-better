import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { TodoList } from "~/components/todos";
import { Button } from "~/components/ui/button";
import { MainNav } from "~/components/ui/main-nav";
import UserTitle from "~/components/ui/title";
import { api } from "~/utils/api";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>YDAAG</title>
        <meta name="description" content="Your Day at a Glance" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-screen bg-gradient-to-b from-[#000000] to-[#000000]">
        <div className="mx-auto">
          <MainNav />

          <div className="mx-auto flex h-screen w-6/12 flex-col items-start justify-center ">
            <UserTitle />
            <div className="mt-2 w-3/12 border border-red-500">
              <Button onClick={() => alert("Poo Poo")}>Poo Poo</Button>
            </div>
            {session && <TodoList userId={session?.user.id} />}
          </div>
        </div>
      </main>
    </>
  );
}
