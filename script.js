const canvas = document.getElementById("systemsCanvas");
const ctx = canvas.getContext("2d");

const nodes = [
  { label: "API", x: 0.5, y: 0.2, color: "#0f7f62" },
  { label: "DB", x: 0.76, y: 0.36, color: "#105f6b" },
  { label: "Cache", x: 0.68, y: 0.68, color: "#cc5f4a" },
  { label: "Jobs", x: 0.32, y: 0.72, color: "#c68b25" },
  { label: "Auth", x: 0.22, y: 0.38, color: "#14201d" },
];

const links = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
  [0, 2],
  [1, 3],
];

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * scale);
  canvas.height = Math.round(rect.height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function draw(time) {
  const { width, height } = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.33;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(time / 4200) * 0.04);
  ctx.strokeStyle = "rgba(20, 32, 29, 0.1)";
  ctx.lineWidth = 1;

  for (let r = 0.38; r <= 1; r += 0.2) {
    ctx.beginPath();
    ctx.arc(0, 0, radius * r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  const points = nodes.map((node, index) => {
    const drift = Math.sin(time / 1300 + index) * 8;
    return {
      ...node,
      px: node.x * width + drift,
      py: node.y * height + Math.cos(time / 1500 + index) * 8,
    };
  });

  links.forEach(([a, b], index) => {
    const from = points[a];
    const to = points[b];
    const pulse = (Math.sin(time / 600 + index) + 1) / 2;
    ctx.beginPath();
    ctx.moveTo(from.px, from.py);
    ctx.lineTo(to.px, to.py);
    ctx.strokeStyle = `rgba(20, 32, 29, ${0.16 + pulse * 0.16})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    const px = from.px + (to.px - from.px) * pulse;
    const py = from.py + (to.py - from.py) * pulse;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = index % 2 === 0 ? "#0f7f62" : "#cc5f4a";
    ctx.fill();
  });

  points.forEach((node) => {
    ctx.beginPath();
    ctx.arc(node.px, node.py, 34, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = node.color;
    ctx.stroke();

    ctx.fillStyle = "#14201d";
    ctx.font = "800 14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.label, node.px, node.py);
  });

  requestAnimationFrame(draw);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
requestAnimationFrame(draw);
