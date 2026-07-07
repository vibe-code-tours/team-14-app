import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-emerald-600 text-white p-4 sticky top-0 z-10 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl flex items-center gap-2 hover:text-emerald-200 transition">
          <span>🌏</span> WorkerVoice
        </Link>
        <div className="space-x-2 md:space-x-4 text-sm md:text-base">
          <Link href="/" className="hover:text-emerald-200 transition">
            Home
          </Link>
          <Link href="/factories" className="hover:text-emerald-200 transition">
            Factories
          </Link>
          <Link href="/agencies" className="hover:text-emerald-200 transition">
            Agencies
          </Link>
          <Link
            href="/suggest"
            className="bg-white text-emerald-600 px-4 py-1.5 rounded-full font-semibold shadow-sm hover:bg-gray-100 transition"
          >
            Suggest
          </Link>
        </div>
      </div>
    </nav>
  );
}
