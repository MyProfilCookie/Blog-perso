export type Exercise = {
  _id: string;
  title: string;
  content: string;
  question: string;
  options?: string[];
  image?: string;
  answer: string;
  difficulty?: string;
  category: string;
};

const SUBJECT_FILES: Record<string, string | null> = {
  art: "dataart.json",
  french: "datafrench.json",
  geography: "datageography.json",
  history: "datahistory.json",
  language: "datalanguage.json",
  math: "datamath.json",
  sciences: "datascience.json",
  technology: "datatechnology.json",
  music: null,
};

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const isNumeric = (val: string) => {
  if (!val) return false;
  const num = Number(val);
  return !Number.isNaN(num);
};

const buildOptions = (answer: string): string[] => {
  if (isNumeric(answer)) {
    const base = Number(answer);
    const opts = [String(base), String(base + 1), String(Math.max(base - 1, 0))];
    return shuffle([...new Set(opts)]);
  }
  const candidates = [answer, "Je ne sais pas", "Autre"];
  return shuffle([...new Set(candidates)]);
};

const detectExercisesArray = (json: any): any[] => {
  if (!json || typeof json !== "object") return [];
  const key = Object.keys(json).find((k) => k.endsWith("_exercises") && Array.isArray(json[k]));
  return key ? json[key] : [];
};

export const loadFallbackExercises = async (subject: string): Promise<Exercise[]> => {
  const file = SUBJECT_FILES[subject];
  if (!file) return [];
  try {
    const res = await fetch(`/${file}`);
    if (!res.ok) return [];
    const data = await res.json();
    const exercises = detectExercisesArray(data);
    const mapped: Exercise[] = [];
    for (const ex of exercises) {
      const title: string = ex.title || subject;
      const content: string = ex.content || "";
      const image: string | undefined = ex.image || undefined;
      const qs: any[] = Array.isArray(ex.questions) ? ex.questions : [];
      for (let i = 0; i < qs.length; i++) {
        const q = qs[i];
        const question: string = q.question || "";
        const answer: string = q.answer || "";
        const options: string[] | undefined = Array.isArray(q.options) && q.options.length > 0 ? q.options : buildOptions(answer);
        mapped.push({
          _id: `${subject}-${ex.id ?? title}-${i}`,
          title,
          content,
          question,
          options,
          image,
          answer,
          difficulty: "Facile",
          category: subject,
        });
      }
    }
    return mapped;
  } catch {
    return [];
  }
};