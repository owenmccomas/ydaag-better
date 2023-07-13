import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "~/components/ui/button";
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
      <main className="flex min-h-screen gap-10 flex-col items-center justify-center bg-gradient-to-b from-[#000000] to-[#000000]">

        <UserTitle />
        <Button onClick={()=>alert('Poo Poo')}>Poo Poo</Button>


      </main>
    </>
  );
}

