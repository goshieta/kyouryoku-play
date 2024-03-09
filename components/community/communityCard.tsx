import { communityType } from "@/pages/community";

//コミュニティ一覧に表示する一つのコミュニティのカード
export default function CommunityCard({
  communityInfo,
}: {
  communityInfo: communityType;
}) {
  return (
    <div>
      <h3>{communityInfo.name}</h3>
    </div>
  );
}
