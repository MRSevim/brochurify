import Container from "@/components/Container";
import Cta from "@/components/Homepage/Cta";
import Faq from "@/components/Homepage/Faq";
import Features from "@/components/Homepage/Features";
import PricingComparison from "@/components/Homepage/PricingComparison";
import Image from "next/image";

export default function Home() {
  return (
    <Container>
      <div className="flex flex-col-reverse items-center lg:flex-row gap-8 text-center">
        <div className="flex flex-col gap-2 mb-3">
          <h1 className="font-bold text-4xl"> Create your online brochure</h1>
          <h2 className="text-2xl">
            Create online presence in minutes and make it live
          </h2>
          <Cta />
        </div>
        <Image
          src="/hero.png"
          width={640}
          height={360}
          priority
          className="rounded max-w-full"
          alt="Screenshot of the builder"
        />
      </div>
      <Features />
      <PricingComparison />
      <Faq />
      <div className="my-20">
        <Cta />
      </div>
    </Container>
  );
}
