import React from 'react';
import { Hierarchy, TreeNode } from '../types';
import styles from './TreeVisualization.module.css';

interface TreeVisualizationProps {
  hierarchies: Hierarchy[];
}

const RenderNode: React.FC<{ node: TreeNode | string; label: string; isRoot?: boolean }> = ({ node, label, isRoot }) => {
  if (typeof node === 'string') {
    return (
      <div className={styles.nodeWrapper}>
        <div className={`${styles.node} ${styles.leaf}`}>{label}</div>
      </div>
    );
  }

  const keys = Object.keys(node);
  const content = node[label] || node;

  return (
    <div className={styles.nodeWrapper}>
      <div className={`${styles.node} ${isRoot ? styles.rootNode : ''}`}>
        {label}
      </div>
      {typeof content === 'object' && Object.keys(content).length > 0 && (
        <div className={styles.children}>
          {Object.entries(content).map(([key, value]) => (
            <RenderNode key={key} label={key} node={value as TreeNode} />
          ))}
        </div>
      )}
    </div>
  );
};

export const TreeVisualization: React.FC<TreeVisualizationProps> = ({ hierarchies }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>SYSTEM HIERARCHY</h2>
        <div className={styles.line}></div>
      </div>

      <div className={styles.treeGrid}>
        {hierarchies.map((h, i) => (
          <div key={i} className={styles.treeCard}>
            <div className={styles.treeHeader}>
              <div className={styles.treeTitle}>
                {h.has_cycle ? 'CYCLIC GROUP' : `TREE: ROOT ${h.root}`}
              </div>
              {!h.has_cycle && <div className={styles.depth}>DEPTH: {h.depth}</div>}
            </div>
            
            <div className={styles.treeBody}>
              {h.has_cycle ? (
                <div className={styles.cycleAlert}>
                  <span className={styles.warningIcon}>⚠️</span>
                  RECURSIVE DEPENDENCY DETECTED
                </div>
              ) : (
                <RenderNode node={h.tree} label={h.root} isRoot />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};