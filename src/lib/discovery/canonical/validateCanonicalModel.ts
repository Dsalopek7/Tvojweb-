import type { DiscoveryCanonicalModel } from '../types';

/**
 * Validates that a model contains all critical information required
 * for the Discovery Engine to function correctly.
 */
export function validateCanonicalModel(model: DiscoveryCanonicalModel): void {
  const { answers } = model;

  if (!answers.industry) {
    throw new Error('Canonical Validation Error: Missing industry');
  }

  if (!answers.visualIdentity.palette) {
    throw new Error('Canonical Validation Error: Missing color palette');
  }

  if (!answers.designDirection.selectedVariant) {
    throw new Error('Canonical Validation Error: Missing selected design variant');
  }

  if (!Array.isArray(answers.features)) {
    throw new Error('Canonical Validation Error: Features must be an array');
  }

  if (!model.id) {
    throw new Error('Canonical Validation Error: Missing session ID');
  }
}
