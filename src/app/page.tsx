import { Hero } from "@/components/Hero";
import { Collection } from "@/components/Collection";
import { HowItsWorn } from "@/components/HowItsWorn";
import { Lookbook } from "@/components/Lookbook";
import { Studio } from "@/components/Studio";
import { Testimonials } from "@/components/Testimonials";
import { FinalCta } from "@/components/FinalCta";
import { ProductsJsonLd } from "@/components/JsonLd";
import { catalogCategories, getCategories, getProducts, inCatalog } from "@/lib/queries";

export default async function Home() {
  const [allProducts, allCategories] = await Promise.all([getProducts(), getCategories()]);
  const products = inCatalog(allProducts);
  const categories = catalogCategories(allCategories);

  return (
    <>
      <ProductsJsonLd products={products} />
      <Hero />
      <Collection products={products} categories={categories} />
      <HowItsWorn />
      <Lookbook />
      <Studio />
      <Testimonials />
      <FinalCta />
    </>
  );
}
