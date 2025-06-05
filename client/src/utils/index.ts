export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatCallEndedReason(ended_reason: string): string {
  if (!ended_reason) return "";

  // Remove "call.in-progress." if it exists at the beginning
  let cleanedReason = ended_reason;
  if (ended_reason.startsWith("call.in-progress.error-")) {
    cleanedReason = ended_reason.replace("call.in-progress.error-", "");
  }

  return cleanedReason
    .split("-")
    .map((word) => word)
    .join(" ");
}

export function generateColorFromText(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "pink",
    "indigo",
    "orange",
    "teal",
    "cyan",
    "emerald",
    "violet",
  ];
  return colors[Math.abs(hash) % colors.length];
}

export const formatDuration = (duration: number | undefined) => {
  if (!duration) return "0s";
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
};
