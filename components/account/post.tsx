import { useState, useEffect, ChangeEvent } from "react";

const isSortType = (val: string): val is "latest" | "popular" | "oldest" =>
  val === "latest" || val === "popular" || val === "oldest";

export default function Post() {
  const [sortType, setSortType] = useState<"latest" | "popular" | "oldest">(
    "latest"
  );
  const radioOnchange = (e: ChangeEvent<HTMLInputElement>) =>
    isSortType(e.target.value) ? setSortType(e.target.value) : {};

  return (
    <>
      <div>
        <h2>投稿</h2>
        <div>
          <div>
            <input
              type="radio"
              name="select_show_type"
              id="select_show_type_latest"
              value="latest"
              checked={sortType === "latest"}
              onChange={radioOnchange}
            />
            <label htmlFor="select_show_type_latest">最新</label>
          </div>
          <div>
            <input
              type="radio"
              name="select_show_type"
              id="select_show_type_popular"
              value="popular"
              checked={sortType === "popular"}
              onChange={radioOnchange}
            />
            <label htmlFor="select_show_type_popular">人気</label>
          </div>
          <div>
            <input
              type="radio"
              name="select_show_type"
              id="select_show_type_oldest"
              value="oldest"
              checked={sortType === "oldest"}
              onChange={radioOnchange}
            />
            <label htmlFor="select_show_type_oldest">最古</label>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
}
