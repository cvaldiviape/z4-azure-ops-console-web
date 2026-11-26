import { OrderStatus, SagaStatus } from '../types/saga-status';

export interface PurchaseSagaSummaryDTO {
  orderId: number;
  correlationId: string;
  orderStatus: OrderStatus;
  sagaStatus: SagaStatus;
  currentStep: string;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string | null;
  timedOutAt: string | null;
}
