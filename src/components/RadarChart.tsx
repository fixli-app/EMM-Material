import { useRef, useEffect } from "react";

interface Dataset {
  label: string;
  data: number[];
  color: string;
}

interface RadarChartProps {
  datasets: Dataset[];
  labels: string[];
  size?: number;
}

const RadarChart = ({ datasets, labels, size = 240 }: RadarChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 40;
    const n = labels.length;
    const step = (2 * Math.PI) / n;

    ctx.clearRect(0, 0, size, size);

    // Draw grid
    for (let level = 1; level <= 5; level++) {
      const r = (radius * level) / 5;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = i * step - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "hsl(210, 18%, 88%)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Draw axes
    for (let i = 0; i < n; i++) {
      const angle = i * step - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
      ctx.strokeStyle = "hsl(210, 18%, 88%)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Draw datasets
    datasets.forEach((dataset) => {
      ctx.beginPath();
      dataset.data.forEach((value, i) => {
        const r = (radius * value) / 100;
        const angle = i * step - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();

      // Parse color for fill
      ctx.fillStyle = dataset.color.replace(")", ", 0.12)").replace("hsl(", "hsla(");
      ctx.fill();
      ctx.strokeStyle = dataset.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw points
      dataset.data.forEach((value, i) => {
        const r = (radius * value) / 100;
        const angle = i * step - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = dataset.color;
        ctx.fill();
      });
    });

    // Draw labels
    ctx.font = "9px Inter, sans-serif";
    ctx.fillStyle = "hsl(213, 12%, 48%)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    labels.forEach((label, i) => {
      const angle = i * step - Math.PI / 2;
      const lx = cx + (radius + 22) * Math.cos(angle);
      const ly = cy + (radius + 22) * Math.sin(angle);
      
      // Truncate long labels
      const short = label.length > 12 ? label.slice(0, 10) + "…" : label;
      ctx.fillText(short, lx, ly);
    });
  }, [datasets, labels, size]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
      />
      {datasets.length > 1 && (
        <div className="mt-2 flex items-center gap-4">
          {datasets.map((d) => (
            <div key={d.label} className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-[10px] text-muted-foreground">{d.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RadarChart;
