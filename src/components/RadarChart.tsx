import { useRef, useEffect, useState } from "react";
import { brandColors } from "@/lib/brandColors";

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
  const [hoveredDataset, setHoveredDataset] = useState<string | null>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || labels.length === 0 || datasets.length === 0) return;

    const bounds = canvas.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * size;
    const y = ((event.clientY - bounds.top) / bounds.height) * size;
    const center = size / 2;
    const radius = size / 2 - 50;
    const step = (2 * Math.PI) / labels.length;
    let closestLabel: string | null = null;
    let closestDistance = 16 * 16;

    datasets.forEach((dataset) => {
      dataset.data.forEach((value, index) => {
        const pointRadius = (radius * value) / 100;
        const angle = index * step - Math.PI / 2;
        const pointX = center + pointRadius * Math.cos(angle);
        const pointY = center + pointRadius * Math.sin(angle);
        const distance = (x - pointX) ** 2 + (y - pointY) ** 2;

        if (distance <= closestDistance) {
          closestDistance = distance;
          closestLabel = dataset.label;
        }
      });
    });

    setHoveredDataset((current) => current === closestLabel ? current : closestLabel);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const styles = window.getComputedStyle(canvas);
    const gridColor = styles.getPropertyValue("--chart-grid").trim() || brandColors.grey20;
    const labelColor = styles.getPropertyValue("--chart-label").trim() || brandColors.grey70;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 50;
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
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Draw axes
    for (let i = 0; i < n; i++) {
      const angle = i * step - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
      ctx.strokeStyle = gridColor;
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

      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = dataset.color;
      ctx.fill();
      ctx.restore();
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
    ctx.font = "9px Arial, sans-serif";
    ctx.fillStyle = labelColor;
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
    <div className="relative flex flex-col items-center">
      {hoveredDataset && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute left-1/2 top-1 z-10 max-w-[calc(100%-1rem)] -translate-x-1/2 truncate rounded-md border border-border bg-card/95 px-3 py-1 text-[11px] font-semibold text-foreground shadow-sm"
        >
          {hoveredDataset}
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoveredDataset(null)}
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
