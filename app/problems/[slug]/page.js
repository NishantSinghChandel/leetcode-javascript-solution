import { getProblemsByIdSlugRequest } from "@/lib/problem";
import markdownRender from "@/lib/markdownRender";
import Link from "next/link";
import "@/app/globals.css";
import Footer from "@/app/components/footer";

async function getData(idOrSlug) {
  const res = await getProblemsByIdSlugRequest(idOrSlug); // Adjust the URL if needed

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function generateMetadata({ params }) {
  // read route params
  const slug = params.slug;
  const title = slug.split("-").join(" ");
  const pageTitle = `${title} | Leetcode | Nishant Singh Chandel`;
  const pageDescirption = `${title} | Leetcode | Nishant Singh Chandel`;
  return {
    title: pageTitle,
    description: pageDescirption,
    "og:title": pageTitle,
    "og:description": pageDescirption,
    keywords: pageTitle,
  };
}

export default async function Problem({ params }) {
  let { slug } = params;
  slug = slug.replace(".html", "");
  const problem = await getData(slug);
  if (!problem) {
    return (
      <div className="flex justify-center items-center p-4">
        <Link href={"/"}> Go Back</Link>
        <h1>Problem Not Found.</h1>
      </div>
    );
  }
  const { id, name, difficulty, tags, similarQuestions, content } = problem;

  const codeContent = markdownRender(content);

  return (
    <div>
      <header>
        <Link href={"/"} className="hover:text-[#409eff]">
          {" "}
          Go Back
        </Link>
        <h1 className="text-xl mt-5 font-bold">{id + ". " + name}</h1>
        <div className="row">
          <div className="name">Difficulty:</div>
          <div className="value">
            <span className={`tag ${difficulty.slug} selected`}>
              {difficulty.name}
            </span>
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
