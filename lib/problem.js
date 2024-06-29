import fs from "fs";
import path from "path";
import getSlug from "./slug";
import meta from "./meta";

const getProblems = () => {
  const problems = [];
  const pathReg = /^\d+-\d+$/;
  const fileReg = /\.md$/;
  const rootDir = path.resolve(process.cwd(), "./app/md/"); // Adjust the root directory as needed
  const difficultyMap = {};
  const difficultyList = [];
  const tagMap = {};
  const tagList = [];

  fs.readdirSync(rootDir).forEach((folder) => {
    if (!pathReg.test(folder)) return;
    fs.readdirSync(path.resolve(rootDir, folder)).forEach((file) => {
      if (!fileReg.test(file)) return;
      const markdown = fs.readFileSync(
        path.resolve(rootDir, folder, file),
        "utf-8"
      );
      const content = markdown;
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

      // const similarQuestions = meta
      //   .getSimilarQuestions(markdown)
      //   .map((name) => ({
      //     name,
      //     slug: getSlug(name),
      //   }));

      if (!difficultyMap[difficulty.slug]) {
        difficultyMap[difficulty.slug] = difficulty.name;
        difficultyList.push({
          name: difficulty.name,
          slug: difficulty.slug,
        });
      }
      const tagsSearch = [];
      tags.forEach((tag) => {
        tagsSearch.push(tag.slug);
        if (!tagMap[tag.slug]) {
          tagMap[tag.slug] = tag.name;
          tagList.push({
            name: tag.name,
            slug: tag.slug,
          });
        }
      });

      problems.push({
        id,
        name,
        slug,
        difficulty,
        tags,
        tagsSearch,
        content,
        // similarQuestions,
      });
    });
  });

  return { problems, difficultyList, tagList };
};

// Function to find problem by ID or slug
const findProblem = (idOrSlug) => {
  console.log("🚀 ~ findProblem ~ idOrSlug:", idOrSlug);
  const { problems } = getProblems();

  // Check if ID matches a folder range or slug matches a filename
  const foundProblem = problems.find((problem) => {
    return problem.id === idOrSlug || problem.slug === idOrSlug;
  });

  return foundProblem || null;
};

export async function getProblemsRequest() {
  const problems = getProblems();
  return new Response(JSON.stringify(problems), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function getProblemsByIdSlugRequest(idOrSlug) {
  const problems = findProblem(idOrSlug);
  return new Response(JSON.stringify(problems), {
    headers: { "Content-Type": "application/json" },
  });
}
