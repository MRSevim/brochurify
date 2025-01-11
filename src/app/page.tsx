import Link from "next/link";

export default function Home() {
  return (
    <Link href="/builder">
      <button className="p-2 bg-slate-400	rounded">Go to Builder</button>
    </Link>
  );
}
