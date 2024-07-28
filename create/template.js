import markdownRender from "@/lib/markdownRender";
import Link from "next/link";
import "@/app/globals.css";
import Footer from "@/app/components/footer";

const response = {
        title : "{{id}}. {{name}}",
        similarQuestions: {{similarQuestionList}},
        tags: "{{relatedTopicList}}",
        difficulty: "{{difficulty}}"
}

// ............Paste Solution here
export const solution = `


`;
// ............ Solution end here

const title = response.title;
const pageTitle = title + " | Leetcode | Nishant Singh Chandel";
const pageDescription = pageTitle;
const similarQuestions = response.similarQuestions;
const difficulty = response.difficulty;
const tags = response?.tags?.split(',')

export const metadata = {
  title: pageTitle,
  description: pageDescription,
  "og:title": pageTitle,
  "og:description": pageDescription,
  keywords: pageTitle,
};

export default async function Problem({ params }) {
  let { slug } = params;
  slug = slug.replace(".html", "");

  const codeContent = markdownRender(solution);

  return (
    <div>
      <header>
        <Link href={"/"} className="hover:text-[#409eff]">
          Go Back
        </Link>
        <h1 className="text-xl mt-5 font-bold">{title}</h1>
        <div className="row">
          <div className="name">Difficulty:</div>
          <div className="value">
            <span className={`tag ${difficulty} selected`}>{difficulty}</span>
          </div>
        </div>
        <div className="row">
          <div className="name">Related Topics:</div>
          <div className="value">
            <ul className="clearfix">
              {tags?.map((item, index) => (
                <li key={index}>
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {similarQuestions.length > 0 && (
          <div className="row">
            <div className="name">Similar Questions:</div>
            <div className="value">
              <ul className="clearfix">
                {similarQuestions.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={{
                        pathname: `/problems/${item.slug}`,
                      }}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className="row">
          <div className="name">Leetcode:</div>
          <div className="value">
            <ul className="clearfix">
              <li>
                <Link
                  className="clearfix"
                  taget="_blank"
                  href={`https://leetcode.com/problems/${slug}/description/`}
                >
                  {slug}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <main>
        <article
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: codeContent }}
        />
      </main>
      <Footer />
    </div>
  );
}
