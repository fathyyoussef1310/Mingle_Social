import {config} from "../config/env";
import {S3CloudProvider} from "../../pkg/cloud/s3.cloud";

   const  s3CloudProvider = new S3CloudProvider({
    region: config.s3.region,
    secretAccessKey: config.s3.secretAccessKey,
    accessKeyId:config.s3.accessKeyId,
    bucketName:config.s3.bucketName
})