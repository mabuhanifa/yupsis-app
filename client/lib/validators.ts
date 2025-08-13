import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  apartment: z.string().optional(),
  city: z.string().min(1, { message: "City is required." }),
  country: z.string().min(1, { message: "Country is required." }),
  zipCode: z.string().min(1, { message: "ZIP code is required." }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
  shippingPostalCode: z
    .string()
    .min(4, { message: "Postal code must be at least 4 characters." }),
  shippingCountry: z
    .string()
    .min(2, { message: "Country must be at least 2 characters." }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
