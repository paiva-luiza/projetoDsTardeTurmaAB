/**
 * Utilitários para validação e sanitização de dados
 */

const MAX_METADATA_SIZE = 10000; // 10KB em caracteres
const MAX_STRING_FIELD_LENGTH = 255;
const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;

/**
 * Valida se uma string é um timestamp ISO 8601 válido
 */
export function isValidISO8601(timestamp: string): boolean {
  if (!timestamp || typeof timestamp !== 'string') {
    return false;
  }

  // Verifica formato básico
  if (!ISO_8601_REGEX.test(timestamp)) {
    return false;
  }

  // Verifica se é uma data válida
  const date = new Date(timestamp);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(timestamp.substring(0, 19));
}

/**
 * Valida o tamanho do objeto metadata quando serializado em JSON
 */
export function validateMetadataSize(metadata: Record<string, any>): { isValid: boolean; size: number; maxSize: number } {
  try {
    const jsonString = JSON.stringify(metadata);
    const size = jsonString.length;
    return {
      isValid: size <= MAX_METADATA_SIZE,
      size,
      maxSize: MAX_METADATA_SIZE
    };
  } catch (error) {
    return {
      isValid: false,
      size: 0,
      maxSize: MAX_METADATA_SIZE
    };
  }
}

/**
 * Sanitiza uma string removendo caracteres de controle e limitando tamanho
 */
export function sanitizeString(input: string, maxLength: number = MAX_STRING_FIELD_LENGTH): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove caracteres de controle (exceto \n, \r, \t)
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Remove espaços no início e fim
  sanitized = sanitized.trim();
  
  // Limita o tamanho
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Valida se um objeto é um JSON válido e não circular
 */
export function isValidJSONObject(obj: any): boolean {
  if (obj === null || obj === undefined) {
    return true; // null/undefined são válidos
  }

  if (typeof obj !== 'object') {
    return false;
  }

  try {
    // Tenta serializar para verificar se é válido
    JSON.stringify(obj);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Valida profundidade máxima de um objeto (prevenir objetos muito aninhados)
 */
export function validateObjectDepth(obj: any, maxDepth: number = 10, currentDepth: number = 0): boolean {
  if (currentDepth > maxDepth) {
    return false;
  }

  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return true;
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (!validateObjectDepth(obj[key], maxDepth, currentDepth + 1)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Valida se um timestamp está em um range razoável (não muito no passado/futuro)
 */
export function validateTimestampRange(timestamp: string, maxPastDays: number = 365, maxFutureDays: number = 1): boolean {
  const date = new Date(timestamp);
  const now = new Date();
  
  const pastLimit = new Date(now.getTime() - maxPastDays * 24 * 60 * 60 * 1000);
  const futureLimit = new Date(now.getTime() + maxFutureDays * 24 * 60 * 60 * 1000);

  return date >= pastLimit && date <= futureLimit;
}

