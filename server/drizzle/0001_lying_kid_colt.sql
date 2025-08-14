ALTER TABLE "orders" ALTER COLUMN "shopify_order_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customer_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_address_1" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_address_2" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_city" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_postal_code" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_country" varchar(100) NOT NULL;