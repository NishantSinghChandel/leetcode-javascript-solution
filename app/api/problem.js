import fs from "fs";
import path from "path";
import { getSlug, meta } from "./markdownRender"; // Adjust the path to your utility functions

const getProblems = () => {
  const problems = [];
  const pathReg = /^\d+-\d+$/;
  const fileReg = /\.md$/;
  const rootDir = path.resolve(process.cwd(), "../md/"); // Adjust the root directory as needed

  fs.readdirSync(rootDir).forEach((folder) => {
    if (!pathReg.test(folder)) return;
    fs.readdirSync(path.resolve(rootDir, folder)).forEach((file) => {
      if (!fileReg.test(file)) return;
      const markdown = fs.readFileSync(
        path.resolve(rootDir, folder, file),
        "utf-8"
      );
      //       const content = markdownRender(markdown);
      const id = meta.getId(markdown);
      const name = meta.getName(markdown);
      const slug = getSlug(name);
      const difficulty = {
        name: meta.getDifficulty(markdown),
        slug: getSlug(meta.getDifficulty(markdown)),
      };
      const tags = meta.getRelatedTopics(markdown).map((name) => ({
        name,
        slug: getSlug(name),
      }));
      const similarQuestions = meta
        .getSimilarQuestions(markdown)
        .map((name) => ({
          name,
          slug: getSlug(name),
        }));

      problems.push({
        id,
        name,
        slug,
        difficulty,
        tags,
        // content,
        similarQuestions,
      });
    });
  });

  return problems;
};

export async function GET() {
  const problems = getProblems();
  return new Response(JSON.stringify(problems), {
    headers: { "Content-Type": "application/json" },
  });
}
