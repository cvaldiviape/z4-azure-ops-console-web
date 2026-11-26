import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PurchaseSagaHistoryDTO } from '../../../../models/response/purchase-saga-history-dto';
import { SAGA_STATUS_TONE } from '../../../../models/types/saga-status';

// Línea de tiempo de la Saga: un punto por cada cambio de estado (purchase_saga_histories).
@Component({
  selector: 'app-saga-timeline',
  imports: [DatePipe, MatIconModule],
  templateUrl: './saga-timeline.html',
  styleUrl: './saga-timeline.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SagaTimeline {
  readonly timeline = input.required<PurchaseSagaHistoryDTO[]>();

  protected readonly sagaStatusTone = SAGA_STATUS_TONE;
}
