import Link from "next/link";
import HelplineBar from "@/components/HelplineBar";

export default function ConcernedAboutSomeone() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[680px] px-4 py-8 sm:px-6">
        <h1 className="text-[22px] font-semibold text-ink">
          Concerned about someone
        </h1>

        <div className="mt-8 flex flex-col gap-8">
          <p className="text-sm leading-relaxed text-ink-muted">
            If someone you care about has a drinking problem, you&rsquo;re
            not alone, and it isn&rsquo;t yours to fix by yourself.
          </p>

          <section>
            <h2 className="text-base font-semibold text-ink">
              What you can do
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              You can&rsquo;t make someone stop drinking. You can share that
              meetings exist, without pressuring them to go. Many people find
              it helps to talk to others who understand — Al-Anon is a
              separate fellowship specifically for the families and friends
              of people with drinking problems, if you&rsquo;d like support
              of your own.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink">
              If you&rsquo;re not sure where to start
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              You&rsquo;re welcome to call the helpline below and talk it
              through with someone.
            </p>
          </section>

          <div className="flex flex-col items-start gap-3">
            <HelplineBar />
            <Link
              href="/"
              className="text-sm font-medium text-indigo underline underline-offset-2"
            >
              Find a meeting
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
