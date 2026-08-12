"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Info, HeartHandshake } from "lucide-react";
import Container from "@/components/Container";
import { pressable } from "@/lib/motion";

type Answer = "yes" | "no";

const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: EASE_STANDARD } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: EASE_STANDARD } },
};

function ReflectionPanel({ hasYes }: { hasYes: boolean }) {
  const t = useTranslations("selfCheck");

  return (
    <motion.div
      className="rounded-xl p-5"
      style={{ borderStyle: "solid" }}
      animate={{
        backgroundColor: hasYes ? "rgba(181,80,46,0.08)" : "#F7F4EE",
        borderColor: hasYes ? "#B5502E" : "#D8D2C4",
        borderWidth: hasYes ? 2 : 1,
      }}
      transition={{ duration: 0.28, ease: EASE_STANDARD }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {hasYes ? (
          <motion.div
            key="resonates"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta/15">
              <HeartHandshake size={18} className="text-terracotta" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink">
              {t("panel.resonates")}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/"
                className={`rounded-lg bg-indigo px-4 py-2.5 text-center text-sm font-semibold text-white ${pressable}`}
              >
                {t("findAMeeting")}
              </Link>
              <a
                href="tel:+911414000000"
                className={`rounded-lg border border-indigo px-4 py-2.5 text-center text-sm font-semibold text-indigo ${pressable}`}
              >
                {t("callHelpline")}
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-muted">
              <Info size={18} className="text-ink-muted" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {t("panel.default")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SelfCheck() {
  const t = useTranslations("selfCheck");
  const [answers, setAnswers] = useState<Record<number, Answer>>({});

  const QUESTIONS = [
    t("q1"),
    t("q2"),
    t("q3"),
    t("q4"),
    t("q5"),
    t("q6"),
    t("q7"),
    t("q8"),
  ];

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
            {t("heading")}
          </h1>
          <p className="mt-2 max-w-[680px] text-sm leading-relaxed text-ink-muted">
            {t("intro")}
          </p>

          <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1 lg:max-w-[680px]">
              <div className="flex gap-2">
                {QUESTIONS.map((_, index) => (
                  <span
                    key={`${index}-${answers[index] !== undefined}`}
                    aria-hidden="true"
                    className={`h-2 w-2 rounded-full motion-safe:transition-colors motion-safe:duration-[var(--duration-base)] ${
                      answers[index] !== undefined
                        ? "animate-dot-pop bg-indigo"
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
                        className={`rounded-lg border px-4 py-1.5 text-sm font-medium ${pressable} ${
                          answers[index] === "yes"
                            ? "border-indigo bg-indigo text-white"
                            : "border-border bg-white text-ink"
                        }`}
                      >
                        {t("yes")}
                      </button>
                      <button
                        type="button"
                        onClick={() => answer(index, "no")}
                        aria-pressed={answers[index] === "no"}
                        className={`rounded-lg border px-4 py-1.5 text-sm font-medium ${pressable} ${
                          answers[index] === "no"
                            ? "border-indigo bg-indigo text-white"
                            : "border-border bg-white text-ink"
                        }`}
                      >
                        {t("no")}
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
