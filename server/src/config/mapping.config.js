export const ssActivewearMapping = {
  product: {
    title: (item) => `${item.brandName} ${item.styleName}`,
    description: "description",
    vendor: "brandName",
  },
  variant: {
    title: (item) => `${item.colorName} / ${item.sizeName}`,
    sku: "sku",
    price: "price",
    cost: "cost",
    grams: "grams",
  },
  inventory: {
    quantity: "quantity",
  },
};
