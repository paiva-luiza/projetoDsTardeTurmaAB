import { 
  isValidISO8601, 
  validateMetadataSize, 
  isValidJSONObject, 
  validateObjectDepth,
  validateTimestampRange 
} from '../../infra/utils/validation.utils';

export interface CreateEventDTO {
  event: string; // event_type
  source?: string;
  metadata?: Record<string, any>;
  userId?: string;
  timestamp?: string;
}

export function validateCreateEventDTO(dto: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!dto) {
    errors.push('Request body is required');
    return { isValid: false, errors };
  }

  // Validação do campo 'event'
  if (!dto.event || typeof dto.event !== 'string' || dto.event.trim().length === 0) {
    errors.push('Field "event" is required and must be a non-empty string');
  }

  if (dto.event && dto.event.length > 255) {
    errors.push('Field "event" must not exceed 255 characters');
  }

  // Validação do campo 'source'
  if (dto.source !== undefined) {
    if (typeof dto.source !== 'string') {
      errors.push('Field "source" must be a string');
    } else if (dto.source.length > 255) {
      errors.push('Field "source" must not exceed 255 characters');
    } else if (dto.source.trim().length === 0) {
      errors.push('Field "source" cannot be an empty string');
    }
  }

  // Validação avançada do campo 'metadata'
  if (dto.metadata !== undefined) {
    if (dto.metadata === null) {
      // null é permitido
    } else if (typeof dto.metadata !== 'object' || Array.isArray(dto.metadata)) {
      errors.push('Field "metadata" must be an object (not an array)');
    } else {
      // Valida se é um JSON válido
      if (!isValidJSONObject(dto.metadata)) {
        errors.push('Field "metadata" must be a valid JSON object');
      }

      // Valida profundidade do objeto
      if (!validateObjectDepth(dto.metadata, 10)) {
        errors.push('Field "metadata" exceeds maximum nesting depth (10 levels)');
      }

      // Valida tamanho do metadata
      const sizeValidation = validateMetadataSize(dto.metadata);
      if (!sizeValidation.isValid) {
        errors.push(`Field "metadata" exceeds maximum size (${sizeValidation.size}/${sizeValidation.maxSize} characters)`);
      }
    }
  }

  // Validação do campo 'userId'
  if (dto.userId !== undefined) {
    if (typeof dto.userId !== 'string') {
      errors.push('Field "userId" must be a string');
    } else if (dto.userId.length > 255) {
      errors.push('Field "userId" must not exceed 255 characters');
    } else if (dto.userId.trim().length === 0) {
      errors.push('Field "userId" cannot be an empty string');
    }
  }

  // Validação avançada do campo 'timestamp'
  if (dto.timestamp !== undefined) {
    if (typeof dto.timestamp !== 'string') {
      errors.push('Field "timestamp" must be a string');
    } else if (!isValidISO8601(dto.timestamp)) {
      errors.push('Field "timestamp" must be a valid ISO 8601 date string (e.g., 2024-01-15T10:30:00Z)');
    } else {
      // Valida se o timestamp está em um range razoável
      if (!validateTimestampRange(dto.timestamp, 365, 1)) {
        errors.push('Field "timestamp" is outside acceptable range (max 365 days in the past, 1 day in the future)');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

