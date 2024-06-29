import { getProblemsRequest } from "@/lib/problem";
import App from "@/app/components/problemListTable";

async function getData() {
  const res = await getProblemsRequest(); // Adjust the URL if needed

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home() {
  const { problems, tagList } = await getData();
  return (
    <>{problems.length > 0 && <App list={problems} tagList={tagList} />}</>
  );
}
