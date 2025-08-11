export const ssActivewearMapping = {
  product: {
    title: {
      transform: (item) =>
        `${item.brandName || ""} ${item.styleName || ""}`.trim(),
    },
    description: {
      key: "description",
      default: "No description available.",
    },
    vendor: {
      key: "brandName",
      default: "Unknown Vendor",
    },
  },
  variant: {
    title: {
      transform: (item) =>
        `${item.colorName || ""} / ${item.sizeName || ""}`.trim(),
    },
    sku: {
      key: "sku",
      required: true,
    },
    price: {
      key: "price",
      type: "number",
      default: 0.0,
    },
    cost: {
      key: "cost",
      type: "number",
      default: 0.0,
    },
    grams: {
      key: "grams",
      type: "integer",
      default: 0,
    },
  },
  inventory: {
    quantity: {
      key: "quantity",
      type: "integer",
      default: 0,
    },
  },
};
