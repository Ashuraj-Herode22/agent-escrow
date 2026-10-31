'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from '@/components/Header';
import { ContractCard } from '@/components/ContractCard';
import { PayPalVaultCard } from '@/components/PayPalVaultCard';
import { AgentTerminal } from '@/components/AgentTerminal';
import { CodeInspector } from '@/components/CodeInspector';
import { TaskContract, AgentMessage } from '@/types/escrow';
import { SIMULATION_PRESETS, createInitialContract, getStepDetails } from '@/lib/agent-engine';

export default function Home() {
  const [presetKey, setPresetKey] = useState<'SUCCESS_FLOW' | 'DISPUTE_FLOW'>('SUCCESS_FLOW');
  const [contract, setContract] = useState<TaskContract>(() => createInitialContract('SUCCESS_FLOW').contract);
  const [messages, setMessages] = useState<AgentMessage[]>(() => createInitialContract('SUCCESS_FLOW').messages);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = 6;

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
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
      />

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Contract + PayPal Vault): 4 Cols */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ContractCard contract={contract} />
          <PayPalVaultCard
            contract={contract}
            onSimulateApproveDeposit={handleNextStep}
          />
        </div>

        {/* Center Column (Agent Thought & Terminal Stream): 4 Cols */}
        <div className="lg:col-span-4 flex flex-col">
          <AgentTerminal messages={messages} />
        </div>

        {/* Right Column (Delivered Code + Arbiter Test Suite): 4 Cols */}
        <div className="lg:col-span-4 flex flex-col">
          <CodeInspector contract={contract} />
        </div>

      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-3 text-center text-xs text-slate-500 font-mono">
        <span>AgentEscrow • Built for PayPal AI Hackathon 2026 • Orders v2, Authorizations, Captures & Payouts Engine</span>
      </footer>
    </div>
  );
}
