import Link from "next/link";
import Container from "../Container";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-background justify-self-end">
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
