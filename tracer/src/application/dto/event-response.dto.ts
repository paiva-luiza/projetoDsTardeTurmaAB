export interface EventResponseDTO {
  id: number;
  eventType: string;
  source: string | null;
  timestamp: string;
  metadata: Record<string, any> | null;
  userId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface EventListResponseDTO {
  events: EventResponseDTO[];
  total: number;
  limit: number;
  offset: number;
}

