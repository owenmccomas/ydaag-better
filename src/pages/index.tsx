import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { TodoList } from "~/components/todos";
import { SiteHeader } from "~/components/ui/site-header";
import UserTitle from "~/components/ui/title";
import LinkBar from "~/components/link-bar";
import { Button } from "~/components/ui/button";

export default function Home() {
  const { data: session } = useSession();
  const user = useSession().data?.user;

  return (
    <>
      <Head>
        <title>YDAAG</title>
        <meta name="description" content="Your Day at a Glance" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full bg-background">
        <div className="mx-auto flex flex-col min-h-screen">
          {user ? (
            // User is logged in
            <>
              <SiteHeader />
              <div className="mx-auto mt-10 w-11/12 sm:w-6/12">
                <UserTitle />
                <div className="mt-2">
                  <LinkBar />
                </div>
                {session && <TodoList userId={session?.user.id} />}
              </div>
            </>
          ) : (
            // User is not logged in
            <div className="flex h-screen items-center justify-center">
              <div className="text-center">
                <p className="text-fg mb-4">Not Logged In</p>
                <Button onClick={() => signIn()}>Sign In</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
