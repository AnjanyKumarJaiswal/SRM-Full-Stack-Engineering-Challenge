export interface TreeNode {
  [key: string]: TreeNode | string;
}

export interface Hierarchy {
  root: string;
  tree: TreeNode;
  depth?: number;
  has_cycle?: boolean;
}

export interface Summary {
  total_trees: number;
  total_cycles: number;
  largest_tree_root: string;
}

export interface BFHLResponse {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: Hierarchy[];
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: Summary;
}