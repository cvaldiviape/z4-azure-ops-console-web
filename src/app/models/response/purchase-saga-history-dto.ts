import { OrderStatus, SagaStatus } from '../types/saga-status';

export interface PurchaseSagaHistoryDTO {
  eventType: string;
  eventId: string;
  orderStatus: OrderStatus;
  sagaStatus: SagaStatus;
  errorMessage: string | null;
  createdAt: string;
}
