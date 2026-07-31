import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "projects_services" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"service" varchar
  );

  CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"client" varchar,
	"year" numeric,
	"summary" varchar,
	"featured_image_id" integer,
	"project_u_r_l" varchar,
	"sort_order" numeric DEFAULT 0,
	"published_at" timestamp(3) with time zone,
	"generate_slug" boolean DEFAULT true,
	"slug" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_projects_status" DEFAULT 'draft'
  );

  CREATE TABLE "_projects_v_version_services" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"service" varchar,
	"_uuid" varchar
  );

  CREATE TABLE "_projects_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_client" varchar,
	"version_year" numeric,
	"version_summary" varchar,
	"version_featured_image_id" integer,
	"version_project_u_r_l" varchar,
	"version_sort_order" numeric DEFAULT 0,
	"version_published_at" timestamp(3) with time zone,
	"version_generate_slug" boolean DEFAULT true,
	"version_slug" varchar,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean,
	"autosave" boolean
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "projects_services" ADD CONSTRAINT "projects_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_services" ADD CONSTRAINT "_projects_v_version_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_services_order_idx" ON "projects_services" USING btree ("_order");
  CREATE INDEX "projects_services_parent_id_idx" ON "projects_services" USING btree ("_parent_id");
  CREATE INDEX "projects_featured_image_idx" ON "projects" USING btree ("featured_image_id");
  CREATE INDEX "projects_sort_order_idx" ON "projects" USING btree ("sort_order");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "_projects_v_version_services_order_idx" ON "_projects_v_version_services" USING btree ("_order");
  CREATE INDEX "_projects_v_version_services_parent_id_idx" ON "_projects_v_version_services" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_featured_image_idx" ON "_projects_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_projects_v_version_version_sort_order_idx" ON "_projects_v" USING btree ("version_sort_order");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_autosave_idx" ON "_projects_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_services" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "_projects_v_version_services" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";

  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_status";`)
}
