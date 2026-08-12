import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getMeetingWithDetailsById } from "@/lib/data/meetings";
import MeetingDetailContent from "@/components/MeetingDetailContent";

export default async function MeetingDetail(
  props: PageProps<"/[locale]/meetings/[id]">,
) {
  const { locale, id } = await props.params;
  setRequestLocale(locale);

  const meeting = getMeetingWithDetailsById(id);

  if (!meeting) {
    notFound();
  }

  const t = await getTranslations("meetingDetail");

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[680px] px-4 py-6 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-indigo"
        >
          <ArrowLeft size={14} />
          {t("backToMeetings")}
        </Link>

        <div className="mt-4">
          <MeetingDetailContent meeting={meeting} />
        </div>
      </div>
    </main>
  );
}
