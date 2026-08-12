import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function AboutAA({
  params,
}: PageProps<"/[locale]/about-aa">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("aboutAA");

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[680px] px-4 py-8 sm:px-6">
        <h1 className="text-[22px] font-semibold text-ink">{t("heading")}</h1>

        <div className="mt-8 flex flex-col gap-8">
          <section>
            <h2 className="text-base font-semibold text-ink">
              {t("howAAWorks.heading")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {t("howAAWorks.body")}
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink">
              {t("rajasthanSection.heading")}
            </h2>
            <div className="mt-2 rounded-xl border border-dashed border-border p-4">
              <p className="text-sm leading-relaxed text-ink-muted">
                {t("rajasthanSection.placeholder")}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
