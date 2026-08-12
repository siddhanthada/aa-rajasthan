import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import HelplineBar from "@/components/HelplineBar";
import BackLink from "@/components/BackLink";

export default async function ConcernedAboutSomeone({
  params,
}: PageProps<"/[locale]/concerned-about-someone">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("concernedAboutSomeone");
  const tCommon = await getTranslations("common");

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[680px] px-4 py-8 sm:px-6">
        <BackLink label={tCommon("back")} />
        <h1 className="mt-4 text-[22px] font-semibold text-ink">
          {t("heading")}
        </h1>

        <div className="mt-8 flex flex-col gap-8">
          <p className="text-sm leading-relaxed text-ink-muted">
            {t("intro")}
          </p>

          <section>
            <h2 className="text-base font-semibold text-ink">
              {t("whatYouCanDo.heading")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {t("whatYouCanDo.body")}
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink">
              {t("whereToStart.heading")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {t("whereToStart.body")}
            </p>
          </section>

          <div className="flex flex-col items-start gap-3">
            <HelplineBar />
            <Link
              href="/"
              className="text-sm font-medium text-indigo underline underline-offset-2"
            >
              {t("findAMeeting")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
