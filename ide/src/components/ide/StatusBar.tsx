import { useWorkspaceStore } from "@/store/workspaceStore";
import { Settings } from "lucide-react";
import { NetworkSelector } from "./NetworkSelector";

interface StatusBarProps {
  language?: string;
}

export function StatusBar({ language: propLanguage }: StatusBarProps) {
  const {
    cursorPos,
    network,
    horizonUrl,
    customRpcUrl,
    customHeaders,
    setNetwork,
    setCustomRpcUrl,
    setCustomHeaders,
    unsavedFiles,
    files,
    activeTabPath,
  } = useWorkspaceStore();

  const activeFile = files.find(
    (f) => f.name === activeTabPath[activeTabPath.length - 1],
  );
  const language = propLanguage || activeFile?.language || "rust";

  const openSettings = () => {
    window.dispatchEvent(new Event("ide:open-settings"));
  };

  return (
    <div className="flex items-center justify-between bg-primary text-primary-foreground text-[10px] md:text-[11px] font-mono px-2 md:px-3 py-0.5">
      <div className="flex items-center gap-3">
        <span>
          Ln {cursorPos.line}, Col {cursorPos.col}
        </span>
        <span className="hidden sm:inline">{language}</span>
        <span className="hidden md:inline">UTF-8</span>
        {unsavedFiles.size > 0 && (
          <span className="text-primary-foreground/70">
            {unsavedFiles.size} unsaved
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <NetworkSelector
          network={network}
          horizonUrl={horizonUrl}
          customRpcUrl={customRpcUrl}
          customHeaders={customHeaders}
          onNetworkChange={setNetwork}
          onCustomRpcUrlChange={setCustomRpcUrl}
          onCustomHeadersChange={setCustomHeaders}
        />
        <button
          onClick={openSettings}
          className="flex items-center gap-1 hover:bg-primary-foreground/20 px-2 py-1 rounded transition-colors"
          title="Open Settings"
        >
          <Settings className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-[10px]">Settings</span>
        </button>
      </div>
    </div>
  );
}
