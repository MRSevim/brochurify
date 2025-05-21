"use client";
import { usePreview } from "@/contexts/PreviewContext";
import BuilderComp from "@/components/BuilderComponents/Builder";
import Preview from "@/components/Preview";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Builder() {
  const [preview, setPreview] = usePreview();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("preview")) {
      setPreview(true);
    }
  }, [setPreview]);

  useEffect(() => {
    if (preview) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("preview", "true");
      router.push(pathname + "?" + params.toString());
    } else {
      router.push(pathname);
    }
  }, [preview]);

  return (
    <main className="flex flex-1 overflow-hidden">
      {preview ? <Preview /> : <BuilderComp />}
    </main>
  );
}
