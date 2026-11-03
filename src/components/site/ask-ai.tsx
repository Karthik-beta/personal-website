import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { TextLink, textLinkClasses } from "@/components/ui/text-link";
import { askAi, type AskAiCopy } from "@/content/ask-ai";
import { assistants, mcpServer } from "@/lib/ask-ai";

const summaryClasses =
  "inline-flex cursor-pointer list-none items-start gap-0.5 py-0.5 font-semibold text-accent [&::-webkit-details-marker]:hidden";

function separator(index: number) {
  if (index === 0) return null;
  return index === assistants.length - 1 ? " or " : ", ";
}

export function AskAi({ copy }: { copy: AskAiCopy }) {
  return (
    <div className="grid gap-2">
      <p>
        {copy.before}
        {assistants.map((assistant, index) => (
          <Fragment key={assistant.name}>
            {separator(index)}
            <TextLink href={assistant.url(copy.prompt)} data-track="ask_ai">
              {assistant.name}
            </TextLink>
          </Fragment>
        ))}
        {copy.after}
      </p>
      <details className="group/prompt">
        <summary className={summaryClasses}>
          <ChevronRight
            aria-hidden
            size={16}
            strokeWidth={2}
            className="h-lh shrink-0 transition-transform duration-120 ease-out group-open/prompt:rotate-90"
          />
          <span className="group-open/prompt:hidden">{askAi.showPrompt}</span>
          <span className="hidden group-open/prompt:inline">{askAi.hidePrompt}</span>
        </summary>
        <div className="mt-1 mb-2 grid gap-2 border-l-2 border-band pl-3">
          <p className="text-sm text-muted select-all">{copy.prompt}</p>
          <p className="text-xs text-muted">{askAi.promptNote}</p>
        </div>
      </details>
    </div>
  );
}

export function McpConnect() {
  const { mcp } = askAi;
  return (
    <details className="group/mcp">
      <summary className={summaryClasses}>
        <ChevronRight
          aria-hidden
          size={16}
          strokeWidth={2}
          className="h-lh shrink-0 transition-transform duration-120 ease-out group-open/mcp:rotate-90"
        />
        {mcp.summary}
      </summary>
      <div className="mt-1 mb-2 grid gap-2 border-l-2 border-band pl-3 text-sm text-muted">
        <p>
          {mcp.lead}
          <code className="font-mono [overflow-wrap:anywhere]">{mcpServer.url}</code>.
        </p>
        <p>{mcp.claudeCode}</p>
        <pre className="rounded-band bg-band px-3 py-2 font-mono [overflow-wrap:anywhere] whitespace-pre-wrap text-ink select-all">
          <code>{mcpServer.claudeCode}</code>
        </pre>
        <p>
          <a href={mcpServer.cursor} className={textLinkClasses("action")} data-track="mcp_install">
            {mcp.cursor}
          </a>
        </p>
      </div>
    </details>
  );
}
