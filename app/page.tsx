import { getDistricts } from "@/lib/data/districts";
import { getMeetingsWithDetails } from "@/lib/data/meetings";
import Finder from "@/components/Finder";

export default function Home() {
  const districts = getDistricts();
  const meetings = getMeetingsWithDetails();
  const today = new Date().getDay();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-8 sm:px-6">
      <Finder districts={districts} meetings={meetings} today={today} />
    </main>
  );
}
