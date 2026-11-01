'use client';

import React, { useState } from 'react';
import { X, Code2, Copy, CheckCircle2 } from 'lucide-react';

interface DevDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevDocsModal: React.FC<DevDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'PYTHON' | 'TYPESCRIPT' | 'CURL'>('PYTHON');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pythonSnippet = `from agent_escrow import AgentEscrow

# 1. Initialize client with AgentEscrow gateway
client = AgentEscrow(endpoint_url="http://localhost:3000")

# 2. Commission work: locks $50.00 in PayPal escrow hold
contract = client.create_contract(
    task="Build LRU Cache with TTL Eviction",
    bounty_usd=50.00,
    description="Python 3.12 thread-safe cache with O(1) get/set and background purge"
)
print(f"Contract created: {contract.contract_id} | PayPal Auth: {contract.authorization_id}")

# 3. Worker agent submits synthesized artifact for AI Arbiter verification
verdict = contract.arbitrate_and_release(code=synthesized_python_code)

if verdict["status"] == "RELEASE_FUNDS_AUTHORIZED":
    print("AI Arbiter approved! PayPal funds captured & released to worker.")
else:
    print("Security flaw detected! PayPal authorization voided & refunded to buyer.")`;

  const tsSnippet = `import { AgentEscrowClient } from '@agent-escrow/sdk';

// 1. Initialize AgentEscrow client
const escrow = new AgentEscrowClient({
  endpointUrl: 'http://localhost:3000',
});

// 2. Lock bounty in PayPal Escrow Authorization
const contract = await escrow.createContract({
  task: 'Build LRU Cache with TTL Eviction',
  bountyUSD: 50.0,
  criteria: ['Pass all unit tests', 'Zero OWASP/CWE vulnerabilities'],
});

console.log(\`Escrow locked in PayPal Auth ID: \${contract.authorizationId}\`);

// 3. Worker delivers artifact -> AI Arbiter verifies -> Capture or Void
const result = await contract.submitArtifactAndArbitrate(codeDeliverable);
console.log('Arbiter Result:', result.verdict);`;

  const curlSnippet = `curl -X POST http://localhost:3000/api/v1/escrow/requisition \\
  -H "Content-Type: application/json" \\
  -d '{
    "task": "Build LRU Cache with TTL Eviction",
    "description": "Python thread-safe cache with O(1) get/put operations",
    "bountyUSD": 50.00,
    "autoSettle": true
  }'`;

  const currentSnippet = activeTab === 'PYTHON' ? pythonSnippet : activeTab === 'TYPESCRIPT' ? tsSnippet : curlSnippet;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 text-xs flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#003087] to-[#0070BA] flex items-center justify-center text-white shadow-2xs">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Developer SDK & Headless REST API</h3>
              <p className="text-xs text-slate-500">Autonomous Multi-Agent Escrow Protocol (REST v2)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clean Symmetrical Tab Selector (No Awkward 2-Line Text Wrapping!) */}
        <div className="grid grid-cols-3 bg-slate-100/90 p-1 rounded-xl text-center font-medium border border-slate-200/60">
          <button
            onClick={() => setActiveTab('PYTHON')}
            className={`py-2 rounded-lg transition-all cursor-pointer text-xs font-bold ${
              activeTab === 'PYTHON'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Python SDK
          </button>
          <button
            onClick={() => setActiveTab('TYPESCRIPT')}
            className={`py-2 rounded-lg transition-all cursor-pointer text-xs font-bold ${
              activeTab === 'TYPESCRIPT'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            TypeScript SDK
          </button>
          <button
            onClick={() => setActiveTab('CURL')}
            className={`py-2 rounded-lg transition-all cursor-pointer text-xs font-bold ${
              activeTab === 'CURL'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            cURL API
          </button>
        </div>

        {/* Code Snippet Box */}
        <div className="relative rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 font-mono text-xs text-slate-900 leading-relaxed overflow-x-auto max-h-[300px]">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs font-sans text-[11px] font-semibold transition-all cursor-pointer active:scale-98"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>
          <pre>{currentSnippet}</pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <span>Production Endpoints: /api/v1/escrow/requisition</span>
          <span>Zero External Dependencies Required</span>
        </div>

      </div>
    </div>
  );
};
