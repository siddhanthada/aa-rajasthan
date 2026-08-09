import { getDistricts } from "@/lib/data/districts";
import { getMeetingsWithDetails } from "@/lib/data/meetings";
import Finder from "@/components/Finder";
import HelplineBar from "@/components/HelplineBar";

export default function Home() {
  const districts = getDistricts();
  const meetings = getMeetingsWithDetails();
  const today = new Date().getDay();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border py-3">
        <h1 className="text-[22px] font-semibold text-ink">Find a meeting</h1>
        <HelplineBar />
      </div>

      <Finder districts={districts} meetings={meetings} today={today} />
    </main>
  );
}
