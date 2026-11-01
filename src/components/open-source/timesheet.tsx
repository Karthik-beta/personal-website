import { cn } from "@/lib/cn";
import { formatDay, type Week } from "@/lib/open-source";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// Every other weekday is labelled, so the labels never crowd the smallest squares.
const labelled = new Set([0, 2, 4]);

const label = { active: "active", missed: "no activity", today: "today, nothing yet", none: "" };

const monthFormat = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });

/** "Oct" over the week a month starts in (and the first week); January also gets its year. */
function monthLabel(week: Week, first: boolean) {
  const start = week.cells.find((cell) => cell.date.endsWith("-01")) ?? (first && week.cells[0]);
  if (!start) return null;
  const date = new Date(`${start.date}T00:00:00Z`);
  const month = monthFormat.format(date);
  return date.getUTCMonth() === 0 ? `${month} ${date.getUTCFullYear()}` : month;
}

/**
 * Days with activity as a weekly timesheet laid on its side (docs/design/13-open-source.md):
 * one column per week, oldest on the left, weekdays down the time margin. One shade only:
 * shipped or not. Squares grow to 36 px while there are few weeks and shrink to 14 px as the
 * record grows; past that the grid scrolls inside its own box, opening at the newest week.
 * `margin` lines the weekday labels up with the page's 10rem time margin from md up.
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
  // Per week column: the square plus the 4 px border spacing (sizes in rem).
  const width = (square: number) => `calc(${weeks.length} * ${square + 0.25}rem)`;

  return (
    // A right-to-left scroll box opens scrolled to its right end, so a grid wider than the
    // screen starts at the newest week. The table inside is left-to-right as usual, and
    // mr-auto keeps a narrow grid on the left.
    <div dir="rtl" className="overflow-x-auto pb-1">
      <table
        dir="ltr"
        className={cn(
          "mr-auto w-full table-fixed border-separate border-spacing-1 [--days:2.5rem]",
          // 10rem margin + 2rem gap, less the 4 px spacing on each side of this column.
          margin && "md:[--days:11.75rem]",
        )}
        style={{
          maxWidth: `calc(${width(2.25)} + var(--days))`,
          minWidth: `calc(${width(0.875)} + var(--days))`,
        }}
      >
        <caption className="sr-only">Days with activity, by week</caption>
        <colgroup>
          <col className="w-(--days)" />
        </colgroup>
        <thead>
          <tr>
            <td className="sticky left-0 z-10 bg-paper" />
            {weeks.map((week, i) => (
              <th
                key={week.start}
                scope="col"
                className="h-5 overflow-visible p-0 text-left align-bottom text-xs leading-none font-normal whitespace-nowrap text-muted"
              >
                <span aria-hidden>{monthLabel(week, i === 0)}</span>
                <span className="sr-only">Week of {formatDay(week.start, today)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weekdays.map((day, row) => (
            <tr key={day}>
              <th
                scope="row"
                // Pinned, so the weekdays stay in view while a long grid is scrolled.
                className="sticky left-0 z-10 bg-paper p-0 pr-2 text-left text-xs leading-none font-normal text-muted"
              >
                {labelled.has(row) && <span aria-hidden>{day.slice(0, 3)}</span>}
                <span className="sr-only">{day}</span>
              </th>
              {weeks.map((week) => {
                const cell = week.cells[row];
                return (
                  <td key={cell.date} className="p-0">
                    <span
                      className={cn(
                        "block aspect-square w-full rounded-mark",
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
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
