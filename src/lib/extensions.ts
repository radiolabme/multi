import type { Extensions, Extension } from '@tiptap/core';

function flattenExtensions(extensions: Extensions): Extensions {
  const flattened: Extensions = [];

  for (const ext of extensions) {
    // Check if this is a kit (has extensions property) that needs expanding
    if (ext && typeof ext === 'object' && 'extensions' in ext && Array.isArray(ext.extensions)) {
      flattened.push(...flattenExtensions(ext.extensions as Extensions));
    } else {
      flattened.push(ext as Extension);
    }
  }

  return flattened;
}

export function mergeExtensions(
  existingExtensions: Extensions,
  newExtensions: Extensions
): Extensions {
  const allFlat = [
    ...flattenExtensions(existingExtensions),
    ...flattenExtensions(newExtensions)
  ];

  // Deduplicate by name, keeping the LAST occurrence (later config wins)
  const seen = new Map<string, any>();
  for (const ext of allFlat) {
    seen.set(ext.name, ext);
  }

  return Array.from(seen.values());
}

/**
 * Check if an extension with the given name already exists
 *
 * @param extensions - Array of extensions to check
 * @param name - Extension name to look for
 * @returns True if extension exists
 */
export function hasExtension(extensions: Extensions, name: string): boolean {
  return extensions.some((ext) => ext.name === name);
}

/**
 * Remove extensions by name
 *
 * @param extensions - Array of extensions
 * @param names - Extension names to remove
 * @returns Filtered array
 */
export function removeExtensions(extensions: Extensions, names: string[]): Extensions {
  const nameSet = new Set(names);
  return extensions.filter((ext) => !nameSet.has(ext.name));
}
