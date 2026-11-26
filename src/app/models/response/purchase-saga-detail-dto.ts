import { PurchaseSagaHistoryDTO } from './purchase-saga-history-dto';
import { PurchaseSagaSummaryDTO } from './purchase-saga-summary-dto';

export interface PurchaseSagaDetailDTO {
  saga: PurchaseSagaSummaryDTO;
  timeline: PurchaseSagaHistoryDTO[];
}
