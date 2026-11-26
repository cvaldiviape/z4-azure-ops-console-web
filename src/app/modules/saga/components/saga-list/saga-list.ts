import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { PurchaseSagaSummaryDTO } from '../../../../models/response/purchase-saga-summary-dto';
import { ORDER_STATUS_TONE, OrderStatus, SAGA_STATUS_TONE, SagaStatus, StatusTone } from '../../../../models/types/saga-status';
import { SagaService } from '../../services/saga.service';

const PAGE_SIZE = 20;

// Lista de Sagas con filtro por estado. El filtro viaja en la URL (?status=...) para que el sidebar pueda enlazarlo.
@Component({
  selector: 'app-saga-list',
  imports: [DatePipe, RouterLink, MatTableModule, MatPaginatorModule, MatSelectModule, MatFormFieldModule, MatProgressBarModule],
  templateUrl: './saga-list.html',
  styleUrl: './saga-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SagaList {
  private readonly _router = inject(Router);
  private readonly _sagaService = inject(SagaService);

  // Llega desde el query param ?status= gracias a withComponentInputBinding().
  readonly status = input<SagaStatus | undefined>();

  protected readonly statuses: SagaStatus[] = ['STARTED', 'IN_PROGRESS', 'COMPENSATING', 'TIMED_OUT', 'COMPLETED', 'FAILED'];
  protected readonly displayedColumns = ['orderId', 'sagaStatus', 'orderStatus', 'currentStep', 'createdAt'];
  protected readonly pageSize = PAGE_SIZE;

  protected readonly sagas = signal<PurchaseSagaSummaryDTO[]>([]);
  protected readonly totalElements = signal(0);
  protected readonly pageIndex = signal(0);
  protected readonly loading = signal(false);
  protected readonly title = computed(() => (this.status() ? `Sagas · ${this.status()}` : 'Sagas'));

  constructor() {
    effect((onCleanup) => {
      const status = this.status() ?? null;
      const pageIndex = this.pageIndex();
      this.loading.set(true);

      const subscription = this._sagaService.search(status, pageIndex, PAGE_SIZE).subscribe({
        next: (response) => {
          this.sagas.set(response.data.content);
          this.totalElements.set(response.data.totalElements);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
      onCleanup(() => subscription.unsubscribe());
    });
  }

  onStatusChange(status: SagaStatus | null): void {
    this.pageIndex.set(0);
    const queryParams = status ? { status } : {};
    void this._router.navigate(['/admin/saga/list'], { queryParams });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
  }

  sagaTone(status: SagaStatus): StatusTone {
    return SAGA_STATUS_TONE[status];
  }

  orderTone(status: OrderStatus): StatusTone {
    return ORDER_STATUS_TONE[status];
  }
}
