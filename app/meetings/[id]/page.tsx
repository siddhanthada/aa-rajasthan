import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getMeetingWithDetailsById } from "@/lib/data/meetings";
import MeetingDetailContent from "@/components/MeetingDetailContent";

export default async function MeetingDetail(
  props: PageProps<"/meetings/[id]">,
) {
  const { id } = await props.params;
  const meeting = getMeetingWithDetailsById(id);

  if (!meeting) {
    notFound();
  }

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[680px] px-4 py-6 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-indigo"
        >
          <ArrowLeft size={14} />
          Back to meetings
        </Link>

        <div className="mt-4">
          <MeetingDetailContent meeting={meeting} />
        </div>
      </div>
    </main>
  );
}
