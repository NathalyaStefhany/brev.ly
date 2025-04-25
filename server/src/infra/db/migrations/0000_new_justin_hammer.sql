CREATE TABLE "shortened_links" (
	"id" text PRIMARY KEY NOT NULL,
	"original_link" text NOT NULL,
	"shortened_link" text NOT NULL,
	"quantity_accesses" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shortened_links_shortened_link_unique" UNIQUE("shortened_link")
);
