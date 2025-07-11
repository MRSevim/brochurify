"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "../Container";

const Footer = () => {
  const pathname = usePathname();

  // Don't show footer on /builder or any subpath like /builder/xyz
  if (pathname.startsWith("/builder")) return null;
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-background">
      <Container pushedVertically={false} addBottomMargin={false}>
        <div className="my-6 flex flex-col sm:flex-row items-center justify-between text-sm">
          <div>© {year} Brochurify. All rights reserved.</div>
          <Link
            href="/terms"
            className="text-muted-foreground hover:underline mt-2 sm:mt-0"
          >
            Terms of Service
          </Link>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
