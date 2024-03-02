import { Endpoint, S3 } from "aws-sdk";

import { FilesDb } from "../database/filesDb";

import { INewFile, IS3PresignedPostResponse, IUpdateFile } from "../interfaces/files";

export class FilesService {
	private filesDb: FilesDb;
	private endpoint: Endpoint;
	private S3: S3;
	private bucketName: string;

	constructor(filesDb: FilesDb) {
		this.filesDb = filesDb;
		this.endpoint = new Endpoint(`s3.${process.env.S3_REGION}.amazonaws.com`);
		this.S3 = new S3({
			endpoint: this.endpoint,
			apiVersion: "2012-10-17",
			region: process.env.S3_REGION,
		});
		this.bucketName = process.env.S3_BUCKET_NAME || "";
	}

	public createPresignedPost = async (key: string, type: string): Promise<IS3PresignedPostResponse> => {
		const splitedKey = key.split(".");
		const [newKey, t] = splitedKey;

		const result = await this.S3.createPresignedPost({
			Bucket: this.bucketName,
			Fields: {
				key: `${newKey}-${+new Date()}.${type.split("/").pop()}`,
				"Content-Type": type,
			},
			Conditions: [{ "Content-Type": type }],
			Expires: 600,
		});

		return result as unknown as IS3PresignedPostResponse;
	};

	create = (file: INewFile, userId: number) => {
		const newFile = { ...file, userId };
		return this.filesDb.createFolder(newFile);
	};

	getListByFolderId = (userId: number, folderId: number, name: string) => {
		if (!folderId) {
			return this.filesDb.getListWithNullableFolderId(userId, name);
		}

		return this.filesDb.getListByFolderId(userId, folderId, name);
	};

	getObject = (key: string): string => encodeURI(`https://${this.bucketName}.s3.amazonaws.com/${key}`);

	update = (file: IUpdateFile) => {
		return this.filesDb.updateFile(file);
	};

	updateEditors = (id: number, editorsIds: number[]) => {
		return this.filesDb.updateEditors(id, editorsIds);
	};
}
