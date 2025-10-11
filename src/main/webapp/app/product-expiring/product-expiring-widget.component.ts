import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { ProductExpiringService } from 'app/product-expiring/product-expiring.service';
import { ProductExpiringResponseDTO } from 'app/product-expiring/product-expiring-response.model';

type EstadoSemaforo = 'rojo' | 'amarillo' | 'verde';

@Component({
  selector: 'app-product-expiring-widget',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, NgClass],
  templateUrl: './product-expiring-widget.component.html',
  styleUrls: ['./product-expiring-widget.component.scss']
})
export class ProductExpiringWidgetComponent implements OnInit {
  @Input() limit: number | null = null;

  data: ProductExpiringResponseDTO[] = [];
  loading = false;
  error: string | null = null;

  constructor(private api: ProductExpiringService) {}

 ngOnInit(): void {
   this.loading = true;
   this.api.getExpiring().subscribe({
     next: arr => {
       this.data = (this.limit && this.limit > 0) ? arr.slice(0, this.limit) : arr;
       this.loading = false;
     },
     error: err => { this.error = 'No se pudo cargar vencimientos.'; this.loading = false; console.error(err); }
   });
 }

  dias(dto: ProductExpiringResponseDTO): number {
    const n = Number(dto.diasParaVencer);
    if (!Number.isNaN(n)) return n;


    const hoy = new Date(); hoy.setHours(0,0,0,0);
    const fv  = new Date(dto.fechaVencimiento); fv.setHours(0,0,0,0);
    const ms = fv.getTime() - hoy.getTime();
    return Math.round(ms / 86_400_000);
  }


  estadoTexto(dias: number): 'Por vencer' | 'Vencido' {
    return dias < 0 ? 'Vencido' : 'Por vencer';
  }

  estadoColor(dias: number): EstadoSemaforo {
    if (dias < 0) return 'rojo';
    if (dias <= 365) return 'amarillo';
    return 'verde';
  }
}
