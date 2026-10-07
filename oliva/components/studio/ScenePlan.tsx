import { runFootprints, type KitchenScene, type Wall } from "@/data/scenes";

const S = 40; // svg units per metre
const PAD = 14;

/** Architectural top-down plan generated from the scene definition */
export function ScenePlan({ scene, className = "", showLabels = false }: { scene: KitchenScene; className?: string; showLabels?: boolean }) {
  const { room } = scene;
  const W = (room.x1 - room.x0) * S;
  const D = room.depth * S;
  const X = (x: number) => (x - room.x0) * S + PAD;
  const Z = (z: number) => z * S + PAD;

  const wallLine = (wall: Wall) => {
    const len = wall === "back" ? room.x1 - room.x0 : room.depth;
    const holes = scene.openings.filter((o) => o.wall === wall).sort((a, b) => a.at - b.at);
    const base = wall === "back" ? room.x0 : 0;
    const segs: [number, number][] = [];
    let cur = 0;
    for (const o of holes) {
      const a = o.at - o.w / 2 - base;
      if (a > cur) segs.push([cur, a]);
      cur = o.at + o.w / 2 - base;
    }
    if (cur < len) segs.push([cur, len]);
    const toXY = (u: number): [number, number] =>
      wall === "back" ? [X(room.x0 + u), Z(0)] : wall === "left" ? [X(room.x0), Z(u)] : [X(room.x1), Z(u)];
    return (
      <g key={wall}>
        {segs.map(([a, b], i) => {
          const [x1, y1] = toXY(a);
          const [x2, y2] = toXY(b);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={5} strokeLinecap="square" />;
        })}
        {holes.map((o, i) => {
          const [x1, y1] = toXY(o.at - o.w / 2 - base);
          const [x2, y2] = toXY(o.at + o.w / 2 - base);
          if (o.kind === "window")
            return <line key={`o${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={1.2} strokeDasharray="0" opacity={0.6} />;
          // door swing
          const r = o.w * S;
          const inward = wall === "right" ? -1 : 1;
          return (
            <path
              key={`o${i}`}
              d={`M ${x1} ${y1} L ${x1 + inward * r} ${y1} A ${r} ${r} 0 0 ${inward > 0 ? 1 : 0} ${x2} ${y2}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={0.8}
              opacity={0.5}
            />
          );
        })}
      </g>
    );
  };

  const open: Wall[] = (["left", "right"] as Wall[]).filter((w) => !room.walls.includes(w));

  return (
    <svg viewBox={`0 0 ${W + PAD * 2} ${D + PAD * 2}`} className={className} role="img" aria-label={`Plan of the ${scene.name}`}>
      <rect x={PAD} y={PAD} width={W} height={D} fill="currentColor" opacity={0.05} />
      {open.map((w) => (
        <line
          key={w}
          x1={w === "left" ? X(room.x0) : X(room.x1)}
          y1={Z(0)}
          x2={w === "left" ? X(room.x0) : X(room.x1)}
          y2={Z(room.depth)}
          stroke="currentColor"
          strokeWidth={0.8}
          strokeDasharray="3 4"
          opacity={0.45}
        />
      ))}
      <line x1={X(room.x0)} y1={Z(room.depth)} x2={X(room.x1)} y2={Z(room.depth)} stroke="currentColor" strokeWidth={0.8} strokeDasharray="3 4" opacity={0.45} />
      {scene.runs.flatMap((run) =>
        runFootprints(run, room).map((f, i) => (
          <rect
            key={`${run.id}-${i}`}
            x={X(f.x)}
            y={Z(f.z)}
            width={f.w * S}
            height={f.d * S}
            fill={f.tall ? "#6e4a2e" : "#b6ab9f"}
            stroke="#1e1712"
            strokeWidth={0.5}
          />
        )),
      )}
      {scene.runs.flatMap((run) =>
        runFootprints(run, room)
          .filter((f) => f.type === "sink" || f.type === "hob")
          .map((f, i) =>
            f.type === "sink" ? (
              <rect key={`s${run.id}${i}`} x={X(f.x) + f.w * S * 0.25} y={Z(f.z) + f.d * S * 0.25} width={f.w * S * 0.5} height={f.d * S * 0.5} rx={2} fill="none" stroke="#1e1712" strokeWidth={0.7} />
            ) : (
              <g key={`h${run.id}${i}`}>
                {[0.3, 0.7].flatMap((a) =>
                  [0.3, 0.7].map((b) => <circle key={`${a}${b}`} cx={X(f.x) + f.w * S * a} cy={Z(f.z) + f.d * S * b} r={2.4} fill="none" stroke="#1e1712" strokeWidth={0.7} />),
                )}
              </g>
            ),
          ),
      )}
      {scene.island && (
        <rect
          x={X(scene.island.x - scene.island.w / 2)}
          y={Z(scene.island.z - scene.island.d / 2)}
          width={scene.island.w * S}
          height={scene.island.d * S}
          fill="#8b4a2f"
          stroke="#1e1712"
          strokeWidth={0.5}
        />
      )}
      {scene.dining && (
        <rect
          x={X(scene.dining.x - scene.dining.w / 2)}
          y={Z(scene.dining.z - scene.dining.d / 2)}
          width={scene.dining.w * S}
          height={scene.dining.d * S}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.8}
          opacity={0.55}
        />
      )}
      {room.walls.map(wallLine)}
      {showLabels && (
        <text x={PAD + W / 2} y={D + PAD * 2 - 3} textAnchor="middle" fontSize={8} letterSpacing={2} fill="currentColor" opacity={0.6}>
          OPEN TO HOME
        </text>
      )}
    </svg>
  );
}
