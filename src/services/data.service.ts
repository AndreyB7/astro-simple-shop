import type { LandingPageData } from "@/config/landing.interface";
import type { Product } from "@/config/products.type";
import landingData from "@/data/landing.json";

export const getLandingData = async (): Promise<LandingPageData> => {
  const data: LandingPageData = landingData;
  return data;
};

export const getProductsData = async (): Promise<Product[]> => {
	const url = 'https://script.google.com/macros/s/AKfycbwwCPZx_NDHDlnREuZI-k5OIQJh1YPZOzFML6TehjWIn-ZMfzYoAWdoFmA1vcPFdMd0mA/exec';
	const response = await fetch(url);
	const products: Product[] = convertTabularData(await response.json());
	return products;
};

// convert tabular data to array of objects
type ProductValue = string | number;
type ProductData = Record<string, ProductValue>;

function convertTabularData<T extends ProductData = ProductData>(
  data: (string | number)[][]
): T[] {
  if (data.length === 0) {
    return [];
  }

  const [headerRow, ...dataRows] = data;
  
  // Validate header contains only strings
  if (!headerRow.every(field => typeof field === 'string')) {
    throw new Error('Header row must contain only string field names');
  }
  
  const headers = headerRow as string[];
  
  return dataRows.map(row => {
    const obj: Record<string, ProductValue> = {};
    
    headers.forEach((header, index) => {
      obj[header] = row[index] ?? null;
    });
    
    return obj as T;
  });
}