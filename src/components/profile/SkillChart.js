'use client';

import { useEffect, useRef, useMemo } from 'react';

export default function SkillChart({ skills = {}, trustScore = 125 }) {
  const canvasRef = useRef(null);

  const defaultSkills = useMemo(() => ({
    discover: skills.discover || 25,     // みつける力
    create: skills.create || 27,         // カタチにする力  
    deliver: skills.deliver || 73        // とどける力
  }), [skills.discover, skills.create, skills.deliver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = 72.5; // 外側の円のサイズを調整

    // Clear canvas with transparency
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw concentric circles (guides) - より細かく5段階で
    const circles = [12.5, 27.5, 42.5, 57.5, 72.5];
    circles.forEach(radius => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#E5E5E5';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // スキル値から三角形の頂点を計算
    const skillData = [
      { 
        name: 'みつける力', 
        value: defaultSkills.discover, 
        angle: -Math.PI / 2,  // 上（12時方向）
        color: '#93E9EB',
        textColor: '#93E9EB'
      },
      { 
        name: 'カタチにする力', 
        value: defaultSkills.create, 
        angle: Math.PI / 6,   // 右上（2時方向）
        color: '#AAF56A',
        textColor: '#AAF56A'
      },
      { 
        name: 'とどける力', 
        value: defaultSkills.deliver, 
        angle: 5 * Math.PI / 6, // 左下（10時方向）
        color: '#E9F28B',
        textColor: '#E9F28B'
      }
    ];

    // 三角形のパスを構築
    // スキル値の最大値を動的に計算（最低300に設定）
    const maxSkillValue = Math.max(300, Math.max(...skillData.map(s => s.value)) * 1.2);
    
    const trianglePoints = skillData.map(skill => {
      const radius = (skill.value / maxSkillValue) * maxRadius;
      return {
        x: centerX + Math.cos(skill.angle) * radius,
        y: centerY + Math.sin(skill.angle) * radius,
        skill: skill
      };
    });

    // グレーの三角形（背景）を描画
    ctx.beginPath();
    skillData.forEach((skill, index) => {
      const radius = maxRadius * 0.5; // 背景は50%のサイズ
      const x = centerX + Math.cos(skill.angle) * radius;
      const y = centerY + Math.sin(skill.angle) * radius;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(204, 204, 204, 0.48)';
    ctx.fill();

    // メインの三角形を描画（グラデーション）
    ctx.beginPath();
    trianglePoints.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    
    // 線形グラデーション（水色から黄緑）
    const gradient = ctx.createLinearGradient(
      centerX, centerY - maxRadius, 
      centerX, centerY + maxRadius
    );
    gradient.addColorStop(0, 'rgba(116, 251, 252, 1)');  // 水色
    gradient.addColorStop(1, 'rgba(240, 254, 83, 1)');   // 黄緑
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // 影を追加
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    ctx.fill();
    
    // 影をリセット
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

  }, [defaultSkills]);

  return (
    <div className="relative w-full max-w-[358px] h-[199px]">
      {/* 信頼スコアカード（左上） */}
      <div className="absolute top-[10px] left-[18px] z-10">
        <div className="bg-white/90 backdrop-blur-sm border border-white rounded-lg p-3 text-center shadow-lg w-20 h-[73px]">
          <div className="text-xs font-bold text-black mb-1">信頼スコア</div>
          <div className="text-2xl font-bold text-black">{trustScore}</div>
        </div>
      </div>

      {/* キャンバス */}
      <canvas
        ref={canvasRef}
        width={358}
        height={199}
        className="w-full h-full"
      />
      
      {/* スキル名と数値のオーバーレイ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* みつける力（右上） */}
        <div className="absolute top-[21px] right-[40px] text-right">
          <div className="text-[11px] font-bold mb-1" style={{ color: '#93E9EB' }}>
            みつける力
          </div>
          <div className="text-2xl font-bold text-white">
            {defaultSkills.discover}
          </div>
        </div>
        
        {/* カタチにする力（右下） */}
        <div className="absolute bottom-[15px] right-[15px] text-right">
          <div className="text-[11px] font-bold mb-1" style={{ color: '#AAF56A' }}>
            カタチにする力
          </div>
          <div className="text-2xl font-bold text-white">
            {defaultSkills.create}
          </div>
        </div>
        
        {/* とどける力（左下） */}
        <div className="absolute bottom-[15px] left-[47px] text-left">
          <div className="text-[11px] font-bold mb-1" style={{ color: '#E9F28B' }}>
            とどける力
          </div>
          <div className="text-2xl font-bold text-white">
            {defaultSkills.deliver}
          </div>
        </div>
      </div>
    </div>
  );
}