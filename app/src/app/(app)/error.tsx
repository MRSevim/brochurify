"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Container from "@/components/Container";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Container>
      <div className="bg-background shadow-lg rounded-2xl p-8 max-w-md w-full text-center text-text left-1/2 relative -translate-x-1/2">
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
        <h1 className="text-2xl font-bold mb-2">Something went wrong!</h1>
        <p className="text-gray-600 mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Try Again
        </button>
      </div>
    </Container>
  );
}
