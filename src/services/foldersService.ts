import { FoldersDb } from "../database/foldersDb";

import { FilesService } from "./filesService";

import { INewFolder, IUpdateFolder } from "../interfaces/folders";

export class FoldersService {
	private foldersDb: FoldersDb;
	private filesService: FilesService;

	constructor(foldersDb: FoldersDb, filesService: FilesService) {
		this.foldersDb = foldersDb;
		this.filesService = filesService;
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

	deleteFolder = async (userId: number, id: number) => {
		await this.foldersDb.deleteFolder(id);
		await this.filesService.deleteManyByFolderId(userId, id);

		return true;
	};
}
