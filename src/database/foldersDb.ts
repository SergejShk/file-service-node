import { NodePgDatabase } from "drizzle-orm/node-postgres";

import folders, { NewFolder } from "./models/folders";

export class FoldersDb {
	constructor(private db: NodePgDatabase) {}

	public createFolder = async (newFolder: NewFolder) =>
		this.db
			.insert(folders)
			.values(newFolder)
			.returning()
			.then((res) => res[0]);
}
