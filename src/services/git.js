/**
 * Git Utility
 *
 * Handles committing and pushing daily markdown files
 */

import { execSync } from "child_process";
import path from "path";

export function commitAndPushDaily(date) {
  const dailyDir = path.resolve("daily");

  try {
    // 配置 Git 用户信息（CI friendly）
    execSync("git config user.name 'ai-daily-bot'");
    execSync("git config user.email 'ai-daily-bot@users.noreply.github.com'");

    // 添加 daily 文件夹下的更新
    execSync(`git add ${dailyDir}`);

    // 提交
    const commitMessage = `chore: add AI Daily Calendar for ${date}`;
    execSync(`git commit -m "${commitMessage}"`, { stdio: "ignore" });

    // Push
    execSync("git push", { stdio: "ignore" });

    console.log("✅ Git commit & push successful");
  } catch (err) {
    if (err.message.includes("nothing to commit")) {
      console.log("ℹ No changes to commit");
    } else {
      console.error("❌ Git operation failed:", err.message);
    }
  }
}
