import { TreeNode } from '../types';

export const formatJSON = (obj: unknown, indent = 0): string => {
  const spaces = '  '.repeat(indent);

  if (obj === null || obj === undefined) {
    return 'null';
  }

  if (typeof obj === 'string') {
    return `"${obj}"`;
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return String(obj);
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    const items = obj.map(item => formatJSON(item, indent + 1)).join(',\n');
    return `[\n${spaces}  ${items}\n${spaces}]`;
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';

    const entries = keys.map(key => {
      const value = obj[key as keyof typeof obj];
      if (value === '' || (typeof value === 'object' && Object.keys(value).length === 0)) {
        return `"${key}": ""`;
      }
      return `"${key}": ${formatJSON(value, indent + 1)}`;
    }).join(',\n');

    return `{\n${spaces}  ${entries}\n${spaces}}`;
  }

  return String(obj);
};

export const flattenTree = (tree: TreeNode, prefix = ''): { path: string; value: string }[] => {
  const result: { path: string; value: string }[] = [];

  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix} > ${key}` : key;

    if (value === '') {
      result.push({ path, value: '(leaf)' });
    } else if (typeof value === 'object') {
      result.push({ path, value: '(intermediate)' });
      result.push(...flattenTree(value, path));
    }
  }

  return result;
};