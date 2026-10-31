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
import { TaskContract, AgentMessage } from '@/types/escrow';
import { SIMULATION_PRESETS, createInitialContract, getStepDetails } from '@/lib/agent-engine';

export default function Home() {
  const [presetKey, setPresetKey] = useState<'SUCCESS_FLOW' | 'DISPUTE_FLOW'>('SUCCESS_FLOW');
  const [contract, setContract] = useState<TaskContract>(() => createInitialContract('SUCCESS_FLOW').contract);
  const [messages, setMessages] = useState<AgentMessage[]>(() => createInitialContract('SUCCESS_FLOW').messages);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCustomTaskOpen, setIsCustomTaskOpen] = useState<boolean>(false);
  const [isDevDocsOpen, setIsDevDocsOpen] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = 6;

  // Apply custom task synthesized by AI agents
  const handleApplyCustomTask = (customContract: TaskContract, customMessages: AgentMessage[]) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setContract(customContract);
    setMessages(customMessages);
    setCurrentStep(totalSteps);

    if (customContract.status === 'PAYOUT_COMPLETED') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  // Reset or change preset
  const handleSelectPreset = (key: 'SUCCESS_FLOW' | 'DISPUTE_FLOW') => {
    if (isRunning) return;
    setPresetKey(key);
    const { contract: initContract, messages: initMessages } = createInitialContract(key);
    setContract(initContract);
    setMessages(initMessages);
    setCurrentStep(0);
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    const { contract: initContract, messages: initMessages } = createInitialContract(presetKey);
    setContract(initContract);
    setMessages(initMessages);
    setCurrentStep(0);
  };

  // Perform single step transition
  const executeStep = (stepNumber: number) => {
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
      };

      if (stepNumber === 2) {
        // Order created
        updated.paypalMetadata.orderId = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}-SANDBOX`;
      }
      if (stepNumber === 3) {
        // Auth hold
        updated.paypalMetadata.authorizationId = `AUTH-${Math.random().toString(36).substring(2, 8).toUpperCase()}-ESCROW`;
        updated.paypalMetadata.escrowLockedAt = new Date().toISOString();
      }
      if (stepNumber === 6) {
        if (presetKey === 'SUCCESS_FLOW') {
          updated.paypalMetadata.captureId = `CAP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-RELEASE`;
          updated.paypalMetadata.releasedAt = new Date().toISOString();
          // Trigger victory confetti!
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } else {
          updated.paypalMetadata.captureId = 'VOIDED_AUTHORIZATION';
        }
      }

      return updated;
    });

    setMessages((prev) => [...prev, stepData.message]);
    setCurrentStep(stepNumber);
  };

  // Manual next step
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      executeStep(currentStep + 1);
    }
  };

  // Auto-run simulation
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
    }, 1800);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0C2340] flex flex-col font-sans selection:bg-[#0070BA]/20 selection:text-[#003087]">
      {/* Header */}
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
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 flex flex-col gap-5">
        
        {/* Top: Balanced Horizontal Escrow Protocol Ribbon */}
        <EscrowRibbon
          contract={contract}
          onSimulateApproveDeposit={handleNextStep}
        />

        {/* 3 Symmetrical Equal-Height Columns (580px Each) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Column 1: Contract & Milestones */}
          <ContractCard contract={contract} />

          {/* Column 2: Agent Activity Stream */}
          <AgentTerminal messages={messages} />

          {/* Column 3: Verification Sandbox & Audit */}
          <CodeInspector contract={contract} />
        </div>

      </main>

      {/* Clean Enterprise Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-3.5 text-xs text-slate-500 font-medium mt-auto">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#003087]">AgentEscrow</span>
            <span>•</span>
            <span>Autonomous Multi-Agent Commerce Protocol</span>
          </div>
          <div className="text-slate-400">
            Programmable Milestone Escrow & Dispute Arbitration Engine (REST v2)
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
    </div>
  );
}
