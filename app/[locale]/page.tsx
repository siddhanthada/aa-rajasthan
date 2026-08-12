import { setRequestLocale } from "next-intl/server";
import { getDistricts } from "@/lib/data/districts";
import { getMeetingsWithDetails } from "@/lib/data/meetings";
import Finder from "@/components/Finder";
import EntryTiles from "@/components/EntryTiles";
import Container from "@/components/Container";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const districts = getDistricts();
  const meetings = getMeetingsWithDetails();
  const today = new Date().getDay();

  return (
    <main className="flex-1">
      <Container className="pb-8">
        <EntryTiles />
        <Finder districts={districts} meetings={meetings} today={today} />
      </Container>
    </main>
  );
}
