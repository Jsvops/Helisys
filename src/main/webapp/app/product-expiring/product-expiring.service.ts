import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'environments/environment';
import { ProductExpiringResponseDTO } from 'app/product-expiring/product-expiring-response.model';

@Injectable({ providedIn: 'root' })
export class ProductExpiringService {
  private http = inject(HttpClient);
  private resourcePath = environment.apiPath + '/api/list';

  getExpiring(): Observable<ProductExpiringResponseDTO[]> {
    return this.http
      .get<ProductExpiringResponseDTO[]>(this.resourcePath + '/')
      .pipe(
        map(arr => arr.slice().sort((a, b) => a.fechaVencimiento.localeCompare(b.fechaVencimiento)))
      );
  }
}
