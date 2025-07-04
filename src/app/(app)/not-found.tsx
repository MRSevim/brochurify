import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-background shadow-lg rounded-2xl p-8 max-w-md w-full text-center text-text left-1/2 relative -translate-x-1/2 top-[10%]">
      <div className="mb-4">
        <svg
          className="w-16 h-16 mx-auto text-red-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3m0 4h.01M21 12A9 9 0 103 12a9 9 0 0018 0z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-2">Not Found</h1>
      <p className="text-gray-600 mb-6">Could not find requested resource</p>
      <Link
        href="/"
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Home
      </Link>
    </div>
  );
}
