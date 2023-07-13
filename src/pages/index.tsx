import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { MainNav } from "~/components/ui/main-nav";
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
      <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-gradient-to-b from-[#000000] to-[#000000]">
        <MainNav />
        
        <UserTitle />
        <Button onClick={() => alert("Poo Poo")}>Poo Poo</Button>
      </main>
    </>
  );
}
