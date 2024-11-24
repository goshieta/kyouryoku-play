const CircularProgressBar = ({ percentage }: { percentage: number }) => {
  const radius = 20; // 半径を変更（44pxのサイズに合わせるため）
  const strokeWidth = 4; // プログレスバーの太さを変更
  const normalizedRadius = radius - strokeWidth * 0.5; // 正規化された半径
  const circumference = normalizedRadius * 2 * Math.PI; // 円周

  // プログレスの計算
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg width="44" height="44" style={{ transform: "rotate(-90deg)" }}>
      {/* 背景の円 */}
      <circle
        stroke="#e6e6e6" // 背景の色
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx="22" // 中心のX座標を変更（44pxのサイズに合わせるため）
        cy="22" // 中心のY座標を変更（44pxのサイズに合わせるため）
      />
      {/* プログレスの円 */}
      <circle
        stroke="#5773ff" // プログレスバーの色
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx="22" // 中心のX座標を変更
        cy="22" // 中心のY座標を変更
        strokeDasharray={`${circumference} ${circumference}`} // 円周を指定
        strokeDashoffset={strokeDashoffset} // プログレスのオフセット
        style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }} // アニメーション
      />
    </svg>
  );
};

export default CircularProgressBar;
