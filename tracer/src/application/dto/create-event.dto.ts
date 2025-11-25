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

  if (!dto.event || typeof dto.event !== 'string' || dto.event.trim().length === 0) {
    errors.push('Field "event" is required and must be a non-empty string');
  }

  if (dto.event && dto.event.length > 255) {
    errors.push('Field "event" must not exceed 255 characters');
  }

  if (dto.source !== undefined && typeof dto.source !== 'string') {
    errors.push('Field "source" must be a string');
  }

  if (dto.source && dto.source.length > 255) {
    errors.push('Field "source" must not exceed 255 characters');
  }

  if (dto.metadata !== undefined && typeof dto.metadata !== 'object') {
    errors.push('Field "metadata" must be an object');
  }

  if (dto.userId !== undefined && typeof dto.userId !== 'string') {
    errors.push('Field "userId" must be a string');
  }

  if (dto.userId && dto.userId.length > 255) {
    errors.push('Field "userId" must not exceed 255 characters');
  }

  if (dto.timestamp !== undefined && typeof dto.timestamp !== 'string') {
    errors.push('Field "timestamp" must be a string');
  }

  if (dto.timestamp) {
    const date = new Date(dto.timestamp);
    if (isNaN(date.getTime())) {
      errors.push('Field "timestamp" must be a valid ISO 8601 date string');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

