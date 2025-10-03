export const normalizeAvatarUrl = (url?: string | null): string => {
  if (!url || typeof url !== "string") {
    return "/assets/default-avatar.webp";
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return "/assets/default-avatar.webp";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  const sanitized = trimmed.replace(/^\/+/, "");
  return `/${sanitized}`;
};
