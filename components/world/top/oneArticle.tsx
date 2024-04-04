import { oneArticleType } from "@/lib/types/communityType";

export default function OneArticle({ article }: { article: oneArticleType }) {
  return (
    <div>
      <h3>{article.title}</h3>
    </div>
  );
}
