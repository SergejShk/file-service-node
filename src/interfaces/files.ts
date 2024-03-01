interface IS3PresignedPostFieldsResponse {
	key: string;
	acl: string;
	bucket: string;
	"X-Amz-Algorithm": string;
	"X-Amz-Credential": string;
	"X-Amz-Date": string;
	Policy: string;
	"X-Amz-Signature": string;
}

export interface IS3PresignedPostResponse {
	url: string;
	fields: IS3PresignedPostFieldsResponse;
}

export interface INewFile {
	name: string;
	key: string;
	isPublick: boolean;
	editorsIds?: number[] | null;
	folderId?: number | null;
}
