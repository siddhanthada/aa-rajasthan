export default function AboutAA() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[680px] px-4 py-8 sm:px-6">
        <h1 className="text-[22px] font-semibold text-ink">About AA</h1>

        <div className="mt-8 flex flex-col gap-8">
          <section>
            <h2 className="text-base font-semibold text-ink">
              How AA works
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              AA has no leaders, no dues, and isn&rsquo;t affiliated with any
              religion, political group, or institution. Members follow the
              Twelve Steps, a set of principles for recovery, and the Twelve
              Traditions, which describe how AA groups stay unified and
              self-supporting.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink">
              AA in Rajasthan
            </h2>
            <div className="mt-2 rounded-xl border border-dashed border-border p-4">
              <p className="text-sm leading-relaxed text-ink-muted">
                This section is reserved for AA Rajasthan&rsquo;s own
                history, to be added by local intergroup volunteers.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
