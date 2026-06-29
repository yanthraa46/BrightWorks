import { useState } from 'react';

type TabId = 'regional-map' | 'vendor-evaluation' | 'ai-governance';

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'regional-map', label: 'Regional Map' },
  { id: 'vendor-evaluation', label: 'Vendor Evaluation' },
  { id: 'ai-governance', label: 'AI Governance' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('regional-map');
  const [selectedVendor, setSelectedVendor] = useState(false);

  return (
    <main>
      <p>Static prototype / demo data only</p>

      <nav aria-label="Dashboard sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'regional-map' && (
        <section aria-labelledby="provider-readiness-summary">
          <h1 id="provider-readiness-summary">Provider Readiness Summary</h1>
          <p>Regional onboarding readiness narrative remains available.</p>
        </section>
      )}

      {activeTab === 'vendor-evaluation' && (
        <section aria-labelledby="vendor-evaluation">
          <h1 id="vendor-evaluation">Vendor Evaluation</h1>
          {!selectedVendor ? (
            <table>
              <tbody>
                <tr onClick={() => setSelectedVendor(true)}>
                  <td>Abridge AI/ML</td>
                  <td>6.4</td>
                  <td>Flagged</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <article>
              <h2>Abridge Detail</h2>
              <p>expired SOC 2 posture</p>
            </article>
          )}
        </section>
      )}

      {activeTab === 'ai-governance' && (
        <section aria-labelledby="critical-ai-governance-alert">
          <h1 id="critical-ai-governance-alert">Critical AI Governance Alert</h1>
          <p>6 of 8 AI tools operating without PHI governance</p>
        </section>
      )}
    </main>
  );
}
