import { FoldersDb } from "../database/foldersDb";

import { INewFolder, IUpdateFolder } from "../interfaces/folders";

export class FoldersService {
	private foldersDb: FoldersDb;

	constructor(foldersDb: FoldersDb) {
		this.foldersDb = foldersDb;
	}

	create = (folder: INewFolder, userId: number) => {
		const newFolder = { ...folder, userId };
		return this.foldersDb.createFolder(newFolder);
	};

	getListByParentId = (userId: number, parentId: number, name: string) => {
		if (!parentId) {
			return this.foldersDb.getListWithNullableParentId(userId, name);
		}

		return this.foldersDb.getListByParentId(userId, parentId, name);
	};

	update = (folder: IUpdateFolder) => {
		return this.foldersDb.updateFolder(folder);
	};

	updateEditors = (id: number, editorsIds: number[]) => {
		return this.foldersDb.updateEditors(id, editorsIds);
	};
}
