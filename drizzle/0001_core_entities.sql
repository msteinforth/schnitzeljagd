CREATE TYPE "public"."answer_outcome" AS ENUM('next_station', 'wrong_place', 'wrong_message');--> statement-breakpoint
CREATE TYPE "public"."collaborator_role" AS ENUM('owner', 'observer');--> statement-breakpoint
CREATE TYPE "public"."hunt_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."media_status" AS ENUM('uploading', 'processing', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('video', 'image', 'audio');--> statement-breakpoint
CREATE TYPE "public"."message_kind" AS ENUM('text', 'photo', 'audio', 'help', 'emergency');--> statement-breakpoint
CREATE TYPE "public"."message_sender" AS ENUM('player', 'adult', 'character');--> statement-breakpoint
CREATE TYPE "public"."puzzle_type" AS ENUM('choice', 'text', 'number');--> statement-breakpoint
CREATE TYPE "public"."run_state" AS ENUM('navigating', 'arrived', 'video_before', 'puzzle', 'video_after', 'wrong_place', 'paused', 'finished');--> statement-breakpoint
CREATE TYPE "public"."station_type" AS ENUM('start', 'regular', 'wrong', 'finish');--> statement-breakpoint
CREATE TABLE "answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"puzzle_id" uuid NOT NULL,
	"label" text,
	"accepted_values" text[] DEFAULT '{}'::text[] NOT NULL,
	"is_fallback" boolean DEFAULT false NOT NULL,
	"outcome" "answer_outcome" NOT NULL,
	"target_station_id" uuid,
	"message" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collaborators" (
	"hunt_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "collaborator_role" DEFAULT 'observer' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "collaborators_hunt_id_user_id_pk" PRIMARY KEY("hunt_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "hints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"puzzle_id" uuid NOT NULL,
	"sort_order" integer NOT NULL,
	"text" text,
	"media_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hints_puzzle_order_unique" UNIQUE("puzzle_id","sort_order")
);
--> statement-breakpoint
CREATE TABLE "hunt_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hunt_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hunt_versions_hunt_version_unique" UNIQUE("hunt_id","version")
);
--> statement-breakpoint
CREATE TABLE "hunts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"birthday_child_name" text,
	"birthday_child_age" integer,
	"event_date" timestamp with time zone,
	"theme_key" text NOT NULL,
	"theme_overrides" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "hunt_status" DEFAULT 'draft' NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"intro_media_id" uuid,
	"finale_media_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "location_pings" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"run_id" uuid NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"accuracy" real,
	"heading" real,
	"battery_level" real,
	"recorded_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"hunt_id" uuid,
	"type" "media_type" NOT NULL,
	"status" "media_status" DEFAULT 'uploading' NOT NULL,
	"storage_key" text NOT NULL,
	"content_type" text NOT NULL,
	"size_bytes" integer,
	"hls_url" text,
	"duration_seconds" real,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_storage_key_unique" UNIQUE("storage_key")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"run_id" uuid NOT NULL,
	"sender_type" "message_sender" NOT NULL,
	"sender_user_id" uuid,
	"kind" "message_kind" DEFAULT 'text' NOT NULL,
	"body" text,
	"media_id" uuid,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "puzzles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"station_id" uuid NOT NULL,
	"type" "puzzle_type" NOT NULL,
	"title" text NOT NULL,
	"question" text NOT NULL,
	"image_media_id" uuid,
	"video_media_id" uuid,
	"penalty_seconds" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "puzzles_station_id_unique" UNIQUE("station_id")
);
--> statement-breakpoint
CREATE TABLE "run_events" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"run_id" uuid NOT NULL,
	"type" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hunt_version_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"access_token" text NOT NULL,
	"device_id" text,
	"emergency_phone" text NOT NULL,
	"team_name" text,
	"state" "run_state" DEFAULT 'navigating' NOT NULL,
	"current_station_id" uuid,
	"is_test" boolean DEFAULT false NOT NULL,
	"retention_days" integer DEFAULT 30 NOT NULL,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "runs_access_token_unique" UNIQUE("access_token")
);
--> statement-breakpoint
CREATE TABLE "stations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hunt_id" uuid NOT NULL,
	"type" "station_type" DEFAULT 'regular' NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"radius_m" integer DEFAULT 20 NOT NULL,
	"location_hint" text,
	"message" text,
	"media_before_id" uuid,
	"media_after_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "themes" (
	"key" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"tokens" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"assets" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"map_style" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"vocabulary" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"phone" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_puzzle_id_puzzles_id_fk" FOREIGN KEY ("puzzle_id") REFERENCES "public"."puzzles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_target_station_id_stations_id_fk" FOREIGN KEY ("target_station_id") REFERENCES "public"."stations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_hunt_id_hunts_id_fk" FOREIGN KEY ("hunt_id") REFERENCES "public"."hunts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaborators" ADD CONSTRAINT "collaborators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hints" ADD CONSTRAINT "hints_puzzle_id_puzzles_id_fk" FOREIGN KEY ("puzzle_id") REFERENCES "public"."puzzles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hints" ADD CONSTRAINT "hints_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hunt_versions" ADD CONSTRAINT "hunt_versions_hunt_id_hunts_id_fk" FOREIGN KEY ("hunt_id") REFERENCES "public"."hunts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hunts" ADD CONSTRAINT "hunts_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hunts" ADD CONSTRAINT "hunts_theme_key_themes_key_fk" FOREIGN KEY ("theme_key") REFERENCES "public"."themes"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hunts" ADD CONSTRAINT "hunts_intro_media_id_media_id_fk" FOREIGN KEY ("intro_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hunts" ADD CONSTRAINT "hunts_finale_media_id_media_id_fk" FOREIGN KEY ("finale_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_pings" ADD CONSTRAINT "location_pings_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_hunt_id_hunts_id_fk" FOREIGN KEY ("hunt_id") REFERENCES "public"."hunts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_user_id_users_id_fk" FOREIGN KEY ("sender_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "puzzles" ADD CONSTRAINT "puzzles_station_id_stations_id_fk" FOREIGN KEY ("station_id") REFERENCES "public"."stations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "puzzles" ADD CONSTRAINT "puzzles_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "puzzles" ADD CONSTRAINT "puzzles_video_media_id_media_id_fk" FOREIGN KEY ("video_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "run_events" ADD CONSTRAINT "run_events_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runs" ADD CONSTRAINT "runs_hunt_version_id_hunt_versions_id_fk" FOREIGN KEY ("hunt_version_id") REFERENCES "public"."hunt_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runs" ADD CONSTRAINT "runs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stations" ADD CONSTRAINT "stations_hunt_id_hunts_id_fk" FOREIGN KEY ("hunt_id") REFERENCES "public"."hunts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stations" ADD CONSTRAINT "stations_media_before_id_media_id_fk" FOREIGN KEY ("media_before_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stations" ADD CONSTRAINT "stations_media_after_id_media_id_fk" FOREIGN KEY ("media_after_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "answers_puzzle_idx" ON "answers" USING btree ("puzzle_id","sort_order");--> statement-breakpoint
CREATE INDEX "collaborators_user_idx" ON "collaborators" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "hunts_owner_idx" ON "hunts" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "location_pings_run_idx" ON "location_pings" USING btree ("run_id","recorded_at");--> statement-breakpoint
CREATE INDEX "media_owner_idx" ON "media" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "media_hunt_idx" ON "media" USING btree ("hunt_id");--> statement-breakpoint
CREATE INDEX "messages_run_idx" ON "messages" USING btree ("run_id","created_at");--> statement-breakpoint
CREATE INDEX "run_events_run_idx" ON "run_events" USING btree ("run_id","created_at");--> statement-breakpoint
CREATE INDEX "runs_hunt_version_idx" ON "runs" USING btree ("hunt_version_id");--> statement-breakpoint
CREATE INDEX "stations_hunt_idx" ON "stations" USING btree ("hunt_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_lower_idx" ON "users" USING btree (lower("email"));