'use client';

import { useEffect, useRef } from 'react';

export default function SkillChart({ skills = {}, trustScore = 125 }) {
  const canvasRef = useRef(null);

  const defaultSkills = {
    discover: skills.discover || 25,     // みつける力
    create: skills.create || 27,         // カタチにする力  
    deliver: skills.deliver || 73        // とどける力
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = 80;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw concentric circles (guides)
    const circles = [20, 40, 60, 80];
    circles.forEach(radius => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#E5E5E5';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Skill data points
    const skillData = [
      { 
        name: 'みつける力', 
        value: defaultSkills.discover, 
        angle: -Math.PI / 2,  // Top
        color: '#93E9EB' 
      },
      { 
        name: 'カタチにする力', 
        value: defaultSkills.create, 
        angle: Math.PI / 6,   // Top right
        color: '#AAF56A' 
      },
      { 
        name: 'とどける力', 
        value: defaultSkills.deliver, 
        angle: 5 * Math.PI / 6, // Bottom left
        color: '#E9F28B' 
      }
    ];

    // Draw skill area (filled polygon)
    ctx.beginPath();
    skillData.forEach((skill, index) => {
      const radius = (skill.value / 100) * maxRadius;
      const x = centerX + Math.cos(skill.angle) * radius;
      const y = centerY + Math.sin(skill.angle) * radius;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    
    // Fill with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    gradient.addColorStop(0, 'rgba(116, 251, 252, 0.3)');
    gradient.addColorStop(1, 'rgba(240, 254, 83, 0.3)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw skill points and labels
    skillData.forEach(skill => {
      const radius = (skill.value / 100) * maxRadius;
      const x = centerX + Math.cos(skill.angle) * radius;
      const y = centerY + Math.sin(skill.angle) * radius;

      // Draw skill point
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = skill.color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw skill value
      const valueX = centerX + Math.cos(skill.angle) * (maxRadius + 20);
      const valueY = centerY + Math.sin(skill.angle) * (maxRadius + 20);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px "Noto Sans JP"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill.value.toString(), valueX, valueY);

      // Draw skill name
      const labelX = centerX + Math.cos(skill.angle) * (maxRadius + 45);
      const labelY = centerY + Math.sin(skill.angle) * (maxRadius + 45);
      
      ctx.fillStyle = skill.color;
      ctx.font = 'bold 11px "Noto Sans JP"';
      ctx.fillText(skill.name, labelX, labelY);
    });

  }, [defaultSkills]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="w-full h-auto max-w-[200px]"
      />
      
      {/* Trust Score in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/25 backdrop-blur-sm border border-white rounded-lg p-3 text-center shadow-lg">
          <div className="text-xs font-bold text-white mb-1">信頼スコア</div>
          <div className="text-2xl font-bold text-white">{trustScore}</div>
        </div>
      </div>
    </div>
  );
}