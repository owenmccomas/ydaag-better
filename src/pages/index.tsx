import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { MainNav } from "~/components/ui/main-nav";
import { SiteHeader } from "~/components/ui/site-header";
import UserTitle from "~/components/ui/title";
import { api } from "~/utils/api";

export default function Home() {
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

          <div className="flex h-full flex-col w-6/12 mx-auto mt-12 items-start justify-center ">
            <UserTitle />
            <div className="mt-2 w-3/12">
              <Button onClick={() => alert("Poo Poo")}>Poo Poo</Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
