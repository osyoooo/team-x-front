/**
 * BackgroundDesign Component
 * Figmaデザインから取得した6つの円形要素を持つ背景パターンをSVGで表示
 */

const BackgroundDesign = () => {
  // Figmaの座標(左上)とサイズからSVGの円の中心(cx, cy)と半径(r)を計算
  // cx = figmaX + width / 2
  // cy = figmaY + height / 2
  // r = width / 2
  const circles = [
    // Ellipse 15 (青)
    { cx: 118 + 158 / 2, cy: -79 + 158 / 2, r: 158 / 2, fill: '#5DDDE1' },
    // Ellipse 17 (黄)
    { cx: -100 + 158 / 2, cy: 200 + 158 / 2, r: 158 / 2, fill: '#F0FE53' },
    // Ellipse 16 (緑)
    { cx: 324 + 158 / 2, cy: 259 + 158 / 2, r: 158 / 2, fill: '#6ADE08' },
    // Ellipse 22 (青)
    { cx: 118 + 158 / 2, cy: 611 + 158 / 2, r: 158 / 2, fill: '#5DDDE1' },
    // Ellipse 21 (黄)
    { cx: -100 + 158 / 2, cy: 890 + 158 / 2, r: 158 / 2, fill: '#F0FE53' },
    // Ellipse 20 (緑)
    { cx: 324 + 158 / 2, cy: 949 + 158 / 2, r: 158 / 2, fill: '#6ADE08' },
  ];

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 393 945"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="blur-effect">
            <feGaussianBlur stdDeviation="50" />
          </filter>
        </defs>
        <g filter="url(#blur-effect)">
          {circles.map((circle, index) => (
            <circle
              key={index}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              fill={circle.fill}
              fillOpacity="0.8"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default BackgroundDesign;