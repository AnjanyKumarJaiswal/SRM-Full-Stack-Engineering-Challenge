import { useState } from 'react';
import type { BFHLResponse } from './types';
import { useBFHL } from './hooks/useBFHL';
import { IdentityDisplay } from './components/IdentityDisplay';
import { InputPanel } from './components/InputPanel';
import { TreeVisualization } from './components/TreeVisualization';
import { SummaryPanel } from './components/SummaryPanel';
import { Toast } from './components/Toast';
import './App.css';

function App() {
  const [response, setResponse] = useState<BFHLResponse | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const { submit, loading, error } = useBFHL();

  const handleSubmit = async (data: string[]) => {
    const result = await submit(data);
    if (result) {
      setResponse(result);
    } else {
      setToast(error || 'Failed to process request');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">TREEGUARD HIERARCHY</div>
      </header>

      <div className="container">
        {!response ? (
          <section className="hero">
            <div className="hero-tag">Real-time Hierarchical Graph Processing</div>
            <h1 className="hero-title">
              <span>Your Nodes Form Paths.</span>
              <span>TreeGuard Validates.</span>
            </h1>
            <p className="hero-description">
              TreeGuard runs complex graph traversal algorithms in parallel — 
              detecting cycles, validating parent-child relationships, and calculating 
              nesting depths in real time.
            </p>
            <InputPanel onSubmit={handleSubmit} loading={loading} />
          </section>
        ) : (
          <div className="results-container">
            <IdentityDisplay
              userId={response.user_id}
              emailId={response.email_id}
              collegeRollNumber={response.college_roll_number}
            />
            <div className="results-grid">
              <SummaryPanel
                summary={response.summary}
                invalidEntries={response.invalid_entries}
                duplicateEdges={response.duplicate_edges}
              />
              <TreeVisualization hierarchies={response.hierarchies} />
            </div>
            <button className="reset-btn" onClick={() => setResponse(null)}>
              New Scan Session
            </button>
          </div>
        )}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;