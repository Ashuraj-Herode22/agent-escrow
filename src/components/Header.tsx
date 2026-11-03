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
    <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-xs">
      <div className="max-w-[1400px] mx-auto px-6 h-15 flex items-center justify-between gap-4">
        
        {/* Left: Clean Brand with PayPal Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#003087] to-[#001f54] flex items-center justify-center text-white shadow-xs ring-1 ring-[#0070BA]/20">
            <Shield className="w-4 h-4 fill-white/20 stroke-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-base tracking-tight text-[#003087]">
              Agent<span className="text-[#0070BA]">Escrow</span>
            </span>
            <span className="text-[10px] font-bold text-[#0070BA] bg-[#F0F5FA] border border-[#D0E2F2] px-2 py-0.5 rounded-full tracking-wider uppercase flex items-center gap-1 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              REST v2
            </span>
          </div>
        </div>

        {/* Center: Clean Protocol Selector with Tasteful Status Indicator */}
        <div className="relative" ref={scenarioRef}>
          <button
            onClick={() => !isRunning && setIsScenarioMenuOpen(!isScenarioMenuOpen)}
            disabled={isRunning}
            className={`h-9 px-4 rounded-full border text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer shadow-2xs ${
              isScenarioMenuOpen
                ? 'bg-[#F0F5FA] border-[#0070BA]/50 text-[#003087] ring-2 ring-[#0070BA]/15'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
            }`}
          >
            {currentPreset.id === 'SUCCESS_FLOW' ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 shrink-0" />
            ) : currentPreset.id === 'HEALING_FLOW' ? (
              <span className="w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-indigo-100 shrink-0" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-100 shrink-0" />
            )}
            <span className="text-slate-400 font-medium">Flow:</span>
            <span className="font-bold text-slate-900">{currentPreset.name.split('&')[0].trim()}</span>
            <span className="text-[#0070BA] font-bold">(${currentPreset.budgetUSD.toFixed(0)})</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isScenarioMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
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
                  currentPreset.id === 'SUCCESS_FLOW'
                    ? 'bg-emerald-50/70 border border-emerald-200/80 text-emerald-950'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-bold text-slate-900 text-xs">1. Verified Payout</span>
                    <span className="text-emerald-700 font-bold text-xs bg-emerald-100/60 px-1.5 py-0.2 rounded">($75)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-4">
                    Code passes all tests on first attempt. Payment released immediately.
                  </p>
                </div>
                {currentPreset.id === 'SUCCESS_FLOW' && (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
              </button>

              {/* Option 2 */}
              <button
                onClick={() => {
                  onSelectPreset('HEALING_FLOW');
                  setIsScenarioMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-3 cursor-pointer mt-1 ${
                  currentPreset.id === 'HEALING_FLOW'
                    ? 'bg-indigo-50/70 border border-indigo-200/80 text-indigo-950'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <span className="font-bold text-slate-900 text-xs">2. Self-Healing Patch</span>
                    <span className="text-indigo-700 font-bold text-xs bg-indigo-100/60 px-1.5 py-0.2 rounded">($120)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-4">
                    Security flaw caught on Attempt 1. Worker auto-patches on Attempt 2 and funds release.
                  </p>
                </div>
                {currentPreset.id === 'HEALING_FLOW' && (
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                )}
              </button>

              {/* Option 3 */}
              <button
                onClick={() => {
                  onSelectPreset('DISPUTE_FLOW');
                  setIsScenarioMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-3 cursor-pointer mt-1 ${
                  currentPreset.id === 'DISPUTE_FLOW'
                    ? 'bg-rose-50/70 border border-rose-200/80 text-rose-950'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span className="font-bold text-slate-900 text-xs">3. Partial Quota Refund</span>
                    <span className="text-rose-700 font-bold text-xs bg-rose-100/60 px-1.5 py-0.2 rounded">($120)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-4">
                    M1 ($48) verified & captured; M2 ($72) voided & refunded to buyer upon quota exhaustion.
                  </p>
                </div>
                {currentPreset.id === 'DISPUTE_FLOW' && (
                  <Check className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right: Clean Action Controls with PayPal Navy Primary CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Custom Task Pill with subtle Sapphire Accent */}
          {onOpenCustomTask && (
            <button
              onClick={onOpenCustomTask}
              disabled={isRunning}
              className="h-9 px-3.5 rounded-full text-xs font-semibold bg-white hover:bg-[#F0F5FA] text-[#003087] border border-[#D0E2F2] hover:border-[#0070BA]/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-98"
              title="Commission custom autonomous prompt"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0070BA]" />
              <span>+ Custom Task</span>
            </button>
          )}

          {/* More Menu (Governance & SDK) */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              disabled={isRunning}
              className="h-9 w-9 rounded-full bg-white hover:bg-[#F0F5FA] border border-slate-200 text-slate-600 hover:text-[#003087] flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:border-slate-300"
              title="Governance & SDK Docs"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-58 bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in duration-150">
                {onOpenPolicyModal && (
                  <button
                    onClick={() => {
                      onOpenPolicyModal();
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-800 hover:bg-[#F0F5FA] hover:text-[#003087] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#0070BA]" />
                    <span>Security & Governance Policy</span>
                  </button>
                )}

                {onOpenSdkDocs && (
                  <button
                    onClick={() => {
                      onOpenSdkDocs();
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-800 hover:bg-[#F0F5FA] hover:text-[#003087] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Code2 className="w-4 h-4 text-[#0070BA]" />
                    <span>Python & TypeScript SDK</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Execute Contract (Primary CTA in Commanding PayPal Deep Navy with Micro Glow) */}
          <button
            onClick={onStartSimulation}
            disabled={isRunning || currentStep >= totalSteps}
            className={`h-9 px-4 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              currentStep >= totalSteps
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#003087] to-[#002266] hover:from-[#002266] hover:to-[#001744] text-white shadow-[0_2px_12px_rgba(0,48,135,0.25)] hover:shadow-[0_2px_16px_rgba(0,112,186,0.35)] active:scale-98'
            }`}
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Executing...' : 'Execute Contract'}</span>
          </button>

          {/* Step Button */}
          <button
            onClick={onNextStep}
            disabled={isRunning || currentStep >= totalSteps}
            className="h-9 px-3.5 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 hover:text-[#003087] hover:border-[#0070BA]/30 flex items-center gap-1.5 transition-all active:scale-98 disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Step forward manually"
          >
            <span>Next</span>
            <ArrowRight className="w-3 h-3 text-[#0070BA]" />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            disabled={isRunning}
            className="w-9 h-9 rounded-full text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:rotate-180 duration-200"
            title="Reset to beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
