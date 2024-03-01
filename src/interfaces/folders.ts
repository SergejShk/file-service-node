export interface INewFolder {
	name: string;
	isPublick: boolean;
	editorsIds?: number[];
	parentId?: number;
}

export interface IFolder {
	id: number;
	name: string;
	isPublick: boolean;
	editorsIds: number[] | null;
	parentId: number | null;
	userId: number;
}

export interface IUpdateFolder {
	id: number;
	name: string;
	isPublick: boolean;
}
