"use client";

import { Toaster } from "sonner";
import { Tracks } from "./_components/tracks";
import { Suspense } from "react";
import Spinner from "@/components/ui/spinner";

export default function Home() {
  return (
    <div className="p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start lg:w-full">
        <Suspense fallback={<Spinner />}>
          <Tracks />
        </Suspense>
        <Toaster />
      </main>
    </div>
  );
}