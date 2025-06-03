"use client";
import Container from "@/components/Container";
import TemplateViewer from "@/components/Projects/TemplateViewer";
import { saveToLocalStorage } from "@/utils/Helpers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [adding, setAdding] = useState(false);
  const router = useRouter();
  return (
    <Container>
      <div className="homepage-hero text-center">
        <div className="flex flex-col gap-2 mb-3">
          <h1 className="font-bold text-4xl"> Build a brochurelike website</h1>
          <h2 className="text-2xl">And get the html</h2>
          <div className="flex gap-3 justify-center">
            <Link href="/builder">
              <button
                className="p-4 bg-slate-400 text-xl	rounded"
                onClick={() => {}}
              >
                Go to Builder
              </button>
            </Link>
            <button
              className="p-4 bg-amber text-xl	rounded "
              onClick={() => setAdding((prev) => !prev)}
            >
              Select From A Template
            </button>
          </div>
          {adding && (
            <TemplateViewer
              setAdding={setAdding}
              handleSelect={async (selectedTemplate: Record<string, any>) => {
                saveToLocalStorage({ ...selectedTemplate.data });
                router.push("/builder");
              }}
              positiveActionText="Use"
            />
          )}
        </div>
      </div>
    </Container>
  );
}
