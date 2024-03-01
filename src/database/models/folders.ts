import { pgTable, serial, varchar, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

import users from "./users";

const folders = pgTable("folders", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name").notNull(),
	isPublick: boolean("is_publick").notNull(),
	editorsIds: jsonb("editors").$type<number[]>(),
	parentId: integer("parent_id"),
	userId: integer("user_id")
		.references(() => users.id)
		.notNull(),
});

export default folders;

export type Folder = InferSelectModel<typeof folders>;
export type NewFolder = InferInsertModel<typeof folders>;
