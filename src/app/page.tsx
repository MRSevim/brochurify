import Container from "@/components/Container";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
      <div className="homepage-hero text-center">
        <div className="flex flex-col gap-2 mb-3">
          <h1 className="font-bold text-4xl"> Build a brochure like website</h1>
          <h2 className="text-2xl">And get the html</h2>
          <Link href="/builder">
            <button className="p-4 bg-slate-400 text-xl	rounded">
              Go to Builder
            </button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
