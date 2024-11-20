import type { LandingPageData } from "@/config/landing.interface";
import type { ProductsData } from "@/config/products.type";
import landingData from "@/data/landing.json";
import productsData from "@/data/products.json";


export const getLandingData = async (): Promise<LandingPageData> => {
  const data: LandingPageData = landingData;
  return data;
};

export const getProductsData = async (): Promise<ProductsData> => {
  const data: ProductsData = productsData;
  return data;
};