import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const commitRepo = async (message: string) => {
  const repoPath = path.resolve(process.cwd(), ".mygit");
  const stagingPath = path.join(repoPath, "staging");
  const commitPath = path.join(repoPath, "commits");

  try {
    const commitId = uuidv4();
    const commitDir = path.join(commitPath, commitId);
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagingPath);
    for (const file of files) {
      await fs.copyFile(
        path.join(stagingPath, file),
        path.join(commitDir, file)
      );
    }
    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({ message, date: new Date().toISOString() })
    );

    console.log(`Committed with commit id: ${commitId}`);
  } catch (error) {
    console.error("Error committing repo", error);
  }
};
