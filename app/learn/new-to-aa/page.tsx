import Link from "next/link";

const FAQ = [
  {
    question: "Do I have to talk?",
    answer: "No. You're welcome to just listen.",
  },
  {
    question: "Will anyone know I came?",
    answer:
      "AA doesn't keep attendance records or membership lists. What's said and who attends stays in the room.",
  },
  {
    question: "Is there a cost?",
    answer:
      "No. AA has no dues or fees; it's self-supporting through voluntary contributions from members.",
  },
  {
    question: "What's the difference between open and closed meetings?",
    answer:
      "Open meetings welcome anyone, including family or friends. Closed meetings are for those with a drinking problem, or who think they might have one.",
  },
];

export default function NewToAA() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[680px] px-4 py-8 sm:px-6">
        <h1 className="text-[22px] font-semibold text-ink">New to AA</h1>

        <div className="mt-8 flex flex-col gap-8">
          <section>
            <h2 className="text-base font-semibold text-ink">
              What is AA?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Alcoholics Anonymous is a fellowship of people who share their
              experience with each other to solve a common problem and help
              others recover from alcoholism. There are no dues or fees. The
              only requirement for membership is a desire to stop drinking.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink">
              What happens at a meeting?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Meetings usually run about an hour. People share their own
              experiences — no one will call on you or ask you to speak. Some
              meetings are open to anyone; others are for people who have a
              drinking problem or think they might have one.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink">
              Common questions
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
            A short self-check is coming soon to help you think this
            through — it isn&rsquo;t a diagnosis, and you don&rsquo;t need to
            take it before going to a meeting.
          </p>

          <Link
            href="/"
            className="inline-block w-fit rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-white"
          >
            Find a meeting
          </Link>
        </div>
      </div>
    </main>
  );
}
