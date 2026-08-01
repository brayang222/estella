import { Hero } from "@/components/Hero";
import { Collection } from "@/components/Collection";
import { HowItsWorn } from "@/components/HowItsWorn";
import { Lookbook } from "@/components/Lookbook";
import { Studio } from "@/components/Studio";
import { Testimonials } from "@/components/Testimonials";
import { FinalCta } from "@/components/FinalCta";
import { ProductsJsonLd } from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      <ProductsJsonLd />
      <Hero />
      <Collection />
      <HowItsWorn />
      <Lookbook />
      <Studio />
      <Testimonials />
      <FinalCta />
    </>
  );
}
