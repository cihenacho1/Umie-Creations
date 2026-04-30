import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-blush-500">
        404
      </p>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-cocoa-700">
        Page not found
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-cocoa-600">
        That URL does not exist here. If Chrome shows Internal Server Error on
        localhost only, stop stray Node servers (often something is still bound
        to port 3000) and reload the Local URL printed in{" "}
        <span className="font-medium">your terminal</span> — Next sometimes moves
        to 3002, 3003, etc. when the default port is busy.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-cocoa-600 px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-cocoa-700"
      >
        Back to home
      </Link>
    </div>
  );
}
