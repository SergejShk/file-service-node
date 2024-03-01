import { NodePgDatabase } from "drizzle-orm/node-postgres";

import files, { NewFile } from "./models/files";

export class FilesDb {
	constructor(private db: NodePgDatabase) {}

	public createFolder = async (newFile: NewFile) =>
		this.db
			.insert(files)
			.values(newFile)
			.returning()
			.then((res) => res[0]);
}
