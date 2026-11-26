import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponseDTO } from '../../../models/response/page-response-dto';
import { PurchaseSagaDetailDTO } from '../../../models/response/purchase-saga-detail-dto';
import { PurchaseSagaSummaryDTO } from '../../../models/response/purchase-saga-summary-dto';
import { ResponseDTO } from '../../../models/response/response-dto';
import { SagaStatus } from '../../../models/types/saga-status';
import { PathRest } from '../static/path-rest';

@Injectable({ providedIn: 'root' })
export class SagaService {
  private readonly _http = inject(HttpClient);

  search(status: SagaStatus | null, page: number, size: number): Observable<ResponseDTO<PageResponseDTO<PurchaseSagaSummaryDTO>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) {
      params = params.set('status', status);
    }
    return this._http.get<ResponseDTO<PageResponseDTO<PurchaseSagaSummaryDTO>>>(PathRest.PURCHASE_SAGAS, { params });
  }

  getByOrderId(orderId: number): Observable<ResponseDTO<PurchaseSagaDetailDTO>> {
    const url = `${PathRest.PURCHASE_SAGAS}/${orderId}`;
    return this._http.get<ResponseDTO<PurchaseSagaDetailDTO>>(url);
  }
}
