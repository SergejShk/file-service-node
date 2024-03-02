import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { and, asc, eq, ilike, isNull, or } from "drizzle-orm";

import files, { NewFile } from "./models/files";
import { IUpdateFile } from "../interfaces/files";

export class FilesDb {
	constructor(private db: NodePgDatabase) {}

	public createFolder = async (newFile: NewFile) =>
		this.db
			.insert(files)
			.values(newFile)
			.returning()
			.then((res) => res[0]);

	public getListWithNullableFolderId = async (userId: number, name: string) => {
		return this.db
			.select()
			.from(files)
			.where(
				or(
					and(eq(files.userId, userId), isNull(files.folderId), ilike(files.name, `%${name}%`)),
					and(eq(files.isPublick, true), isNull(files.folderId), ilike(files.name, `%${name}%`))
				)
			)
			.orderBy(asc(files.id));
	};

	public getListByFolderId = async (userId: number, folderId: number, name: string) => {
		return this.db
			.select()
			.from(files)
			.where(
				or(
					and(eq(files.userId, userId), eq(files.folderId, folderId), ilike(files.name, `%${name}%`)),
					and(eq(files.isPublick, true), eq(files.folderId, folderId), ilike(files.name, `%${name}%`))
				)
			)
			.orderBy(asc(files.id));
	};

	public updateFile = async (file: IUpdateFile) =>
		this.db
			.update(files)
			.set({
				name: file.name,
				isPublick: file.isPublick,
			})
			.where(eq(files.id, file.id))
			.returning()
			.then((res) => res[0]);

	public updateEditors = async (id: number, editorsIds: number[]) =>
		this.db
			.update(files)
			.set({
				editorsIds,
			})
			.where(eq(files.id, id))
			.returning()
			.then((res) => res[0]);
}
