import Articles from "@/components/world/top/articles";
import Query from "@/components/world/top/query";
import styles from "@/styles/world/world.module.css";

export default function World() {
  return (
    <div>
      <Query />
      <Articles />
    </div>
  );
}
