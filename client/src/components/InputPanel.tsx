import React, { useState } from 'react';
import styles from './InputPanel.module.css';

interface InputPanelProps {
  onSubmit: (data: string[]) => void;
  loading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({ onSubmit, loading }) => {
  const [input, setInput] = useState('["A->B", "B->C", "B->D", "D->E"]');

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        onSubmit(parsed);
      } else {
        alert('Input must be a JSON array of strings');
      }
    } catch (e) {
      alert('Invalid JSON format');
    }
  };

  return (
    <div className={styles.terminal}>
      <div className={styles.header}>
        <div className={styles.dots}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className={styles.title}>treeguard — graph_session</div>
      </div>
      <div className={styles.body}>
        <div className={styles.line}>
          <span className={styles.prompt}>$</span>
          <span className={styles.command}>initialize scan --input</span>
        </div>
        <textarea
          className={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='["A->B", "B->C"]'
          spellCheck={false}
        />
        <div className={styles.actions}>
          <button 
            className={styles.submitBtn} 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'PROCESSING...' : 'START SCANNING'}
          </button>
        </div>
      </div>
    </div>
  );
};