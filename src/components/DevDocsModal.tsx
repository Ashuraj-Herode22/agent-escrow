'use client';

import React, { useState } from 'react';
import { X, Terminal, Code2, Copy, CheckCircle2, ExternalLink } from 'lucide-react';

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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 text-xs flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F0F5FA] border border-[#D0E2F2] flex items-center justify-center text-[#003087]">
              <Code2 className="w-4 h-4 text-[#0070BA]" />
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

        {/* Tab Selector */}
        <div className="grid grid-cols-3 bg-slate-100/80 p-0.5 rounded-lg text-center font-medium border border-slate-200/50">
          <button
            onClick={() => setActiveTab('PYTHON')}
            className={`py-1.5 rounded-md transition-all cursor-pointer font-bold ${
              activeTab === 'PYTHON'
                ? 'bg-white text-[#003087] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Python (CrewAI / AutoGen)
          </button>
          <button
            onClick={() => setActiveTab('TYPESCRIPT')}
            className={`py-1.5 rounded-md transition-all cursor-pointer font-bold ${
              activeTab === 'TYPESCRIPT'
                ? 'bg-white text-[#003087] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            TypeScript (LangChain / Vercel AI)
          </button>
          <button
            onClick={() => setActiveTab('CURL')}
            className={`py-1.5 rounded-md transition-all cursor-pointer font-bold ${
              activeTab === 'CURL'
                ? 'bg-white text-[#003087] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Headless cURL Endpoint
          </button>
        </div>

        {/* Code Snippet Box */}
        <div className="relative rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 font-mono text-xs text-slate-800 leading-relaxed overflow-x-auto max-h-[280px]">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs text-xs font-sans font-semibold text-slate-700 hover:text-[#003087] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
          <pre>{currentSnippet}</pre>
        </div>

        {/* Integration Notes */}
        <div className="bg-[#F0F5FA] border border-[#D0E2F2] rounded-xl p-3 flex items-start gap-2.5">
          <Terminal className="w-4 h-4 text-[#0070BA] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-slate-800">Seamless Drop-in Agent Architecture:</p>
            <p className="text-slate-600">
              Any external autonomous agent can commission contracts and escrow funds via REST v2 endpoints. Funds remain secured under PayPal buyer authorization until the cryptographic release token is issued by the AI Arbiter.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

