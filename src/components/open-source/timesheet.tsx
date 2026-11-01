import { cn } from "@/lib/cn";
import { formatDay, type Week } from "@/lib/open-source";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const label = { active: "active", missed: "no activity", today: "today, nothing yet", none: "" };

/**
 * Days with activity as a weekly timesheet (docs/design/13-open-source.md): one row per week,
 * its start date in the time margin, one square per day. One shade only: shipped or not.
 * `margin` lines the date column up with the page's 10rem time margin from md up.
 */
export function Timesheet({
  weeks,
  today,
  margin = true,
}: {
  weeks: Week[];
  today: string;
  margin?: boolean;
}) {
  return (
    <table className="border-separate border-spacing-1 sm:border-spacing-1.5">
      <caption className="sr-only">Days with activity, by week</caption>
      <thead>
        <tr className="text-xs text-muted">
          <th scope="col" className={cn("w-14 text-left", margin && "md:w-[calc(10rem+1.25rem)]")}>
            <span className="sr-only">Week of</span>
          </th>
          {weekdays.map((day) => (
            <th key={day} scope="col" className="w-7 font-normal sm:w-9">
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week) => (
          <tr key={week.start}>
            <th
              scope="row"
              className="pr-2 text-left text-xs font-normal whitespace-nowrap text-muted tabular-nums"
            >
              <time dateTime={week.start}>{formatDay(week.start, today)}</time>
            </th>
            {week.cells.map((cell) => (
              <td key={cell.date} className="p-0">
                <span
                  className={cn(
                    "block size-7 rounded-band sm:size-9",
                    cell.kind === "active" && "bg-accent",
                    cell.kind === "missed" && "border border-rule-strong",
                    cell.kind === "today" && "border border-dashed border-rule-strong",
                  )}
                >
                  {cell.kind !== "none" && (
                    <span className="sr-only">
                      {formatDay(cell.date, today)}: {label[cell.kind]}
                    </span>
                  )}
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
