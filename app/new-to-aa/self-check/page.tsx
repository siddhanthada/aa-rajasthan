"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, HeartHandshake } from "lucide-react";
import Container from "@/components/Container";

const QUESTIONS = [
  "Have you tried to cut back on drinking and found it harder than expected?",
  "Has anyone close to you said they're worried about how much you drink?",
  "Have you felt guilty or uneasy about your drinking?",
  "Do you ever need a drink to feel normal or steady in the morning?",
  "Has drinking gotten in the way of work, family, or things you care about?",
  "Do you drink alone, or hide how much you drink?",
  "Have you kept drinking even when it was clearly causing problems?",
  "Has drinking ever put you or someone else in a risky situation?",
];

type Answer = "yes" | "no";

function ReflectionPanel({ hasYes }: { hasYes: boolean }) {
  if (!hasYes) {
    return (
      <div className="rounded-xl border border-border bg-paper p-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-muted">
          <Info size={18} className="text-ink-muted" />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Answer honestly, at your own pace — nothing here is scored or
          judged.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-indigo bg-indigo/6 p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo">
        <HeartHandshake size={18} className="text-white" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink">
        It sounds like some of this might be familiar. Many people who feel
        this way find it helps to talk to someone or sit in on a meeting —
        there&rsquo;s no pressure, and no one will ask why you came.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <Link
          href="/"
          className="rounded-lg bg-indigo px-4 py-2.5 text-center text-sm font-semibold text-white"
        >
          Find a meeting
        </Link>
        <a
          href="tel:+911414000000"
          className="rounded-lg border border-indigo px-4 py-2.5 text-center text-sm font-semibold text-indigo"
        >
          Call the helpline
        </a>
      </div>
    </div>
  );
}

export default function SelfCheck() {
  const [answers, setAnswers] = useState<Record<number, Answer>>({});

  const answeredCount = Object.keys(answers).length;
  const hasYes = Object.values(answers).includes("yes");

  function answer(index: number, value: Answer) {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  }

  return (
    <main className="flex-1">
      <Container className="py-8">
        <div className="mx-auto max-w-[1040px]">
          <h1 className="text-[22px] font-semibold text-ink">
            A few questions to think about
          </h1>
          <p className="mt-2 max-w-[680px] text-sm leading-relaxed text-ink-muted">
            There&rsquo;s no score and no right answer. This isn&rsquo;t a
            diagnosis — only you can decide what it means for you.
          </p>

          <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1 lg:max-w-[680px]">
              <div className="flex gap-2">
                {QUESTIONS.map((_, index) => (
                  <span
                    key={index}
                    aria-hidden="true"
                    className={`h-2 w-2 rounded-full ${
                      answers[index] !== undefined
                        ? "bg-indigo"
                        : "border border-border"
                    }`}
                  />
                ))}
              </div>

              <ol className="mt-4 flex flex-col gap-3 pb-24 lg:pb-0">
                {QUESTIONS.map((question, index) => (
                  <li
                    key={question}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-white p-4"
                  >
                    <p className="text-base font-medium text-ink">
                      {question}
                    </p>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => answer(index, "yes")}
                        aria-pressed={answers[index] === "yes"}
                        className={`rounded-lg border px-4 py-1.5 text-sm font-medium ${
                          answers[index] === "yes"
                            ? "border-indigo bg-indigo text-white"
                            : "border-border bg-white text-ink"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => answer(index, "no")}
                        aria-pressed={answers[index] === "no"}
                        className={`rounded-lg border px-4 py-1.5 text-sm font-medium ${
                          answers[index] === "no"
                            ? "border-indigo bg-indigo text-white"
                            : "border-border bg-white text-ink"
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="hidden lg:sticky lg:top-[88px] lg:block lg:w-[320px] lg:shrink-0">
              <ReflectionPanel hasYes={hasYes} />
            </div>
          </div>
        </div>
      </Container>

      {answeredCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-paper p-4 lg:hidden">
          <ReflectionPanel hasYes={hasYes} />
        </div>
      )}
    </main>
  );
}
