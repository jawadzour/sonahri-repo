CREATE TABLE "donations" (
	"id" serial PRIMARY KEY NOT NULL,
	"donorName" varchar(255) NOT NULL,
	"donorEmail" varchar(320) NOT NULL,
	"donorPhone" varchar(50) NOT NULL,
	"amount" varchar(32) NOT NULL,
	"currency" varchar(8) DEFAULT 'PKR' NOT NULL,
	"program" varchar(255),
	"message" text,
	"paymentMethod" varchar(32) NOT NULL,
	"transactionReference" varchar(255) NOT NULL,
	"screenshotUrl" text,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(50),
	"subject" varchar(255),
	"message" text NOT NULL,
	"inquiryType" varchar(64) DEFAULT 'general' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
