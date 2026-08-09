import { getDistricts } from "@/lib/data/districts";
import { getMeetingsWithDetails } from "@/lib/data/meetings";
import Finder from "@/components/Finder";
import HelplineBar from "@/components/HelplineBar";

export default function Home() {
  const districts = getDistricts();
  const meetings = getMeetingsWithDetails();
  const today = new Date().getDay();

  return (
    <div className="flex flex-1 flex-col">
      <header className="relative overflow-hidden border-b border-border bg-paper">
        <div
          className="jali-bg pointer-events-none absolute inset-0 opacity-[0.06]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
            Find an AA Meeting in Rajasthan
          </h1>
          <p className="mt-2 max-w-xl text-ink-muted">
            Browse current, verified Alcoholics Anonymous meetings by
            district. No account or personal details needed.
          </p>
        </div>
      </header>

      <HelplineBar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        <Finder districts={districts} meetings={meetings} today={today} />
      </main>
    </div>
  );
}
