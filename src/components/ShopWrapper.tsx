import type { Product } from "@/config/products.type";
import React, { memo } from "react";
import Shop from "./Shop";
import { ShopProvider } from "./ShopContext";
import ShopErrorBoundary from "./ShopErrorBoundary";

type Props = {
	products: Product[];
	productCategories: string[];
}

const ShopWrapper: React.FC<Props> = memo(({ products, productCategories }: Props) => {
	if (!Array.isArray(products) || !Array.isArray(productCategories)) {
		console.error('Invalid props provided to ShopWrapper:', { products, productCategories });
		return null;
	}

	return (
		<ShopErrorBoundary>
			<ShopProvider>
				<Shop
					products={products}
					productCategories={productCategories}
				/>
			</ShopProvider>
		</ShopErrorBoundary>
	);
});

ShopWrapper.displayName = 'ShopWrapper';

export default ShopWrapper;