export type SagaStatus = 'STARTED' | 'IN_PROGRESS' | 'COMPENSATING' | 'TIMED_OUT' | 'COMPLETED' | 'FAILED';

export type OrderStatus = 'CREATED' | 'STOCK_RESERVED' | 'PAYMENT_PENDING' | 'CONFIRMED' | 'CANCELLED';

// Color de la etiqueta (clase status--*) según el estado.
export type StatusTone = 'success' | 'info' | 'warning' | 'danger' | 'neutral';

export const SAGA_STATUS_TONE: Record<SagaStatus, StatusTone> = {
  STARTED: 'neutral',
  IN_PROGRESS: 'info',
  COMPENSATING: 'warning',
  TIMED_OUT: 'danger',
  COMPLETED: 'success',
  FAILED: 'danger',
};

export const ORDER_STATUS_TONE: Record<OrderStatus, StatusTone> = {
  CREATED: 'neutral',
  STOCK_RESERVED: 'info',
  PAYMENT_PENDING: 'info',
  CONFIRMED: 'success',
  CANCELLED: 'danger',
};
