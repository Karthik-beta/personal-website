const zone = { timeZone: "Asia/Kolkata" } as const;
const timeFormat = new Intl.DateTimeFormat("en-GB", {
  ...zone,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const dayFormat = new Intl.DateTimeFormat("en-GB", { ...zone, weekday: "long" });

export function bengaluruTime(date: Date) {
  return `It’s ${timeFormat.format(date)} on ${dayFormat.format(date)} in Bengaluru`;
}
