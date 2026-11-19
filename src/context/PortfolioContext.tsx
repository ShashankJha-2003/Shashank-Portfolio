'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PortfolioData } from '../types/portfolio';
import { initialPortfolioData } from '../data/portfolioData';

export interface GardenOrbModal {
  type: 'quote' | 'project' | 'skills' | 'manor' | 'contact';
  title: string;
  subtitle?: string;
  id?: string;
}

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (newData: PortfolioData) => void;
  resetData: () => void;
  hasEnteredGarden: boolean;
  setHasEnteredGarden: (entered: boolean) => void;
  gardenStage: 'loading' | 'exploring' | 'portfolio';
  setGardenStage: (stage: 'loading' | 'exploring' | 'portfolio') => void;
  activeGardenOrbModal: GardenOrbModal | null;
  setActiveGardenOrbModal: (modal: GardenOrbModal | null) => void;
  isResumeModalOpen: boolean;
  setResumeModalOpen: (open: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  playAudioCue: (type?: 'click' | 'hover' | 'whoosh' | 'signature' | 'pageFlip' | 'marvelFanfare' | 'gardenChime' | 'gardenBreeze') => void;
  backgroundTheme: 'particles' | 'mesh' | 'nebula';
  setBackgroundTheme: (theme: 'particles' | 'mesh' | 'nebula') => void;
  resetToGardenEntrance: () => void;
  isPreloaderFinished: boolean;
  setPreloaderFinished: (finished: boolean) => void;
  replayIntro: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [gardenStage, setGardenStage] = useState<'loading' | 'exploring' | 'portfolio'>('loading');
  const [hasEnteredGarden, setHasEnteredGarden] = useState(false);
  const [activeGardenOrbModal, setActiveGardenOrbModal] = useState<GardenOrbModal | null>(null);
  const [isResumeModalOpen, setResumeModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [backgroundTheme, setBackgroundTheme] = useState<'particles' | 'mesh' | 'nebula'>('particles');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio_user_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.personal?.name === "Shashank Jha") {
          setData({
            ...initialPortfolioData,
            ...parsed,
            personal: {
              ...initialPortfolioData.personal,
              ...parsed.personal,
            },
          });
        } else {
          localStorage.removeItem('portfolio_user_data');
          setData(initialPortfolioData);
        }
      } else {
        setData(initialPortfolioData);
      }
      const savedSound = localStorage.getItem('portfolio_sound');
      if (savedSound === 'true') {
        setSoundEnabled(true);
      }
    } catch {
      setData(initialPortfolioData);
    }
  }, []);

  const updateData = (newData: PortfolioData) => {
    setData(newData);
    try {
      localStorage.setItem('portfolio_user_data', JSON.stringify(newData));
    } catch {
      // Ignore
    }
  };

  const resetData = () => {
    setData(initialPortfolioData);
    try {
      localStorage.removeItem('portfolio_user_data');
    } catch {
      // Ignore
    }
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('portfolio_sound', String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const resetToGardenEntrance = () => {
    setGardenStage('exploring');
    setHasEnteredGarden(false);
    setActiveGardenOrbModal(null);
  };

  const playAudioCue = (type: 'click' | 'hover' | 'whoosh' | 'signature' | 'pageFlip' | 'marvelFanfare' | 'gardenChime' | 'gardenBreeze' = 'click') => {
    if (!soundEnabled || typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'hover') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'whoosh') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'gardenChime') {
        // Enchanting nocturnal garden harp chime arpeggio
        const frequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        frequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + idx * 0.09 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.09 + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.09);
          osc.stop(ctx.currentTime + idx * 0.09 + 1.2);
        });
      } else if (type === 'gardenBreeze') {
        // Soft nocturnal wind / rustling breeze
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(90, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.4);
      } else if (type === 'pageFlip') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else if (type === 'marvelFanfare') {
        const oscBass = ctx.createOscillator();
        const gainBass = ctx.createGain();
        oscBass.type = 'sawtooth';
        oscBass.frequency.setValueAtTime(80, ctx.currentTime);
        oscBass.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 1.2);
        gainBass.gain.setValueAtTime(0.08, ctx.currentTime);
        gainBass.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        oscBass.connect(gainBass);
        gainBass.connect(ctx.destination);
        oscBass.start();
        oscBass.stop(ctx.currentTime + 1.2);
      }
    } catch {
      // AudioContext policy
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateData,
        resetData,
        hasEnteredGarden,
        setHasEnteredGarden,
        gardenStage,
        setGardenStage,
        activeGardenOrbModal,
        setActiveGardenOrbModal,
        isResumeModalOpen,
        setResumeModalOpen,
        activeSection,
        setActiveSection,
        soundEnabled,
        toggleSound,
        playAudioCue,
        backgroundTheme,
        setBackgroundTheme,
        resetToGardenEntrance,
        isPreloaderFinished: hasEnteredGarden,
        setPreloaderFinished: setHasEnteredGarden,
        replayIntro: resetToGardenEntrance
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
