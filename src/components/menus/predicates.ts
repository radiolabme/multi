import type { MenuShowContext, MenuShowPredicate } from './types';

export const whenTextSelected: MenuShowPredicate = ({ state }) => {
  return !state.selection.empty;
};

export const whenInLink: MenuShowPredicate = ({ editor }) => {
  return editor.isActive('link');
};

export const whenInTable: MenuShowPredicate = ({ editor }) => {
  return editor.isActive('tableCell') || editor.isActive('tableHeader');
};

export const whenTextSelectedNotInTable: MenuShowPredicate = ({ editor, state }) => {
  const { empty } = state.selection;
  const inTable = editor.isActive('tableCell') || editor.isActive('tableHeader');
  return !empty && !inTable;
};

export function combineAnd(...predicates: MenuShowPredicate[]): MenuShowPredicate {
  return (context: MenuShowContext) => {
    return predicates.every((predicate) => predicate(context));
  };
}

export function combineOr(...predicates: MenuShowPredicate[]): MenuShowPredicate {
  return (context: MenuShowContext) => {
    return predicates.some((predicate) => predicate(context));
  };
}

export function not(predicate: MenuShowPredicate): MenuShowPredicate {
  return (context: MenuShowContext) => {
    return !predicate(context);
  };
}
