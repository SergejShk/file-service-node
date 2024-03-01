import { pgTable, serial, varchar, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

import users from "./users";

const files = pgTable("files", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name").notNull(),
	key: varchar("key").notNull(),
	isPublick: boolean("is_publick").notNull(),
	editorsIds: jsonb("editors").$type<number[]>(),
	folderId: integer("folder_id"),
	userId: integer("user_id")
		.references(() => users.id)
		.notNull(),
});

export default files;

export type File = InferSelectModel<typeof files>;
export type NewFile = InferInsertModel<typeof files>;
