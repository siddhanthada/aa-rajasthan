"use client";

import { useState } from "react";
import Link from "next/link";

const QUESTIONS = [
  "Have you ever felt you should cut down on your drinking?",
  "Have people close to you commented on your drinking?",
  "Have you ever felt guilty about drinking?",
  "Have you ever needed a drink first thing to steady your nerves?",
  "Do you drink to escape worries or problems?",
  "Have you missed work, school, or other commitments because of drinking?",
  "Have you kept drinking even when it caused problems with family or friends?",
  "Do you often drink alone?",
  "Have you tried to cut down and found it difficult?",
  "Has your drinking ever put you or someone else at risk?",
];

type Answer = "yes" | "no";

export default function SelfCheck() {
  const [answers, setAnswers] = useState<Record<number, Answer>>({});

  const complete = Object.keys(answers).length === QUESTIONS.length;

  function answer(index: number, value: Answer) {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  }

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[680px] px-4 py-8 sm:px-6">
        <h1 className="text-[22px] font-semibold text-ink">
          A few questions to think about
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          There&rsquo;s no score and no right answer. This isn&rsquo;t a
          diagnosis — only you can decide what it means for you.
        </p>

        <ol className="mt-8 flex flex-col">
          {QUESTIONS.map((question, index) => (
            <li
              key={question}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-4 first:pt-0"
            >
              <p className="text-sm text-ink">{question}</p>
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

        {complete && (
          <div className="mt-8 rounded-xl bg-indigo/6 p-5">
            <p className="text-sm leading-relaxed text-ink">
              Thank you for taking a moment for this. If any of this feels
              familiar, you&rsquo;re welcome to attend a meeting and see for
              yourself — nobody will ask why you&rsquo;re there, and you
              don&rsquo;t need to have taken this to go.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block w-fit rounded-lg bg-indigo px-5 py-2.5 text-sm font-semibold text-white"
            >
              Find a meeting
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
