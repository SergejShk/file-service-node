import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { and, asc, eq, isNull } from "drizzle-orm";

import folders, { NewFolder } from "./models/folders";
import { IUpdateFolder } from "@/interfaces/folders";

export class FoldersDb {
	constructor(private db: NodePgDatabase) {}

	public createFolder = async (newFolder: NewFolder) =>
		this.db
			.insert(folders)
			.values(newFolder)
			.returning()
			.then((res) => res[0]);

	public getListWithNullableParentId = async (userId: number) => {
		return this.db
			.select()
			.from(folders)
			.where(and(eq(folders.userId, userId), isNull(folders.parentId)))
			.orderBy(asc(folders.id));
	};

	public getListByParentId = async (userId: number, parentId: number) => {
		return this.db
			.select()
			.from(folders)
			.where(and(eq(folders.userId, userId), eq(folders.parentId, parentId)))
			.orderBy(asc(folders.id));
	};

	public updateFolder = async (folder: IUpdateFolder) =>
		this.db
			.update(folders)
			.set({
				name: folder.name,
				isPublick: folder.isPublick,
			})
			.where(eq(folders.id, folder.id))
			.returning()
			.then((res) => res[0]);
}
