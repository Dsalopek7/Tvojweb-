// ─── DS7 Discovery Engine — Data Contracts ─────────────────────────────

import type { DesignVisualIdentity, DesignDirectionState, DesignVariantId } from './types/design';
import type { Ds7UiTokens } from './tokens/types';

export type { DesignVisualIdentity, DesignDirectionState, DesignVariantId, Ds7UiTokens };

export type WizardStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export const TOTAL_STEPS = 12;

// ─── Session (AIP-007 Canonical) ─────────────────────────────────────────

/**
 * DiscoverySession is now just an alias for DiscoveryCanonicalModel
 * to satisfy the "single source of truth" requirement.
 */
export type DiscoverySession = DiscoveryCanonicalModel;

// ─── Inference ──────────────────────────────────────────────────────────

export type SiteComplexity = 'low' | 'medium' | 'high';

export interface DiscoveryInference {
  requiresDatabase: boolean;
  requiresAuth: boolean;
  requiresAdminPanel: boolean;
  requiresBookingSystem: boolean;
  requiresCms: boolean;
  siteComplexity: SiteComplexity;
  recommendedStack: string;
  recommendedArchitecture: string;
  inferredComponents: string[];
  recommendedDesignTokens: {
    paletteDirection: string;
    toneDirection: string;
    combinedRecommendation: string;
  };
  designVariant?: DesignVariantId;
  uiContrast?: string;
  uiSpacing?: string;
  hasCustomNotes?: boolean;
  customConstraints?: string;
}

// ─── Legacy Helpers (For Mapping) ──────────────────────────────────────

export interface VisualIdentity {
  color_palette: string;
  emotional_tone: string;
}

// ─── Project (PRD-ready output) ─────────────────────────────────────────

export interface DiscoveryProject {
  industry: string;
  goals: string[];
  style: string;
  visual_identity: VisualIdentity;
  mood: string;
  features: string[];
  references: string[];
  inferred_complexity: SiteComplexity;
  inferred_features: string[];
  recommended_stack: string;
  recommended_architecture: string;
  design_variant?: DesignVariantId;
  client_notes?: string;
  prd_ready: boolean;
}

// ─── Canonical Model (AIP-007) ─────────────────────────────────────────

/**
 * The single source of truth for a discovery session.
 * All other models should be normalized into this model.
 */
export type DiscoveryCanonicalModel = {
  id: string;

  session: {
    createdAt: string;
    updatedAt: string;
    completed: boolean;
    currentStep: WizardStep;
  };

  user: {
    name?: string;
    email?: string;
  };

  answers: {
    industry: string;
    goals: string[];
    features: string[];
    references: string[];
    notes?: string;

    visualIdentity: {
      styles: string[];
      moods: string[];
      palette: string;
    };

    designDirection: {
      selectedVariant: DesignVariantId;
    };

    /** @deprecated Use visualIdentity.palette */
    style?: string;
    /** @deprecated Use visualIdentity.palette */
    mood?: string;
    /** @deprecated Migrated to top-level canonical fields */
    visual_identity?: VisualIdentity;
  };

  inference: DiscoveryInference;

  tokens?: Ds7UiTokens;
  project?: DiscoveryProject | null;
};

// ─── Option constants for card UIs ──────────────────────────────────────

export const INDUSTRY_QUICK_OPTIONS = [
  { id: 'salon', label: 'Salon ljepote', emoji: '💇' },
  { id: 'restaurant', label: 'Restoran / Kafić', emoji: '🍽️' },
  { id: 'fitness', label: 'Fitness / Wellness', emoji: '💪' },
  { id: 'coaching', label: 'Coaching / Savjetovanje', emoji: '🎯' },
  { id: 'medical', label: 'Zdravstvo', emoji: '🏥' },
  { id: 'education', label: 'Edukacija', emoji: '📚' },
  { id: 'ecommerce', label: 'Web trgovina', emoji: '🛒' },
  { id: 'creative', label: 'Kreativna agencija', emoji: '🎨' },
] as const;

export const GOAL_OPTIONS = [
  { id: 'presence', label: 'Biti vidljiv online', emoji: '🌐' },
  { id: 'leads', label: 'Privući nove klijente', emoji: '🧲' },
  { id: 'bookings', label: 'Primati online rezervacije', emoji: '📅' },
  { id: 'sell', label: 'Prodavati online', emoji: '💰' },
  { id: 'inform', label: 'Informirati korisnike', emoji: '📋' },
  { id: 'brand', label: 'Izgraditi brand', emoji: '⭐' },
  { id: 'portfolio', label: 'Prikazati radove', emoji: '🖼️' },
  { id: 'community', label: 'Okupiti zajednicu', emoji: '👥' },
] as const;

export const STYLE_OPTIONS = [
  { id: 'minimal', label: 'Minimalistički', emoji: '◻️', desc: 'Čisto, moderno, bez suvišnog' },
  { id: 'bold', label: 'Upečatljiv', emoji: '🔥', desc: 'Hrabar, drugačiji, pamtljiv' },
  { id: 'elegant', label: 'Elegantan', emoji: '✨', desc: 'Sofisticiran, fin, premium' },
  { id: 'playful', label: 'Veseo', emoji: '🎈', desc: 'Živahan, prijateljski, zabavan' },
  { id: 'corporate', label: 'Profesionalan', emoji: '💼', desc: 'Pouzdan, ozbiljan, jasan' },
  { id: 'natural', label: 'Prirodan', emoji: '🌿', desc: 'Topao, organski, zemljani' },
] as const;

export const PALETTE_OPTIONS = [
  { id: 'neutral', label: 'Neutralna', emoji: '⚪', desc: 'Siva, bijela, crna — bezvremenska', colors: ['#f8f9fa','#dee2e6','#495057'] },
  { id: 'warm', label: 'Topla', emoji: '🟠', desc: 'Bež, smeđa, terracotta — udobno', colors: ['#f4e4cd','#d4a574','#8b5e34'] },
  { id: 'cool', label: 'Hladna', emoji: '🔵', desc: 'Plava, teal, siva — profesionalno', colors: ['#dbeafe','#60a5fa','#1e40af'] },
  { id: 'pastel', label: 'Pastelna', emoji: '🌸', desc: 'Mekane, nježne boje — opušteno', colors: ['#fce7f3','#c4b5fd','#a7f3d0'] },
  { id: 'vibrant', label: 'Živopisna', emoji: '🌈', desc: 'Jake, intenzivne boje — energija', colors: ['#f43f5e','#8b5cf6','#06b6d4'] },
  { id: 'earth', label: 'Zemljana', emoji: '🌿', desc: 'Zelena, maslinasta, smeđa — prirodno', colors: ['#d9f99d','#65a30d','#713f12'] },
  { id: 'dark', label: 'Tamna', emoji: '🖤', desc: 'Tamni tonovi, zlato, kontrast — luksuz', colors: ['#1f2937','#374151','#d4a017'] },
  { id: 'mono', label: 'Jednobojno', emoji: '◼️', desc: 'Jedna boja u varijacijama — fokus', colors: ['#ede9fe','#8b5cf6','#5b21b6'] },
] as const;

export const EMOTIONAL_TONE_OPTIONS = [
  { id: 'trust', label: 'Povjerenje', emoji: '🤝', desc: 'Sigurnost i pouzdanost' },
  { id: 'excitement', label: 'Uzbuđenje', emoji: '🎯', desc: 'Akcija i motivacija' },
  { id: 'serenity', label: 'Spokoj', emoji: '🧘', desc: 'Mir i harmonija' },
  { id: 'joy', label: 'Radost', emoji: '😊', desc: 'Sreća i pozitiva' },
  { id: 'sophistication', label: 'Sofisticiranost', emoji: '🥂', desc: 'Elegancija i prestiž' },
  { id: 'authenticity', label: 'Autentičnost', emoji: '🌱', desc: 'Iskrenost i bliskost' },
] as const;

export const MOOD_OPTIONS = [
  { id: 'calm', label: 'Smiren', emoji: '🕊️', desc: 'Mir i ravnoteža' },
  { id: 'energetic', label: 'Energičan', emoji: '⚡', desc: 'Dinamika i pokret' },
  { id: 'luxurious', label: 'Luksuzan', emoji: '💎', desc: 'Premium i ekskluzivno' },
  { id: 'warm', label: 'Topao', emoji: '☀️', desc: 'Pristupačno i blisko' },
  { id: 'tech', label: 'Tehnološki', emoji: '🚀', desc: 'Inovativno i moderno' },
  { id: 'artistic', label: 'Umjetnički', emoji: '🎭', desc: 'Kreativno i inspirativno' },
] as const;

export const FEATURE_OPTIONS = [
  { id: 'booking', label: 'Rezervacije', emoji: '📅', desc: 'Online naručivanje termina' },
  { id: 'blog', label: 'Blog', emoji: '📝', desc: 'Objave i članci' },
  { id: 'gallery', label: 'Galerija', emoji: '🖼️', desc: 'Prikaz slika i radova' },
  { id: 'contact', label: 'Kontakt forma', emoji: '✉️', desc: 'Primaj poruke' },
  { id: 'shop', label: 'Web trgovina', emoji: '🛒', desc: 'Prodaj proizvode online' },
  { id: 'reviews', label: 'Recenzije', emoji: '⭐', desc: 'Iskustva korisnika' },
  { id: 'social', label: 'Društvene mreže', emoji: '📱', desc: 'Povezanost s mrežama' },
  { id: 'map', label: 'Lokacija / Karta', emoji: '📍', desc: 'Prikaži gdje se nalaziš' },
  { id: 'faq', label: 'Česta pitanja', emoji: '❓', desc: 'Odgovori na pitanja' },
  { id: 'newsletter', label: 'Newsletter', emoji: '📨', desc: 'Prikupljanje pretplatnika' },
] as const;

// ─── Default empty session factory ──────────────────────────────────────

export function createEmptySession(id: string): DiscoverySession {
  const now = new Date().toISOString();
  return {
    id,
    session: {
      createdAt: now,
      updatedAt: now,
      completed: false,
      currentStep: 0,
    },
    user: {},
    answers: {
      industry: '',
      goals: [],
      features: [],
      references: [],
      visualIdentity: {
        styles: [],
        moods: [],
        palette: '',
      },
      designDirection: {
        selectedVariant: 'B',
      },
    },
    inference: {
      requiresDatabase: false,
      requiresAuth: false,
      requiresAdminPanel: false,
      requiresBookingSystem: false,
      requiresCms: false,
      siteComplexity: 'low',
      recommendedStack: '',
      recommendedArchitecture: '',
      inferredComponents: [],
      recommendedDesignTokens: {
        paletteDirection: '',
        toneDirection: '',
        combinedRecommendation: '',
      },
    },
    project: null,
  };
}
