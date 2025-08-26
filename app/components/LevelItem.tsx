'use client';

import { useProgress } from "@/app/lib/progress";

export default function LevelItem({
  subject,
  level,
}: {
  subject: string;
  level: { id: string; title: string };
}) {
  const key = `${subject}_${level.id}`;
  const { progress } = useProgress(key);

  return (
    <a
      href={`/play/${subject}/${level.id}`}
      style={{
        display: "block",
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {level.title}
      <span style={{ float: "right", color: "#333" }}>
        {progress.stars > 0 ? "⭐".repeat(progress.stars) : "☆"}{" "}
        {progress.xp > 0 ? `+${progress.xp} XP` : ""}
      </span>
    </a>
  );
}
