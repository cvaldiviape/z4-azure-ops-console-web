import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { PurchaseSagaDetailDTO } from '../../../../models/response/purchase-saga-detail-dto';
import { ORDER_STATUS_TONE, SAGA_STATUS_TONE } from '../../../../models/types/saga-status';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';
import { SagaService } from '../../services/saga.service';
import { SagaTimeline } from '../saga-timeline/saga-timeline';

// Detalle de la Saga de un pedido: estados actuales, duración y su línea de tiempo.
@Component({
  selector: 'app-saga-detail',
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule, MatProgressBarModule, SagaTimeline],
  templateUrl: './saga-detail.html',
  styleUrl: './saga-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SagaDetail {
  private readonly _sagaService = inject(SagaService);
  private readonly _snackBarService = inject(SnackBarService);

  // Llega desde la ruta detail/:orderId gracias a withComponentInputBinding().
  readonly orderId = input.required<string>();

  protected readonly sagaStatusTone = SAGA_STATUS_TONE;
  protected readonly orderStatusTone = ORDER_STATUS_TONE;
  protected readonly detail = signal<PurchaseSagaDetailDTO | null>(null);
  protected readonly loading = signal(false);
  protected readonly notFound = signal(false);
  protected readonly durationInSeconds = computed(() => this.calculateDuration());
  protected readonly grafanaUrl = computed(() => this.buildGrafanaUrl());

  constructor() {
    effect((onCleanup) => {
      const orderId = Number(this.orderId());
      this.loading.set(true);
      this.notFound.set(false);

      const subscription = this._sagaService.getByOrderId(orderId).subscribe({
        next: (response) => {
          this.detail.set(response.data);
          this.loading.set(false);
        },
        error: () => {
          this.detail.set(null);
          this.notFound.set(true);
          this.loading.set(false);
        },
      });
      onCleanup(() => subscription.unsubscribe());
    });
  }

  copyCorrelationId(): void {
    const correlationId = this.detail()?.saga.correlationId;
    if (!correlationId) {
      return;
    }
    void navigator.clipboard.writeText(correlationId);
    this._snackBarService.showInfo('correlationId copiado', 'bottom center', 2000);
  }

  private calculateDuration(): number | null {
    const timeline = this.detail()?.timeline ?? [];
    if (timeline.length < 2) {
      return null;
    }
    const firstStepAt = new Date(timeline[0].createdAt).getTime();
    const lastStepAt = new Date(timeline[timeline.length - 1].createdAt).getTime();
    return (lastStepAt - firstStepAt) / 1000;
  }

  // Abre Grafana Explore con la búsqueda de los logs del pedido en todos los servicios.
  private buildGrafanaUrl(): string {
    const query = `{service_name=~".+"} |= "orderId=${this.orderId()}"`;
    const panes = { logs: { datasource: 'loki', queries: [{ refId: 'A', expr: query }], range: { from: 'now-24h', to: 'now' } } };
    const encodedPanes = encodeURIComponent(JSON.stringify(panes));
    return `${environment.grafanaUrl}/explore?schemaVersion=1&panes=${encodedPanes}`;
  }
}
