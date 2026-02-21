import type { 
  DiscoveryCanonicalModel, 
  DiscoveryInference, 
  DesignVariantId, 
  SiteComplexity, 
  WizardStep 
} from '../types';

/**
 * Normalizes any discovery session data into the Canonical Model.
 * Handles legacy field mapping and ensures a deterministic structure.
 */
export function normalizeDiscoveryModel(input: Record<string, unknown>): DiscoveryCanonicalModel {
  const rawData = input as Record<string, any>;
  const id = rawData.id || '';
  const createdAt = rawData.session?.createdAt || rawData.createdAt || rawData.created_at || new Date().toISOString();
  const updatedAt = rawData.session?.updatedAt || rawData.updatedAt || rawData.updated_at || new Date().toISOString();
  const completed = rawData.session?.completed === true || rawData.completed === true || rawData.completed === 'true';
  const currentStep = (rawData.session?.currentStep ?? rawData.currentStep ?? 0) as WizardStep;

  const name = rawData.user?.name || rawData.name;
  const email = rawData.user?.email || rawData.email || rawData.data?.email;

  const answers = rawData.answers || {};

  // ─── Extract visual identity ──────────────────────────────────────────
  const legacyVI = answers.visual_identity || {};
  const modernVI = answers.visualIdentity || answers.designVisualIdentity || {};

  const visualIdentity = {
    styles: modernVI.styles || [],
    moods: modernVI.moods || [],
    palette: modernVI.palette || legacyVI.color_palette || '',
  };

  // ─── Extract design direction ─────────────────────────────────────────
  const dd = answers.designDirection || {};
  const selectedVariant: DesignVariantId =
    dd.selectedVariant ||
    rawData.design_variant ||
    answers.design_variant ||
    (rawData.tokens?.variantId as DesignVariantId) ||
    'B';

  // ─── Inference mapping ────────────────────────────────────────────────
  const rawInf = rawData.inference || {};
  const inference: DiscoveryInference = {
    siteComplexity: (rawInf.siteComplexity || rawInf.site_complexity || 'medium') as SiteComplexity,
    requiresDatabase: rawInf.requiresDatabase ?? rawInf.requires_database ?? false,
    requiresAuth: rawInf.requiresAuth ?? rawInf.requires_auth ?? false,
    requiresAdminPanel: rawInf.requiresAdminPanel ?? rawInf.requires_admin_panel ?? false,
    requiresBookingSystem: rawInf.requiresBookingSystem ?? rawInf.requires_booking_system ?? false,
    requiresCms: rawInf.requiresCms ?? rawInf.requires_cms ?? false,
    recommendedStack: rawInf.recommendedStack || rawInf.recommended_stack || '',
    recommendedArchitecture: rawInf.recommendedArchitecture || rawInf.recommended_architecture || '',
    inferredComponents: rawInf.inferredComponents || rawInf.inferred_components || [],
    recommendedDesignTokens: rawInf.recommendedDesignTokens || rawInf.recommended_design_tokens || {
      paletteDirection: '',
      toneDirection: '',
      combinedRecommendation: '',
    },
    designVariant: selectedVariant,
    uiContrast: rawInf.uiContrast || (selectedVariant === 'A' ? 'low' : selectedVariant === 'B' ? 'medium' : 'high'),
    uiSpacing: rawInf.uiSpacing || (selectedVariant === 'A' ? 'compact' : selectedVariant === 'B' ? 'balanced' : 'spacious'),
  };

  return {
    id,
    session: {
      createdAt,
      updatedAt,
      completed,
      currentStep,
    },
    user: {
      name,
      email,
    },
    answers: {
      industry: answers.industry || '',
      goals: answers.goals || [],
      features: answers.features || [],
      references: answers.references || [],
      notes: answers.notes || rawData.notes,
      visualIdentity,
      designDirection: {
        selectedVariant,
      },
      // Keep legacy fields as deprecated in the object if they were there
      style: answers.style,
      mood: answers.mood,
      visual_identity: answers.visual_identity,
    },
    inference,
    tokens: rawData.tokens,
    project: rawData.project,
  };
}
