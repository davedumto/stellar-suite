# Breadcrumbs Navigation - Visual Examples

## Component Appearance

### Basic Path Display

When editing `hello_world/src/lib.rs`:

```
┌────────────────────────────────────────────────────────────┐
│ 📁 hello_world  >  📁 src  >  💻 lib.rs                    │
└────────────────────────────────────────────────────────────┘
```

### With Active Highlighting

The current file (lib.rs) is highlighted:

```
┌────────────────────────────────────────────────────────────┐
│ 📁 hello_world  >  📁 src  >  [💻 lib.rs]                  │
│                                  ↑                         │
│                            Primary color                   │
└────────────────────────────────────────────────────────────┘
```

### Dropdown Menu Example

Clicking on "src" shows siblings:

```
┌────────────────────────────────────────────────────────────┐
│ 📁 hello_world  >  [📁 src ▼]  >  💻 lib.rs                │
│                     ┌──────────────┐                       │
│                     │ 📁 tests     │                       │
│                     │ 💻 lib.rs ●  │ ← Current            │
│                     │ 💻 utils.rs  │                       │
│                     │ 📄 mod.rs    │                       │
│                     └──────────────┘                       │
└────────────────────────────────────────────────────────────┘
```

## Interaction Flow

### 1. View Current Location

```
User opens: hello_world/src/lib.rs

Breadcrumbs show:
📁 hello_world  >  📁 src  >  💻 lib.rs
```

### 2. Click Segment to See Siblings

```
User clicks: "src"

Dropdown opens showing:
┌──────────────┐
│ 📁 tests     │
│ 💻 lib.rs ●  │ ← Current file
│ 💻 utils.rs  │
│ 📄 mod.rs    │
└──────────────┘
```

### 3. Navigate to Sibling

```
User clicks: "utils.rs"

Breadcrumbs update:
📁 hello_world  >  📁 src  >  💻 utils.rs

Editor switches to utils.rs
```

## Real-World Examples

### Example 1: Simple Project

```
Project structure:
hello_world/
├── Cargo.toml
└── src/
    └── lib.rs

Breadcrumbs when editing lib.rs:
📁 hello_world  >  📁 src  >  💻 lib.rs
```

### Example 2: Complex Project

```
Project structure:
token_contract/
├── Cargo.toml
├── src/
│   ├── lib.rs
│   ├── storage.rs
│   ├── events.rs
│   └── admin/
│       ├── mod.rs
│       └── permissions.rs
└── tests/
    └── integration.rs

Breadcrumbs when editing permissions.rs:
📁 token_contract  >  📁 src  >  📁 admin  >  💻 permissions.rs

Clicking "admin" shows:
┌──────────────────┐
│ 💻 mod.rs        │
│ 💻 permissions.rs ● │
└──────────────────┘

Clicking "src" shows:
┌──────────────┐
│ 📁 admin     │
│ 💻 events.rs │
│ 💻 lib.rs    │
│ 💻 storage.rs│
└──────────────┘
```

### Example 3: Root Level File

```
Project structure:
hello_world/
└── Cargo.toml

Breadcrumbs when editing Cargo.toml:
📁 hello_world  >  📄 Cargo.toml

Clicking "hello_world" shows:
┌──────────────┐
│ 📁 src       │
│ 📄 Cargo.toml ● │
└──────────────┘
```

## Component States

### Empty State
```
No file open → Breadcrumbs not rendered
```

### Single Segment
```
Root file → 📁 project  >  📄 README.md
(No chevrons, just two segments)
```

### Multiple Segments
```
Nested file → 📁 project  >  📁 src  >  📁 utils  >  💻 helper.rs
(Chevrons between each segment)
```

### Hover State
```
Default:  📁 src  (muted foreground)
Hover:    📁 src  (background highlight, darker text)
Active:   💻 lib.rs  (primary color, tinted background)
```

## Dropdown Behavior

### Opening
- Click segment button
- Dropdown appears below
- Shows all siblings
- Current item marked with ●

### Sorting
1. Folders first (alphabetically)
2. Then files (alphabetically)

### Navigation
- Click file → Opens in editor
- Click folder → Closes dropdown (no navigation)
- Click current item → Closes dropdown

### Closing
- Click outside dropdown
- Click another segment
- Press Escape key
- Navigate to a file

## Keyboard Navigation

### Tab Navigation
```
Tab → Focus first segment
Tab → Focus next segment
Tab → Focus dropdown trigger
Enter → Open dropdown
Arrow Down → Navigate dropdown items
Enter → Select item
Escape → Close dropdown
```

### Accessibility Features
- Keyboard accessible
- Screen reader friendly
- Focus indicators
- ARIA labels (from Radix UI)

## Integration Points

### 1. Workspace Store
```typescript
const {
  activeTabPath,  // Current file path
  files,          // File tree
  setActiveTabPath, // Navigate to file
  addTab,         // Open file in tab
} = useWorkspaceStore();
```

### 2. File Tree Structure
```typescript
interface FileNode {
  name: string;
  content?: string;
  children?: FileNode[];
  language?: string;
}
```

### 3. Path Format
```typescript
// Path as array of strings
activeTabPath: ['project', 'src', 'lib.rs']
```

## Styling Customization

### Colors
```css
/* Active segment */
bg-primary/10 text-primary

/* Inactive segment */
text-muted-foreground hover:bg-muted hover:text-foreground

/* Dropdown current item */
bg-accent font-medium

/* Chevron separator */
text-muted-foreground/50
```

### Spacing
```css
/* Container */
px-3 py-1.5

/* Segment button */
px-2 py-1

/* Gap between elements */
gap-1 (4px)
gap-1.5 (6px)
gap-2 (8px)
```

## Performance Considerations

### Memoization
```typescript
const segments = useMemo(() => {
  // Calculate segments
}, [activeTabPath, files]);
```

Only recalculates when:
- Active file changes
- File tree structure changes

### Lazy Rendering
- Dropdowns only render when opened
- Siblings calculated on-demand
- No unnecessary re-renders

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (responsive)

## Future Enhancements

- [ ] Breadcrumb search/filter
- [ ] Recent files in dropdowns
- [ ] Keyboard shortcuts for navigation
- [ ] Breadcrumb customization options
- [ ] Copy path to clipboard
- [ ] Show file size/modified date
- [ ] Breadcrumb history navigation
- [ ] Collapse long paths with ellipsis

## Troubleshooting

### Breadcrumbs Not Showing

**Problem**: Breadcrumbs don't appear

**Solution**: 
- Ensure a file is open (`activeTabPath` is not empty)
- Check that `files` array is populated
- Verify CodeEditor is rendering

### Dropdowns Not Opening

**Problem**: Click segment but dropdown doesn't open

**Solution**:
- Check browser console for errors
- Verify Radix UI components are installed
- Ensure no z-index conflicts

### Navigation Not Working

**Problem**: Click sibling file but editor doesn't switch

**Solution**:
- Verify `setActiveTabPath` and `addTab` are working
- Check workspace store is properly configured
- Ensure file exists in tree

### Icons Not Showing

**Problem**: Icons missing or broken

**Solution**:
- Verify lucide-react is installed
- Check icon imports
- Ensure proper icon component usage

## Summary

The breadcrumbs navigation bar provides an intuitive, VS Code-style interface for navigating the project structure directly from the editor, with dropdown menus for quick access to sibling files.
