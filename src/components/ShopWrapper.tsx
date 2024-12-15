import type { ProductsData } from "@/config/products.type";
import React from "react";
import Shop from "./Shop";
import { ShopProvider } from "./ShopContext";

type Props = {
	products: ProductsData;
	productCategories: string[];
}

const ShopWrapper = ({ products, productCategories }: Props) => (
	<ShopProvider>
		<Shop
			products={products}
			productCategories={productCategories}
		/>
	</ShopProvider>
)

export default ShopWrapper;