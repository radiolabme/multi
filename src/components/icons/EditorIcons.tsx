/**
 * Editor Icon Mappings
 *
 * Centralized icon definitions using Heroicons solid variants.
 * This provides a consistent icon set across the entire editor.
 */

import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ArrowTopRightOnSquareIcon,
  ArrowTurnDownLeftIcon,
  ArrowUpOnSquareStackIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  Bars3Icon,
  Bars4Icon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  BoldIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CodeBracketIcon,
  CodeBracketSquareIcon,
  ItalicIcon,
  LinkIcon,
  LinkSlashIcon,
  ListBulletIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
  RectangleGroupIcon,
  TableCellsIcon,
  TrashIcon,
  VariableIcon,
} from '@heroicons/react/24/solid';

import {
  H1Icon,
  H2Icon,
  H3Icon,
  NumberedListIcon,
  StrikethroughIcon,
  TableCellsIcon as TableCellsOutlineIcon,
  UnderlineIcon,
} from '@heroicons/react/24/outline';

export type IconComponent = typeof ArrowUturnLeftIcon;

/**
 * Editor toolbar icons
 */
export const EditorIcons = {
  // History
  undo: ArrowUturnLeftIcon,
  redo: ArrowUturnRightIcon,

  // Text formatting
  bold: BoldIcon,
  italic: ItalicIcon,
  underline: UnderlineIcon,
  strikethrough: StrikethroughIcon,
  code: CodeBracketIcon,

  // Headings
  h1: H1Icon,
  h2: H2Icon,
  h3: H3Icon,

  // Links
  link: LinkIcon,
  linkRemove: LinkSlashIcon,
  linkOpen: ArrowTopRightOnSquareIcon,
  linkEdit: PencilIcon,

  // Lists
  bulletList: ListBulletIcon,
  orderedList: NumberedListIcon,
  taskList: CheckCircleIcon,

  // Text Alignment
  alignLeft: Bars3BottomLeftIcon,
  alignCenter: Bars3Icon,
  alignRight: Bars3BottomRightIcon,
  alignJustify: Bars4Icon,

  // Blocks
  quote: ChatBubbleBottomCenterTextIcon,
  codeBlock: CodeBracketSquareIcon,
  horizontalRule: MinusIcon,
  hardBreak: ArrowTurnDownLeftIcon,

  // Table
  table: TableCellsIcon,
  tableDelete: TrashIcon,

  // Table navigation & manipulation
  arrowUp: ChevronUpIcon,
  arrowDown: ChevronDownIcon,
  arrowLeft: ChevronLeftIcon,
  arrowRight: ChevronRightIcon,
  arrowUpOnSquareStack: ArrowUpOnSquareStackIcon,
  barsArrowUp: BarsArrowUpIcon,
  barsArrowDown: BarsArrowDownIcon,
  merge: ArrowsPointingInIcon,
  split: ArrowsPointingOutIcon,

  // Generic actions
  add: PlusIcon,
  remove: TrashIcon,
  edit: PencilIcon,

  // Table header
  header: Bars3Icon,
  headerGroup: RectangleGroupIcon,
  headerRowEnabled: TableCellsIcon,
  headerRowDisabled: TableCellsOutlineIcon,

  // Math
  mathInline: VariableIcon,
  mathBlock: VariableIcon,
} as const;

export type EditorIconName = keyof typeof EditorIcons;
