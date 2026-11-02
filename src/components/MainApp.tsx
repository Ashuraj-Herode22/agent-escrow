'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from '@/components/Header';
import { EscrowRibbon } from '@/components/EscrowRibbon';
import { ContractCard } from '@/components/ContractCard';
import { AgentTerminal } from '@/components/AgentTerminal';
import { CodeInspector } from '@/components/CodeInspector';
import { CustomTaskModal } from '@/components/CustomTaskModal';
import { DevDocsModal } from '@/components/DevDocsModal';
import { PolicyModal } from '@/components/PolicyModal';
import { ArtifactModal } from '@/components/ArtifactModal';
import { TaskContract, AgentMessage } from '@/types/escrow';
import { SIMULATION_PRESETS, createInitialContract, getStepDetails } from '@/lib/agent-engine';

// Human Observability Stream Pacing:
// In headless production API (/api/v1/escrow/requisition), agent settlement runs at sub-second wire speed.
// In the interactive telemetry dashboard, we pace multi-agent step dispatching (1,500ms) to emulate
// distributed network consensus roundtrips and enable real-time human observation.
const TELEMETRY_STREAM_PACE_MS = 1500;

interface CustomFlowState {
  finalContract: TaskContract;
  allMessages: AgentMessage[];
  result: any;
}

export default function MainApp() {
  const [presetKey, setPresetKey] = useState<'SUCCESS_FLOW' | 'HEALING_FLOW' | 'DISPUTE_FLOW'>('SUCCESS_FLOW');
  const [contract, setContract] = useState<TaskContract>(() => createInitialContract('SUCCESS_FLOW').contract);
  const [messages, setMessages] = useState<AgentMessage[]>(() => createInitialContract('SUCCESS_FLOW').messages);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCustomTaskOpen, setIsCustomTaskOpen] = useState<boolean>(false);
  const [isDevDocsOpen, setIsDevDocsOpen] = useState<boolean>(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState<boolean>(false);
  const [isArtifactModalOpen, setIsArtifactModalOpen] = useState<boolean>(false);
  const [artifactModalTab, setArtifactModalTab] = useState<'CODE' | 'TESTS' | 'AUDIT'>('CODE');
  const [customFlow, setCustomFlow] = useState<CustomFlowState | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const customFlowRef = useRef<CustomFlowState | null>(null);
  customFlowRef.current = customFlow;

  const totalSteps = customFlow
    ? 6
    : presetKey === 'SUCCESS_FLOW'
    ? 7
    : presetKey === 'HEALING_FLOW'
    ? 9
    : 8;

  // Execute a single step in custom flow
  const executeCustomStep = (stepNumber: number, flow: CustomFlowState) => {
    const { finalContract, result } = flow;
    const isPassed = finalContract.status === 'PAYOUT_COMPLETED' || result?.verdict === 'RELEASE_FUNDS_AUTHORIZED';
    const now = new Date().toISOString();

    if (stepNumber === 1) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-1`,
          timestamp: now,
          sender: 'BUYER_AGENT',
          title: 'Custom Task Requisition Dispatched',
          content: `I am commissioning custom task: "${finalContract.title}". Budget allocated: $${finalContract.totalBudgetUSD.toFixed(2)} USD. Cure policy: 3 revision attempts.`,
          stepIndex: 1,
          type: 'TASK_SPEC',
          dataPayload: { budgetUSD: finalContract.totalBudgetUSD },
        },
      ]);
    } else if (stepNumber === 2) {
      setContract((prev) => ({
        ...prev,
        status: 'WAITING_DEPOSIT',
        paypalMetadata: {
          ...prev.paypalMetadata,
          orderId: finalContract.paypalMetadata.orderId || `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}-SANDBOX`,
        },
      }));

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-2`,
          timestamp: now,
          sender: 'PAYPAL_ESCROW',
          title: 'PayPal Requisition Order Created',
          content: `Protocol Order created with intent=AUTHORIZE. Order ID: ${finalContract.paypalMetadata.orderId || 'ORD-98213'}. Awaiting cryptographic authorization hold.`,
          stepIndex: 2,
          type: 'PAYPAL_ORDER_CREATED',
          dataPayload: {
            event_type: 'CHECKOUT.ORDER.APPROVED',
            order_id: finalContract.paypalMetadata.orderId,
            intent: 'AUTHORIZE',
            amount: { total: finalContract.totalBudgetUSD.toFixed(2), currency: 'USD' },
            status: 'APPROVED',
          },
        },
      ]);
    } else if (stepNumber === 3) {
      const authId = finalContract.paypalMetadata.authorizationId || `AUTH-${Math.random().toString(36).substring(2, 8).toUpperCase()}-ESCROW`;
      setContract((prev) => ({
        ...prev,
        status: 'ESCROW_LOCKED',
        paypalMetadata: {
          ...prev.paypalMetadata,
          authorizationId: authId,
          escrowLockedAt: now,
        },
      }));

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-3`,
          timestamp: now,
          sender: 'PAYPAL_ESCROW',
          title: 'Escrow Vault Locked (Funds On Hold)',
          content: `Authorization confirmed (${authId}). $${finalContract.totalBudgetUSD.toFixed(2)} USD locked in Escrow Vault. Worker agent authorized to begin execution.`,
          stepIndex: 3,
          type: 'PAYPAL_AUTH_HOLD',
          dataPayload: {
            event_type: 'PAYMENT.AUTHORIZATION.CREATED',
            resource_type: 'authorization',
            authorization_id: authId,
            amount: { total: finalContract.totalBudgetUSD.toFixed(2), currency: 'USD' },
            state: 'authorized',
            valid_until: '72h',
            hmac_signature: 'VERIFIED_ECDSA_SHA256',
          },
        },
      ]);
    } else if (stepNumber === 4) {
      setContract((prev) => ({
        ...prev,
        status: 'DELIVERED_AUDITING',
        codeArtifact: finalContract.codeArtifact,
      }));

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-4`,
          timestamp: now,
          sender: 'WORKER_AGENT',
          title: 'Digital Artifact Delivered to Engine',
          content: `Source code delivered (${finalContract.codeArtifact?.filename || 'service.py'}). Deliverable signed with SHA-256 hash. Requesting AI Arbiter inspection.`,
          stepIndex: 4,
          type: 'CODE_SUBMITTED',
          dataPayload: {
            filename: finalContract.codeArtifact?.filename,
            sha256Hash: finalContract.codeArtifact?.sha256Hash,
            loc: finalContract.codeArtifact?.code.split('\n').length,
          },
        },
      ]);
    } else if (stepNumber === 5) {
      setContract((prev) => ({
        ...prev,
        status: isPassed ? 'ARBITRATION_PASSED' : 'ARBITRATION_FAILED',
        milestones: finalContract.milestones,
      }));

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-5`,
          timestamp: now,
          sender: 'ARBITER_AGENT',
          title: isPassed
            ? 'Arbiter Verdict: All Dynamic Tests Passed'
            : 'Arbiter Verdict: Security Flaw Intercepted & Quarantined',
          content: isPassed
            ? `Executed test assertions with ${result?.score || 100}% compliance score. Zero vulnerabilities detected. Cryptographic release token signed.`
            : `Inspection halted. Security policy flagged critical vulnerability (${result?.securityFindings?.[0] || 'CWE-89 SQL Injection'}). Escrow release rejected.`,
          stepIndex: 5,
          type: 'ARBITER_AUDIT',
          dataPayload: {
            verdict: isPassed ? 'RELEASE_FUNDS_AUTHORIZED' : 'PAYOUT_DENIED_VOID_ESCROW',
            score: `${result?.score || (isPassed ? 100 : 25)}%`,
            testsPassed: finalContract.milestones[0]?.testSuite.passed,
            testsTotal: finalContract.milestones[0]?.testSuite.total,
            securityGate: isPassed ? 'PASSED_CLEAN' : 'BLOCKED_QUARANTINED',
          },
        },
      ]);
    } else if (stepNumber === 6) {
      if (isPassed) {
        const captureId = finalContract.paypalMetadata.captureId || `CAP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-RELEASE`;
        setContract((prev) => ({
          ...prev,
          status: 'PAYOUT_COMPLETED',
          paypalMetadata: {
            ...prev.paypalMetadata,
            captureId,
            releasedAt: now,
          },
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-6`,
            timestamp: now,
            sender: 'PAYPAL_ESCROW',
            title: 'Capture & Instant Payout Executed',
            content: `Escrow Authorization captured (${captureId}). Payout of $${finalContract.totalBudgetUSD.toFixed(2)} USD disbursed to Worker Agent. Transaction audited and finalized.`,
            stepIndex: 6,
            type: 'PAYPAL_PAYOUT',
            dataPayload: {
              event_type: 'PAYMENT.CAPTURE.COMPLETED',
              resource_type: 'capture',
              capture_id: captureId,
              amount: { total: finalContract.totalBudgetUSD.toFixed(2), currency: 'USD' },
              payout_status: 'DISBURSED_TO_WORKER',
              is_final_capture: true,
              hmac_signature: 'VERIFIED_ECDSA_SHA256',
            },
          },
        ]);

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setContract((prev) => ({
          ...prev,
          status: 'DISPUTE_REFUNDED',
          paypalMetadata: {
            ...prev.paypalMetadata,
            captureId: 'VOIDED_AUTHORIZATION',
          },
        }));

        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-6`,
            timestamp: now,
            sender: 'PAYPAL_ESCROW',
            title: 'Void Authorization: 100% Refunded to Buyer',
            content: `Authorization voided. $${finalContract.totalBudgetUSD.toFixed(2)} USD escrow hold cancelled. 100% of funds returned to Buyer Agent. Zero loss incurred due to AI Arbiter escrow protection.`,
            stepIndex: 6,
            type: 'DISPUTE_REFUND',
            dataPayload: {
              event_type: 'PAYMENT.AUTHORIZATION.VOIDED',
              resource_type: 'authorization',
              authorization_id: finalContract.paypalMetadata.authorizationId || 'AUTH-77312',
              state: 'voided',
              reason: 'AI_ARBITER_CWE_SECURITY_VIOLATION',
              refund_amount: { total: finalContract.totalBudgetUSD.toFixed(2), currency: 'USD' },
              buyer_protected: true,
            },
          },
        ]);
      }
    }

    setCurrentStep(stepNumber);
  };

  // Perform preset step transition
  const executePresetStep = (stepNumber: number) => {
    const stepData = getStepDetails(stepNumber, presetKey, {
      orderId: contract.paypalMetadata.orderId,
      authId: contract.paypalMetadata.authorizationId,
      captureId: contract.paypalMetadata.captureId,
    });

    setContract((prev) => {
      const updated: TaskContract = {
        ...prev,
        status: stepData.nextStatus,
        milestones: stepData.milestoneUpdates || prev.milestones,
        codeArtifact: stepData.codeArtifact || prev.codeArtifact,
        revisionAttempt: stepData.revisionAttempt ?? prev.revisionAttempt,
        isPatched: stepData.isPatched ?? prev.isPatched,
      };

      if (stepNumber === 3) {
        updated.paypalMetadata.orderId = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}-SANDBOX`;
      }
      if (stepNumber === 4) {
        updated.paypalMetadata.authorizationId = `AUTH-${Math.random().toString(36).substring(2, 8).toUpperCase()}-ESCROW`;
        updated.paypalMetadata.escrowLockedAt = new Date().toISOString();
      }

      const isFinalSuccess =
        (presetKey === 'SUCCESS_FLOW' && stepNumber === 7) ||
        (presetKey === 'HEALING_FLOW' && stepNumber === 9);

      if (isFinalSuccess) {
        updated.paypalMetadata.captureId = `CAP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-RELEASE`;
        updated.paypalMetadata.releasedAt = new Date().toISOString();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else if (presetKey === 'DISPUTE_FLOW' && stepNumber === 8) {
        updated.paypalMetadata.captureId = 'VOIDED_AUTHORIZATION';
      }

      return updated;
    });

    setMessages((prev) => [...prev, stepData.message]);
    setCurrentStep(stepNumber);
  };

  const executeStep = (stepNumber: number) => {
    if (customFlowRef.current) {
      executeCustomStep(stepNumber, customFlowRef.current);
    } else {
      executePresetStep(stepNumber);
    }
  };

  const handleApplyCustomTask = (customContract: TaskContract, customMessages: AgentMessage[], result?: any) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);

    const flowData: CustomFlowState = {
      finalContract: customContract,
      allMessages: customMessages,
      result,
    };

    setCustomFlow(flowData);
    customFlowRef.current = flowData;

    const initialContract: TaskContract = {
      id: customContract.id,
      title: customContract.title,
      description: customContract.description,
      totalBudgetUSD: customContract.totalBudgetUSD,
      currency: 'USD',
      buyerAgentId: 'Buyer-01',
      workerAgentId: 'Coder-01',
      arbiterAgentId: 'Arbiter-01',
      status: 'INITIALIZING',
      createdAt: new Date().toISOString(),
      revisionAttempt: 1,
      maxRevisions: 3,
      isPatched: false,
      milestones: [
        {
          id: 'M1',
          title: 'Custom Architecture & Logic Implementation',
          description: customContract.description.substring(0, 80),
          amountUSD: customContract.totalBudgetUSD,
          status: 'PENDING',
          testSuite: {
            total: result?.tests?.length || 4,
            passed: 0,
            failed: 0,
            tests: [],
          },
        },
      ],
      paypalMetadata: {
        isSimulated: true,
      },
    };

    setContract(initialContract);
    setMessages([]);
    setCurrentStep(0);
    setIsRunning(true);

    let step = 0;
    intervalRef.current = setInterval(() => {
      step += 1;
      if (step <= 6) {
        executeCustomStep(step, flowData);
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
      }
    }, TELEMETRY_STREAM_PACE_MS);
  };

  const handleSelectPreset = (key: 'SUCCESS_FLOW' | 'HEALING_FLOW' | 'DISPUTE_FLOW') => {
    if (isRunning) return;
    setCustomFlow(null);
    customFlowRef.current = null;
    setPresetKey(key);
    const { contract: initContract, messages: initMessages } = createInitialContract(key);
    setContract(initContract);
    setMessages(initMessages);
    setCurrentStep(0);
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);

    if (customFlow) {
      const initialContract: TaskContract = {
        ...customFlow.finalContract,
        status: 'INITIALIZING',
        codeArtifact: undefined,
        milestones: [
          {
            ...customFlow.finalContract.milestones[0],
            status: 'PENDING',
            testSuite: {
              ...customFlow.finalContract.milestones[0].testSuite,
              passed: 0,
              failed: 0,
              tests: [],
            },
          },
        ],
        paypalMetadata: {
          isSimulated: true,
        },
      };
      setContract(initialContract);
      setMessages([]);
      setCurrentStep(0);
    } else {
      const { contract: initContract, messages: initMessages } = createInitialContract(presetKey);
      setContract(initContract);
      setMessages(initMessages);
      setCurrentStep(0);
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      executeStep(currentStep + 1);
    }
  };

  const handleStartSimulation = () => {
    if (isRunning || currentStep >= totalSteps) return;
    setIsRunning(true);

    let next = currentStep;
    intervalRef.current = setInterval(() => {
      next += 1;
      if (next <= totalSteps) {
        executeStep(next);
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
      }
    }, TELEMETRY_STREAM_PACE_MS);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0C2340] flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* 1. Minimalist Top Navigation */}
      <Header
        currentPreset={SIMULATION_PRESETS[presetKey]}
        onSelectPreset={handleSelectPreset}
        isRunning={isRunning}
        onStartSimulation={handleStartSimulation}
        onNextStep={handleNextStep}
        onReset={handleReset}
        currentStep={currentStep}
        totalSteps={totalSteps}
        isSimulated={true}
        onOpenCustomTask={() => setIsCustomTaskOpen(true)}
        onOpenSdkDocs={() => setIsDevDocsOpen(true)}
        onOpenPolicyModal={() => setIsPolicyModalOpen(true)}
      />

      {/* 2. Main Workspace */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 flex flex-col gap-6">
        
        {/* Unified Escrow Hero with 4-Step Visual Stepper */}
        <EscrowRibbon
          contract={contract}
          onSimulateApproveDeposit={handleNextStep}
        />

        {/* Primary Stage: 2 Spacious Equal-Height Columns (50% / 50%) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Column 1: Live Agent Activity Stream with Purposeful Staged Ready State */}
          <AgentTerminal
            messages={messages}
            contract={contract}
            onStartSimulation={handleStartSimulation}
            isRunning={isRunning}
          />

          {/* Column 2: Continuous Verification Sandbox Pipeline (Never Disappears!) */}
          <CodeInspector
            contract={contract}
            onOpenPolicyModal={() => setIsPolicyModalOpen(true)}
            onOpenArtifactModal={(tab) => {
              setArtifactModalTab(tab || 'CODE');
              setIsArtifactModalOpen(true);
            }}
          />

        </div>

        {/* Secondary Stage: Programmable Milestones & Terms (Natural Scroll Below the Fold) */}
        <section className="pt-2">
          <ContractCard contract={contract} />
        </section>

      </main>

      {/* Clean Enterprise Footer with Brand Theme */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500 font-medium mt-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#003087]">
              Agent<span className="text-[#0070BA]">Escrow</span>
            </span>
            <span>•</span>
            <span>Autonomous Multi-Agent Commerce Protocol</span>
          </div>
          <div className="text-slate-500">
            Programmable Milestone Escrow, Self-Healing Cure Loops & Dispute Arbitration
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CustomTaskModal
        isOpen={isCustomTaskOpen}
        onClose={() => setIsCustomTaskOpen(false)}
        onApplyCustomTask={handleApplyCustomTask}
      />

      <DevDocsModal
        isOpen={isDevDocsOpen}
        onClose={() => setIsDevDocsOpen(false)}
      />

      <PolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />

      <ArtifactModal
        isOpen={isArtifactModalOpen}
        onClose={() => setIsArtifactModalOpen(false)}
        contract={contract}
        initialTab={artifactModalTab}
      />
    </div>
  );
}
