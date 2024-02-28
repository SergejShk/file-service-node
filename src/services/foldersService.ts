import { FoldersDb } from "../database/foldersDb";

import { INewFolder } from "../interfaces/folders";

export class FoldersService {
	private foldersDb: FoldersDb;

	constructor(foldersDb: FoldersDb) {
		this.foldersDb = foldersDb;
	}

	create = (folder: INewFolder, userId: number) => {
		const newFolder = { ...folder, userId };
		return this.foldersDb.createFolder(newFolder);
	};
}
