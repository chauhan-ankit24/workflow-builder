export type ConnectionValidation = {
  sourceId: string;
  targetId: string;
  isValid: boolean;
  /**
   * Human-readable error message when isValid === false.
   * Optional so callers can omit it when connection is valid.
   */
  error?: string;
  /**
   * Optional machine-friendly error code (useful for UI i18n or tests).
   * e.g. 'NODE_NOT_FOUND' | 'MULTIPLE_OUTGOING' | 'CYCLE_DETECTED'
   */
  code?: string;
};
