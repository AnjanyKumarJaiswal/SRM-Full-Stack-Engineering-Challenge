import React from 'react';
import styles from './SummaryPanel.module.css';

interface SummaryPanelProps {
  summary: {
    total_trees: number;
    total_cycles: number;
    largest_tree_root: string;
  };
  invalidEntries: string[];
  duplicateEdges: string[];
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({
  summary,
  invalidEntries,
  duplicateEdges,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>GRAPH METRICS</h2>
        <div className={styles.line}></div>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>TOTAL TREES</div>
          <div className={styles.statValue}>{summary.total_trees}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>CYCLES DETECTED</div>
          <div className={styles.statValue}>{summary.total_cycles}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>LARGEST ROOT</div>
          <div className={styles.statValue}>{summary.largest_tree_root || 'N/A'}</div>
        </div>
      </div>

      <div className={styles.issues}>
        <div className={styles.issueSection}>
          <div className={styles.issueHeader}>
            <span>INVALID ENTRIES</span>
            <span className={styles.count}>{invalidEntries.length}</span>
          </div>
          <div className={styles.issueList}>
            {invalidEntries.length > 0 ? (
              invalidEntries.map((entry, i) => (
                <div key={i} className={styles.issueItem}>{entry}</div>
              ))
            ) : (
              <div className={styles.empty}>NO INVALID ENTRIES</div>
            )}
          </div>
        </div>

        <div className={styles.issueSection}>
          <div className={styles.issueHeader}>
            <span>DUPLICATE EDGES</span>
            <span className={styles.count}>{duplicateEdges.length}</span>
          </div>
          <div className={styles.issueList}>
            {duplicateEdges.length > 0 ? (
              duplicateEdges.map((edge, i) => (
                <div key={i} className={styles.issueItem}>{edge}</div>
              ))
            ) : (
              <div className={styles.empty}>NO DUPLICATES</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};