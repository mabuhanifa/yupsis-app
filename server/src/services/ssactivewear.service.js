const fetchProducts = async () => {
  console.log("Fetching products from SSActiveWear API...");

  return Promise.resolve([
    {
      styleID: "G500",
      brandName: "Gildan",
      styleName: "Heavy Cotton T-Shirt",
      description: "A classic, durable t-shirt.",
      variants: [
        {
          colorName: "White",
          sizeName: "L",
          sku: "G500-WHT-L",
          price: 3.5,
          cost: 1.75,
          grams: 150,
          quantity: 100,
        },
        {
          colorName: "Black",
          sizeName: "L",
          sku: "G500-BLK-L",
          price: 3.5,
          cost: 1.75,
          grams: 150,
          quantity: 50,
        },
      ],
    },
  ]);
};

export const ssActivewearService = {
  fetchProducts,
};
