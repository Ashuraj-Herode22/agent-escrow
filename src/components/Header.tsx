'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Shield,
  Sparkles,
  Code2,
  ChevronDown,
  MoreHorizontal,
  Check,
} from 'lucide-react';
import { SimulationPreset } from '@/types/escrow';

interface HeaderProps {
  currentPreset: SimulationPreset;
  onSelectPreset: (presetKey: 'SUCCESS_FLOW' | 'HEALING_FLOW' | 'DISPUTE_FLOW') => void;
  isRunning: boolean;
  onStartSimulation: () => void;
  onNextStep: () => void;
  onReset: () => void;
  currentStep: number;
  totalSteps: number;
  isSimulated: boolean;
  onOpenCustomTask?: () => void;
  onOpenSdkDocs?: () => void;
  onOpenPolicyModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPreset,
  onSelectPreset,
  isRunning,
  onStartSimulation,
  onNextStep,
  onReset,
  currentStep,
  totalSteps,
  onOpenCustomTask,
  onOpenSdkDocs,
  onOpenPolicyModal,
}) => {
  const [isScenarioMenuOpen, setIsScenarioMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const scenarioRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (scenarioRef.current && !scenarioRef.current.contains(e.target as Node)) {
        setIsScenarioMenuOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="border-b border-slate-200/90 bg-white sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 h-15 flex items-center justify-between gap-4">
        
        {/* Left: Clean Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-2xs">
            <Shield className="w-4 h-4 fill-white/20 stroke-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">AgentEscrow</span>
        </div>

        {/* Center: Clean, Minimalist Protocol Selector (No Rainbow Colors!) */}
        <div className="relative" ref={scenarioRef}>
          <button
            onClick={() => !isRunning && setIsScenarioMenuOpen(!isScenarioMenuOpen)}
            disabled={isRunning}
            className={`h-9 px-4 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
              isScenarioMenuOpen
                ? 'bg-slate-100 border-slate-300 text-slate-900'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <span className="text-slate-500 font-medium">Flow:</span>
            <span className="font-bold text-slate-900">{currentPreset.name.split('&')[0].trim()}</span>
            <span className="text-slate-500 font-medium">(${currentPreset.budgetUSD.toFixed(0)})</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isScenarioMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu (Clean, Formal, No Raw Math Syntax!) */}
          {isScenarioMenuOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-88 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in duration-150">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                Select Protocol Flow
              </div>

              {/* Option 1 */}
              <button
                onClick={() => {
                  onSelectPreset('SUCCESS_FLOW');
                  setIsScenarioMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  currentPreset.id === 'SUCCESS_FLOW' ? 'bg-slate-100/80 border border-slate-200/80' : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">1. Verified Payout</span>
                    <span className="text-slate-600 font-bold text-xs">($75)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Code passes all tests on first attempt. Payment released immediately.
                  </p>
                </div>
                {currentPreset.id === 'SUCCESS_FLOW' && (
                  <Check className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                )}
              </button>

              {/* Option 2 */}
              <button
                onClick={() => {
                  onSelectPreset('HEALING_FLOW');
                  setIsScenarioMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-3 cursor-pointer mt-1 ${
                  currentPreset.id === 'HEALING_FLOW' ? 'bg-slate-100/80 border border-slate-200/80' : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">2. Self-Healing Patch</span>
                    <span className="text-slate-600 font-bold text-xs">($120)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Security flaw caught on Attempt 1. Worker auto-patches on Attempt 2 and funds release.
                  </p>
                </div>
                {currentPreset.id === 'HEALING_FLOW' && (
                  <Check className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                )}
              </button>

              {/* Option 3 */}
              <button
                onClick={() => {
                  onSelectPreset('DISPUTE_FLOW');
                  setIsScenarioMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-3 cursor-pointer mt-1 ${
                  currentPreset.id === 'DISPUTE_FLOW' ? 'bg-slate-100/80 border border-slate-200/80' : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">3. Quota Exhausted Refund</span>
                    <span className="text-slate-600 font-bold text-xs">($120)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Security policy fails across all 3 attempts. Authorization voided with 100% refund.
                  </p>
                </div>
                {currentPreset.id === 'DISPUTE_FLOW' && (
                  <Check className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right: Clean Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Custom Task Pill */}
          {onOpenCustomTask && (
            <button
              onClick={onOpenCustomTask}
              disabled={isRunning}
              className="h-9 px-3 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-98"
              title="Commission custom autonomous prompt"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-600" />
              <span>+ Custom Task</span>
            </button>
          )}

          {/* More Menu (Governance & SDK) */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              disabled={isRunning}
              className="h-9 w-9 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              title="Governance & SDK Docs"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in duration-150">
                {onOpenPolicyModal && (
                  <button
                    onClick={() => {
                      onOpenPolicyModal();
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-600" />
                    <span>Security & Governance Policy</span>
                  </button>
                )}

                {onOpenSdkDocs && (
                  <button
                    onClick={() => {
                      onOpenSdkDocs();
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Code2 className="w-4 h-4 text-slate-600" />
                    <span>Python & TypeScript SDK</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Execute Contract (Primary CTA in Crisp Black/Slate) */}
          <button
            onClick={onStartSimulation}
            disabled={isRunning || currentStep >= totalSteps}
            className={`h-9 px-4 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              currentStep >= totalSteps
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs active:scale-98'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Executing...' : 'Execute Contract'}</span>
          </button>

          {/* Step Button */}
          <button
            onClick={onNextStep}
            disabled={isRunning || currentStep >= totalSteps}
            className="h-9 px-3 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 flex items-center gap-1.5 transition-all active:scale-98 disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Step forward manually"
          >
            <span>Next</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            disabled={isRunning}
            className="w-9 h-9 rounded-full text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            title="Reset to beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
