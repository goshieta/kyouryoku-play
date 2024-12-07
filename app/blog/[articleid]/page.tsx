import Link from "next/link";
import getPageByID from "../lib/getPageById";

export default async function Article({
  params,
}: {
  params: { articleid: string };
}) {
  const { content, ...articleData } = await getPageByID(params.articleid);

  return (
    <div>
      <img
        src={articleData.imgurl}
        alt={`${articleData.title}の画像`}
        width={800}
      />
      <h1>{articleData.title}</h1>
      <div>
        {articleData.tags.map((tag: any) => {
          return (
            <Link href={`/blog?tag=${tag.id}`} key={tag.id}>
              {tag.name}
            </Link>
          );
        })}
      </div>
      <div>
        {content.map((oneContent) => {
          console.log(oneContent);
          return <div key={oneContent.id}></div>;
        })}
      </div>
      <div></div>
    </div>
  );
}
