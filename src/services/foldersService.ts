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

	getListByUserId = (userId: number) => {
		return this.foldersDb.getListByUserId(userId);
	};

	getListByParentId = (userId: number, parentId: number) => {
		if (!parentId) {
			return this.foldersDb.getListWithNullableParentId(userId);
		}

		return this.foldersDb.getListByParentId(userId, parentId);
	};
}
