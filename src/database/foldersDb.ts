import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { and, asc, eq, ilike, isNull, or } from "drizzle-orm";

import folders, { NewFolder } from "./models/folders";

import { IUpdateFolder } from "../interfaces/folders";

export class FoldersDb {
	constructor(private db: NodePgDatabase) {}

	public createFolder = async (newFolder: NewFolder) =>
		this.db
			.insert(folders)
			.values(newFolder)
			.returning()
			.then((res) => res[0]);

	public getListWithNullableParentId = async (userId: number, name: string) => {
		return this.db
			.select()
			.from(folders)
			.where(
				or(
					and(eq(folders.userId, userId), isNull(folders.parentId), ilike(folders.name, `%${name}%`)),
					and(eq(folders.isPublick, true), isNull(folders.parentId), ilike(folders.name, `%${name}%`))
				)
			)
			.orderBy(asc(folders.id));
	};

	public getListByParentId = async (userId: number, parentId: number, name: string) => {
		return this.db
			.select()
			.from(folders)
			.where(
				or(
					and(eq(folders.userId, userId), eq(folders.parentId, parentId), ilike(folders.name, `%${name}%`)),
					and(eq(folders.isPublick, true), eq(folders.parentId, parentId), ilike(folders.name, `%${name}%`))
				)
			)
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

	public updateEditors = async (id: number, editorsIds: number[]) =>
		this.db
			.update(folders)
			.set({
				editorsIds,
			})
			.where(eq(folders.id, id))
			.returning()
			.then((res) => res[0]);
}
