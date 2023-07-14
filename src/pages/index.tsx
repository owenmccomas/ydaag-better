import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { TodoList } from "~/components/todos";
import { Button } from "~/components/ui/button";
import { MainNav } from "~/components/ui/main-nav";
import { SiteHeader } from "~/components/ui/site-header";
import UserTitle from "~/components/ui/title";
import LinkBar from "~/components/link-bar";
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
      <main className="w-full bg-background">
        <div className="mx-auto">
          <SiteHeader />

          <div className="mx-auto flex h-screen w-6/12 flex-col items-start justify-center ">
            <UserTitle />
            <div className="mt-2 w-3/12">
              <LinkBar  />
            </div>
            {session && <TodoList userId={session?.user.id} />}
          </div>
        </div>
      </main>
    </>
  );
}
