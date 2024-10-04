import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LessonsByMonth() {
  const router = useRouter();
  const { monthId } = router.query;
  const [lessons, setLessons] = useState<{ filename: string }[]>([]);

  useEffect(() => {
    if (monthId) {
      fetch(`/lessons?month=${monthId}`)
        .then((res) => res.json())
        .then((data) => setLessons(data));
    }
  }, [monthId]);

  return (
    <div>
      <h1>Leçons pour le mois de {monthId}</h1>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.filename}>{lesson.filename}</li>
        ))}
      </ul>
    </div>
  );
}
