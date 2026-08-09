export default function HelplineBar() {
  return (
    <div className="border-t-2 border-indigo bg-paper">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <p className="text-sm text-ink">
          <span className="font-medium">Need to talk to someone now?</span>{" "}
          You don&rsquo;t have to wait for a meeting.
        </p>
        <a
          href="tel:+911414000000"
          className="border border-indigo px-3 py-1.5 text-sm font-medium text-indigo"
        >
          Rajasthan AA Helpline: +91 141 400 0000
        </a>
      </div>
    </div>
  );
}
