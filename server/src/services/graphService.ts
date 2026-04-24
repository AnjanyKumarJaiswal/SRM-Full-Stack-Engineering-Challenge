import { ParsedEdge, TreeNode, Hierarchy } from '../types';

export class GraphService {
  private adjacency: Map<string, Set<string>>;
  private parents: Map<string, string>;
  private nodeSet: Set<string>;
  private edges: ParsedEdge[];
  private invalidEntries: string[];
  private duplicateEdges: string[];

  constructor() {
    this.adjacency = new Map();
    this.parents = new Map();
    this.nodeSet = new Set();
    this.edges = [];
    this.invalidEntries = [];
    this.duplicateEdges = [];
  }

  parseAndValidate(data: string[]): void {
    const validPattern = /^[A-Z]->[A-Z]$/;

    for (const entry of data) {
      const trimmed = entry.trim();

      if (!validPattern.test(trimmed)) {
        this.invalidEntries.push(trimmed);
        continue;
      }

      const [parent, child] = trimmed.split('->');

      if (parent === child) {
        this.invalidEntries.push(trimmed);
        continue;
      }

      this.nodeSet.add(parent);
      this.nodeSet.add(child);

      const edgeKey = `${parent}->${child}`;
      const isDuplicate = this.edges.some(
        e => e.parent === parent && e.child === child
      );

      if (isDuplicate) {
        this.duplicateEdges.push(trimmed);
        continue;
      }

      if (this.parents.has(child)) {
        this.duplicateEdges.push(trimmed);
        continue;
      }

      this.parents.set(child, parent);
      this.edges.push({ parent, child, original: trimmed });

      if (!this.adjacency.has(parent)) {
        this.adjacency.set(parent, new Set());
      }
      this.adjacency.get(parent)!.add(child);
    }
  }

  findRoots(): string[] {
    const potentialRoots = new Set(this.nodeSet);
    for (const child of this.parents.keys()) {
      potentialRoots.delete(child);
    }
    return Array.from(potentialRoots);
  }

  findConnectedGroups(): string[][] {
    const visited = new Set<string>();
    const groups: string[][] = [];

    for (const node of this.nodeSet) {
      if (visited.has(node)) continue;

      const group: string[] = [];
      const stack = [node];

      while (stack.length > 0) {
        const current = stack.pop()!;
        if (visited.has(current)) continue;
        visited.add(current);
        group.push(current);

        const children = this.adjacency.get(current);
        if (children) {
          for (const child of children) {
            if (!visited.has(child)) {
              stack.push(child);
            }
          }
        }

        const parent = this.parents.get(current);
        if (parent && !visited.has(parent)) {
          stack.push(parent);
        }
      }

      if (group.length > 0) {
        groups.push(group);
      }
    }

    return groups;
  }

  detectCycle(start: string): { hasCycle: boolean; cycleNodes: Set<string>} {
    const visited = new Set<string>();
    const inStack = new Set<string>();
    const cycleNodes = new Set<string>();

    const dfs = (node: string): boolean => {
      visited.add(node);
      inStack.add(node);

      const children = this.adjacency.get(node);
      if (children) {
        for (const child of children) {
          if (inStack.has(child)) {
            cycleNodes.add(child);
            cycleNodes.add(node);
            return true;
          }
          if (!visited.has(child)) {
            if (dfs(child)) {
              return true;
            }
          }
        }
      }

      inStack.delete(node);
      return false;
    };

    const hasCycle = dfs(start);

    if (hasCycle && cycleNodes.size === 0) {
      let current = start;
      const parent = this.parents.get(start);
      if (parent) {
        cycleNodes.add(start);
        cycleNodes.add(parent);
      }
    }

    return { hasCycle, cycleNodes };
  }

  buildTree(root: string, cycleNodes: Set<string>): TreeNode {
    const build = (node: string, parentInCycle: boolean): TreeNode => {
      const nodeInCycle = cycleNodes.has(node);
      const children = this.adjacency.get(node) || new Set();

      if (children.size === 0) {
        return { [node]: '' };
      }

      const tree: TreeNode = {};
      for (const child of children) {
        if (nodeInCycle && cycleNodes.has(child)) {
          continue;
        }
        tree[node] = tree[node] || {};
        (tree[node] as TreeNode)[child] = build(child, nodeInCycle);
      }

      return tree;
    };

    return build(root, false);
  }

  calculateDepth(tree: TreeNode): number {
    const getHeight = (node: TreeNode | string): number => {
      if (typeof node === 'string') return 1;
      const keys = Object.keys(node);
      if (keys.length === 0) return 1;
      let maxChildDepth = 0;
      for (const key of keys) {
        const child = node[key];
        maxChildDepth = Math.max(maxChildDepth, getHeight(child));
      }
      return 1 + maxChildDepth;
    };

    const rootKey = Object.keys(tree)[0];
    return getHeight(tree[rootKey] as TreeNode);
  }

  process(): Hierarchy[] {
    const roots = this.findRoots();
    const hierarchies: Hierarchy[] = [];
    const usedNodes = new Set<string>();

    for (const root of roots) {
      if (usedNodes.has(root)) continue;

      const { hasCycle, cycleNodes } = this.detectCycle(root);

      if (hasCycle) {
        hierarchies.push({
          root,
          tree: {},
          has_cycle: true,
        });

        for (const node of cycleNodes) {
          usedNodes.add(node);
        }
      } else {
        const tree = this.buildTree(root, new Set());
        const depth = this.calculateDepth(tree);

        hierarchies.push({
          root,
          tree,
          depth,
        });

        const collectNodes = (node: TreeNode | string): void => {
          if (typeof node === 'string') {
            usedNodes.add(node);
            return;
          }
          for (const key of Object.keys(node)) {
            usedNodes.add(key);
            collectNodes(node[key]);
          }
        };
        collectNodes(tree);
      }
    }

    const connectedGroups = this.findConnectedGroups();
    for (const group of connectedGroups) {
      const groupNodes = new Set(group);
      const hasUnvisited = group.some(n => !usedNodes.has(n));

      if (hasUnvisited) {
        const unvisitedNodes = group.filter(n => !usedNodes.has(n));
        const { hasCycle, cycleNodes } = this.detectCycle(unvisitedNodes[0]);

        if (hasCycle) {
          const lexSmallest = unvisitedNodes.sort()[0];
          hierarchies.push({
            root: lexSmallest,
            tree: {},
            has_cycle: true,
          });
          for (const node of unvisitedNodes) {
            usedNodes.add(node);
          }
        }
      }
    }

    return hierarchies;
  }

  getInvalidEntries(): string[] {
    return this.invalidEntries;
  }

  getDuplicateEdges(): string[] {
    return this.duplicateEdges;
  }
}