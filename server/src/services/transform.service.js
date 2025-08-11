import { ssActivewearMapping } from "../config/mapping.config.js";

const applyMapping = (source, mapping) => {
  const result = {};

  for (const targetKey in mapping) {
    const rule = mapping[targetKey];
    let value;

    if (rule.transform) {
      value = rule.transform(source);
    } else if (rule.key) {
      value = source[rule.key];
    }

    if (value === undefined || value === null) {
      value = rule.default;
    }

    if (value !== undefined && value !== null && rule.type) {
      if (rule.type === "number") value = parseFloat(value);
      if (rule.type === "integer") value = parseInt(value, 10);
      if (isNaN(value)) value = rule.default;
    }

    if (rule.required && (value === undefined || value === null)) {
      throw new Error(
        `Required field "${targetKey}" (${rule.key}) is missing or null.`
      );
    }

    if (value !== undefined) {
      result[targetKey] = value;
    }
  }
  return result;
};

const transformProduct = (apiProduct) => {
  const transformedProduct = applyMapping(
    apiProduct,
    ssActivewearMapping.product
  );

  if (apiProduct.variants && Array.isArray(apiProduct.variants)) {
    transformedProduct.variants = apiProduct.variants.map((apiVariant) => {
      const transformedVariant = applyMapping(
        apiVariant,
        ssActivewearMapping.variant
      );
      const transformedInventory = applyMapping(
        apiVariant,
        ssActivewearMapping.inventory
      );
      transformedVariant.inventory = transformedInventory;
      return transformedVariant;
    });
  } else {
    transformedProduct.variants = [];
  }

  return transformedProduct;
};

export const transformService = {
  transformProduct,
};
