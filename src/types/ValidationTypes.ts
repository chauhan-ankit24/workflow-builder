export type ConnectionValidation = {
  sourceId: string;
  targetId: string;
  isValid: boolean;
  
  error?: string;
  
  code?: string;
};
