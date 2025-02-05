import { promises as fs } from "fs";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, s3Bucket } from "../../config/awsConfig";

export const pushRepo = async () => {
  const repoPath = path.resolve(process.cwd(), ".mygit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitsPath);
    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);
      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        if (!s3Bucket) {
          throw new Error("s3Bucket is not defined");
        }
        const params = {
          Bucket: s3Bucket,
          Key: `commits/${commitDir}/${file}`,
          Body: fileContent,
        };
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
      }
    }
    console.log("Repo pushed successfully");
  } catch (error) {
    console.error("Error pushing repo", error);
  }
};
