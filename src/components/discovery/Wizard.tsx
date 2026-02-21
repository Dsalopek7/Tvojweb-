'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { DiscoverySession, WizardStep, DesignVisualIdentity, DesignDirectionState } from '@/lib/discovery/types';
import { TOTAL_STEPS, createEmptySession } from '@/lib/discovery/types';
import { runInference } from '@/lib/discovery/inference';
import { SupabaseAdapter } from '@/lib/discovery/storage/SupabaseAdapter';
import { generateTokens } from '@/lib/discovery/tokens/generateTokens';
import { applyTokensToDOM } from '@/lib/discovery/tokens/applyTokensToDOM';

import IntroStep from './steps/IntroStep';
import IndustryStep from './steps/IndustryStep';
import GoalsStep from './steps/GoalsStep';
import StyleStep from './steps/StyleStep';
import VisualIdentityMultiSelect from './design/VisualIdentityMultiSelect';
import DesignDirectionScreen from './design/DesignDirectionScreen';
import MoodStep from './steps/MoodStep';
import FeaturesStep from './steps/FeaturesStep';
import ReferencesStep from './steps/ReferencesStep';
import ContactStep from './steps/ContactStep';
import FinishStep from './steps/FinishStep';
import UploadAssetsScreen from './upload/UploadAssetsScreen';
import TokenPreviewPanel from './design/TokenPreviewPanel';
import NotesScreen from './NotesScreen';

import '@/styles/discovery.css';

const storage = new SupabaseAdapter();

const SESSION_ID_KEY = 'ds7_discovery_active_session';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return crypto.randomUUID();
  let id = window.localStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

export default function Wizard() {
  const [session, setSession] = useState<DiscoverySession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // ── Load or create session on mount ──────────────────────────────
  useEffect(() => {
    const init = async () => {
      const id = getOrCreateSessionId();
      const existing = await storage.load(id);
      if (existing) {
        setSession(existing);
        // Restore tokens to DOM if they exist
        if (existing.tokens) {
          applyTokensToDOM(existing.tokens);
        }
      } else {
        setSession(createEmptySession(id));
      }
      setIsLoaded(true);
    };
    init();
  }, []);

  // ── Autosave on every session change ─────────────────────────────
  const saveSession = useCallback(async (s: DiscoverySession) => {
    const updated: DiscoverySession = { 
      ...s, 
      session: { 
        ...s.session, 
        updatedAt: new Date().toISOString() 
      } 
    };
    setSession(updated);
    await storage.save(updated);
  }, []);

  // ── Navigation ───────────────────────────────────────────────────
  const goToStep = useCallback(
    (step: WizardStep) => {
      if (!session) return;
      saveSession({
        ...session,
        session: { ...session.session, currentStep: step }
      });
    },
    [session, saveSession]
  );

  const goNext = useCallback(() => {
    if (!session) return;
    const next = Math.min(session.session.currentStep + 1, TOTAL_STEPS - 1) as WizardStep;
    goToStep(next);
  }, [session, goToStep]);

  const goBack = useCallback(() => {
    if (!session) return;
    const prev = Math.max(session.session.currentStep - 1, 0) as WizardStep;
    goToStep(prev);
  }, [session, goToStep]);

  // ── Step handlers ────────────────────────────────────────────────
  const handleIndustry = (industry: string) => {
    if (!session) return;
    saveSession({
      ...session,
      answers: { ...session.answers, industry },
      session: { ...session.session, currentStep: 2 }
    });
  };

  const handleGoals = (goals: string[]) => {
    if (!session) return;
    saveSession({
      ...session,
      answers: { ...session.answers, goals },
      session: { ...session.session, currentStep: 3 }
    });
  };

  const handleStyle = (data: { style: string; visual_identity: { color_palette: string; emotional_tone: string } }) => {
    if (!session) return;
    saveSession({
      ...session,
      answers: { 
        ...session.answers, 
        visualIdentity: {
          ...session.answers.visualIdentity,
          palette: data.visual_identity.color_palette
        },
        // Legacy support
        style: data.style,
        visual_identity: data.visual_identity
      },
      session: { ...session.session, currentStep: 4 }
    });
  };

  const handleDesignIdentity = (identity: DesignVisualIdentity) => {
    if (!session) return;
    saveSession({
      ...session,
      answers: { ...session.answers, visualIdentity: identity },
      session: { ...session.session, currentStep: 5 }
    });
  };

  const handleDesignDirection = (state: DesignDirectionState) => {
    if (!session || !state.selectedVariant) return;
    
    // Derived from canonical generateTokens (ensureCanonicalTokens logic)
    const variantId = state.selectedVariant;
    const chosen = state.variants.find((v) => v.id === variantId);
    
    const tokens = generateTokens({
      paletteId: session.answers.visualIdentity.palette,
      variantId,
      spacing: chosen?.spacing ?? 'balanced',
      contrast: chosen?.contrast ?? 'medium',
    });
    
    applyTokensToDOM(tokens);
    saveSession({
      ...session,
      answers: { 
        ...session.answers, 
        designDirection: { selectedVariant: variantId } 
      },
      tokens,
      session: { ...session.session, currentStep: 6 }
    });
  };

  const handleMood = (mood: string) => {
    if (!session) return;
    saveSession({
      ...session,
      answers: { ...session.answers, mood },
      session: { ...session.session, currentStep: 7 }
    });
  };

  const handleFeatures = (features: string[]) => {
    if (!session) return;
    saveSession({
      ...session,
      answers: { ...session.answers, features },
      session: { ...session.session, currentStep: 8 }
    });
  };

  const handleReferences = (references: string[]) => {
    if (!session) return;
    saveSession({
      ...session,
      answers: { ...session.answers, references },
      session: { ...session.session, currentStep: 9 }
    });
  };

  const handleContact = ({ email, name }: { email: string; name: string }) => {
    if (!session) return;
    saveSession({
      ...session,
      user: { ...session.user, email, name },
      session: { ...session.session, currentStep: 10 }
    });
  };

  const handleNotes = (notes: string) => {
    if (!session) return;
    const updatedAnswers = { ...session.answers, notes: notes || undefined };
    
    // Attach notes to tokens meta if tokens exist
    let updatedTokens = session.tokens;
    if (updatedTokens) {
      updatedTokens = { ...updatedTokens, meta: { notes: notes || undefined } };
    }
    
    const inference = runInference(updatedAnswers);
    const project = {
      industry: updatedAnswers.industry,
      goals: updatedAnswers.goals,
      style: updatedAnswers.visualIdentity.palette, // Using palette as canonical style
      visual_identity: { 
        color_palette: updatedAnswers.visualIdentity.palette, 
        emotional_tone: '' 
      },
      mood: updatedAnswers.mood || '',
      features: updatedAnswers.features,
      references: updatedAnswers.references,
      inferred_complexity: inference.siteComplexity,
      inferred_features: inference.inferredComponents,
      recommended_stack: inference.recommendedStack,
      recommended_architecture: inference.recommendedArchitecture,
      design_variant: inference.designVariant,
      client_notes: notes?.trim() || undefined,
      prd_ready: true,
    };

    saveSession({
      ...session,
      answers: updatedAnswers,
      inference,
      project,
      tokens: updatedTokens,
      session: { ...session.session, completed: true, currentStep: 11 }
    });
  };

  // ── Render ───────────────────────────────────────────────────────
  if (!isLoaded || !session) {
    return (
      <div className="wizard-wrapper">
        <div className="wizard-glass" />
      </div>
    );
  }

  const step = session.session.currentStep;
  const progressPercent = step === 0 ? 0 : Math.round((step / (TOTAL_STEPS - 1)) * 100);

  return (
    <div className="wizard-wrapper">
      <div className="wizard-glass">
        {/* Progress indicator */}
        {step > 0 && step < 11 && (
          <div className="progress-section">
            <div className="progress-text">
              <span>{step} od {TOTAL_STEPS - 1}</span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Active step */}
        <div className="step-wrapper" key={step}>
          {step === 0 && <IntroStep onNext={goNext} />}
          {step === 1 && <IndustryStep value={session.answers.industry} onNext={handleIndustry} onBack={goBack} />}
          {step === 2 && <GoalsStep value={session.answers.goals} onNext={handleGoals} onBack={goBack} />}
          {step === 3 && <StyleStep value={session.answers.style || ''} visualIdentity={session.answers.visual_identity || { color_palette: '', emotional_tone: '' }} onNext={handleStyle} onBack={goBack} />}
          {step === 4 && <VisualIdentityMultiSelect value={session.answers.visualIdentity as any} onNext={handleDesignIdentity} onBack={goBack} />}
          {step === 5 && session.answers.visualIdentity && (
            <DesignDirectionScreen
              visualIdentity={session.answers.visualIdentity as any}
              value={{ 
                selectedVariant: session.answers.designDirection.selectedVariant,
                variants: [] // Variants are defined in types/design but we only store selection
              } as any}
              onNext={handleDesignDirection}
              onBack={goBack}
            />
          )}
          {step === 6 && <MoodStep value={session.answers.mood || ''} onNext={handleMood} onBack={goBack} />}
          {step === 7 && <FeaturesStep value={session.answers.features} onNext={handleFeatures} onBack={goBack} />}
          {step === 8 && <ReferencesStep value={session.answers.references} onNext={handleReferences} onBack={goBack} />}
          {step === 9 && <ContactStep email={session.user.email ?? ''} name={session.user.name ?? ''} onNext={handleContact} onBack={goBack} />}
          {step === 10 && <NotesScreen value={session.answers.notes} onNext={handleNotes} onBack={goBack} />}
          {step === 11 && !showUpload && (
            <>
              <FinishStep
                session={session}
                onUpload={() => setShowUpload(true)}
              />
              {session.tokens && (
                <TokenPreviewPanel tokens={session.tokens} />
              )}
            </>
          )}
          {step === 11 && showUpload && (
            <UploadAssetsScreen
              sessionId={session.id}
              onSkip={() => setShowUpload(false)}
              onContinue={() => setShowUpload(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
