import { useState, useMemo } from 'react';
import { ChevronRight, File, Folder, FileCode } from 'lucide-react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import type { FileNode } from '@/lib/sample-contracts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BreadcrumbSegment {
  name: string;
  path: string[];
  isFile: boolean;
  siblings: FileNode[];
}

export function Breadcrumbs() {
  const { activeTabPath, files, setActiveTabPath, addTab } = useWorkspaceStore();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const segments = useMemo(() => {
    const result: BreadcrumbSegment[] = [];
    
    if (activeTabPath.length === 0) {
      return result;
    }

    // Helper to find node and siblings at each level
    const findNodeAndSiblings = (
      nodes: FileNode[],
      pathParts: string[],
      currentPath: string[] = []
    ): void => {
      if (pathParts.length === 0) return;

      const currentName = pathParts[0];
      const node = nodes.find(n => n.name === currentName);
      
      if (!node) return;

      const fullPath = [...currentPath, currentName];
      const isLastSegment = pathParts.length === 1;

      result.push({
        name: currentName,
        path: fullPath,
        isFile: !node.children,
        siblings: nodes,
      });

      if (node.children && !isLastSegment) {
        findNodeAndSiblings(node.children, pathParts.slice(1), fullPath);
      }
    };

    findNodeAndSiblings(files, activeTabPath);
    return result;
  }, [activeTabPath, files]);

  const handleNavigate = (path: string[], name: string, isFile: boolean) => {
    if (isFile) {
      setActiveTabPath(path);
      addTab(path, name);
    } else {
      // For folders, just close the dropdown
      setOpenDropdown(null);
    }
  };

  const getFileIcon = (node: FileNode) => {
    if (node.children) {
      return <Folder className="h-3 w-3" />;
    }
    
    const ext = node.name?.split('.').pop()?.toLowerCase();
    if (ext === 'rs' || ext === 'toml') {
      return <FileCode className="h-3 w-3" />;
    }
    
    return <File className="h-3 w-3" />;
  };

  if (segments.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 bg-muted/30 border-b border-border text-xs font-mono">
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const isActive = isLast;

        return (
          <div key={segment.path.join('/')} className="flex items-center gap-1">
            <DropdownMenu
              open={openDropdown === index}
              onOpenChange={(open) => setOpenDropdown(open ? index : null)}
            >
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {segment.isFile ? (
                    <FileCode className="h-3 w-3" />
                  ) : (
                    <Folder className="h-3 w-3" />
                  )}
                  <span>{segment.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto">
                {segment.siblings
                  .sort((a, b) => {
                    // Folders first, then files
                    if (a.children && !b.children) return -1;
                    if (!a.children && b.children) return 1;
                    return (a.name || '').localeCompare(b.name || '');
                  })
                  .map((sibling) => {
                    const siblingPath = [...segment.path.slice(0, -1), sibling.name!];
                    const isCurrent = sibling.name === segment.name;

                    return (
                      <DropdownMenuItem
                        key={sibling.name}
                        onClick={() => {
                          if (!isCurrent) {
                            handleNavigate(siblingPath, sibling.name!, !sibling.children);
                          }
                        }}
                        className={`flex items-center gap-2 ${
                          isCurrent ? 'bg-accent font-medium' : ''
                        }`}
                      >
                        {getFileIcon(sibling)}
                        <span className="flex-1">{sibling.name}</span>
                        {isCurrent && (
                          <span className="text-xs text-muted-foreground">●</span>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            {!isLast && (
              <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            )}
          </div>
        );
      })}
    </div>
  );
}
