export default function TopBar() {
  return (
    <div className="relative h-14 shrink-0 overflow-hidden bg-indigo">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="jali-topbar"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M24 0 L48 24 L24 48 L0 24 Z M24 10 L38 24 L24 38 L10 24 Z"
              fill="none"
              stroke="#F7F4EE"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#jali-topbar)" opacity="0.15" />
      </svg>

      <div className="relative flex h-full items-center justify-between px-6">
        <span className="text-base font-semibold text-white">
          AA Rajasthan
        </span>
        <button type="button" className="text-sm text-white">
          EN | HI
        </button>
      </div>
    </div>
  );
}
