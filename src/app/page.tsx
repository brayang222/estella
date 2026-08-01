import { Hero } from "@/components/Hero";
import { Collection } from "@/components/Collection";
import { HowItsWorn } from "@/components/HowItsWorn";
import { Lookbook } from "@/components/Lookbook";
import { Studio } from "@/components/Studio";
import { Testimonials } from "@/components/Testimonials";
import { FinalCta } from "@/components/FinalCta";
import { ProductsJsonLd } from "@/components/JsonLd";
import { getProducts } from "@/lib/queries";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <ProductsJsonLd products={products} />
      <Hero />
      <Collection products={products} />
      <HowItsWorn />
      <Lookbook />
      <Studio />
      <Testimonials />
      <FinalCta />
    </>
  );
}
