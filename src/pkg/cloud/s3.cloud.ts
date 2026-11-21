import { ICloudProvider } from "./cloud.interface";
import {S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand,} from "@aws-sdk/client-s3";

interface S3Config {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
}

export class S3CloudProvider implements ICloudProvider {
    private client: S3Client;
    private bucketName: string;

    constructor(config:S3Config) {
        this.client = new S3Client({
            region: config.region,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
        });

        this.bucketName = config.bucketName;
    }

    async getFile(key: string): Promise<Buffer> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        const response = await this.client.send(command);
        if (!response.Body) {
            throw new Error("File not found");
        }
        const bytes = await response.Body.transformToByteArray();
        return Buffer.from(bytes);
    }

    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        await this.client.send(command);
    }

    async uploadFile(file: any, path: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: path,
            Body: Buffer.isBuffer(file) ? file : file.buffer,
            ContentType: file.mimetype,
        });
        await this.client.send(command);
        return path;
    }
}

