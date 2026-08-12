import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import BackLink from "@/components/BackLink";

export default async function NewToAA({
  params,
}: PageProps<"/[locale]/new-to-aa">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("newToAA");
  const tCommon = await getTranslations("common");

  const FAQ = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
  ];

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[680px] px-4 py-8 sm:px-6">
        <BackLink label={tCommon("back")} />
        <h1 className="mt-4 text-[22px] font-semibold text-ink">
          {t("heading")}
        </h1>

        <div className="mt-8 flex flex-col gap-8">
          <section>
            <h2 className="text-base font-semibold text-ink">
              {t("whatIsAA.heading")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {t("whatIsAA.body")}
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink">
              {t("whatHappens.heading")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {t("whatHappens.body")}
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink">
              {t("commonQuestions")}
            </h2>
            <dl className="mt-2 flex flex-col gap-4">
              {FAQ.map((item) => (
                <div key={item.question}>
                  <dt className="text-sm font-medium text-ink">
                    {item.question}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-muted">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="text-sm leading-relaxed text-ink-muted">
            {t.rich("selfCheckPrompt", {
              link: (chunks) => (
                <Link
                  href="/new-to-aa/self-check"
                  className="font-medium text-indigo underline underline-offset-2"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>

          <Link
            href="/"
            className="inline-block w-fit rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-white"
          >
            {t("findAMeeting")}
          </Link>
        </div>
      </div>
    </main>
  );
}
