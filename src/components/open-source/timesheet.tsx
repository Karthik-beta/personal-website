import { cn } from "@/lib/cn";
import { formatDay, type Week } from "@/lib/open-source";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// Every other weekday is labelled, so the labels never crowd the squares.
const labelled = new Set([0, 2, 4]);

const label = { active: "active", missed: "no activity", today: "today, nothing yet", none: "" };

const monthFormat = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });

/**
 * One label per month: over the first column (the month of its first day on record), then over
 * each week that starts in a month not yet labelled. January also gets its year.
 */
function monthLabels(weeks: Week[]) {
  let last = "";
  return weeks.map((week, i) => {
    const first = week.cells.find((cell) => cell.kind !== "none") ?? week.cells[0];
    const date = i === 0 ? first.date : week.start;
    if (date.slice(0, 7) === last) return null;
    last = date.slice(0, 7);
    const d = new Date(`${date}T00:00:00Z`);
    const month = monthFormat.format(d);
    return d.getUTCMonth() === 0 ? `${month} ${d.getUTCFullYear()}` : month;
  });
}

/**
 * Days with activity as a compact weekly timesheet laid on its side
 * (docs/design/13-open-source.md): one column per week, oldest on the left, weekday labels
 * beside the first column. One shade only: shipped or not. Squares are 16 px at most and shrink
 * to 10 px as the record grows; past that the grid scrolls inside its own box, opening at the
 * newest week.
 */
export function Timesheet({ weeks, today }: { weeks: Week[]; today: string }) {
  // Per week column: the square plus the 4 px border spacing (rem); then the label column.
  const months = monthLabels(weeks);
  const width = (square: number) => `calc(${weeks.length} * ${square + 0.25}rem + 2.25rem)`;

  return (
    // A right-to-left scroll box opens scrolled to its right end, so a grid wider than the
    // screen starts at the newest week. The table inside is left-to-right as usual, and
    // mr-auto keeps a narrow grid on the left.
    <div dir="rtl" className="overflow-x-auto">
      <table
        dir="ltr"
        className="mr-auto w-full table-fixed border-separate border-spacing-1"
        style={{ maxWidth: width(1), minWidth: width(0.625) }}
      >
        <caption className="sr-only">Days with activity, by week</caption>
        <colgroup>
          <col className="w-8" />
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
                <span aria-hidden>{months[i]}</span>
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
                className="sticky left-0 z-10 bg-paper p-0 text-left text-xs leading-none font-normal text-muted"
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
                        // Quiet on purpose: the shipped days carry the information.
                        cell.kind === "missed" && "bg-rule",
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
