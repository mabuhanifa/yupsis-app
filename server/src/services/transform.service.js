import { ssActivewearMapping } from "../config/mapping.config.js";

const getValue = (source, keyOrFn) => {
  if (typeof keyOrFn === "function") {
    return keyOrFn(source);
  }
  return source[keyOrFn];
};

const transformProduct = (apiProduct) => {
  const mapping = ssActivewearMapping;

  const transformed = {
    title: getValue(apiProduct, mapping.product.title),
    description: getValue(apiProduct, mapping.product.description),
    vendor: getValue(apiProduct, mapping.product.vendor),
    variants: [],
  };

  if (apiProduct.variants && Array.isArray(apiProduct.variants)) {
    transformed.variants = apiProduct.variants.map((apiVariant) => {
      const variant = {
        title: getValue(apiVariant, mapping.variant.title),
        sku: getValue(apiVariant, mapping.variant.sku),
        price: getValue(apiVariant, mapping.variant.price),
        cost: getValue(apiVariant, mapping.variant.cost),
        grams: getValue(apiVariant, mapping.variant.grams),
        inventory: {
          quantity: getValue(apiVariant, mapping.inventory.quantity),
        },
      };
      return variant;
    });
  }

  return transformed;
};

export const transformService = {
  transformProduct,
};
