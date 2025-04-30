import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from 'app/producto/producto.service';
import { ProductViewDTO } from 'app/producto/product-view.dto';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  imports: [CommonModule, FormsModule]
})
export class SearchComponent implements OnInit {
  partNumber!: string;
  name!: string;
  alterPartNumber!: string;
  products!: ProductViewDTO[];
  groupedProducts: any[] = [];
  searchPerformed: boolean = false;

  constructor(
    private productoService: ProductoService,
    public dialogRef: MatDialogRef<SearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  searchProducts(): void {
    this.searchPerformed = true;
    this.productoService.findFilteredProducts(this.partNumber, this.name, this.alterPartNumber)
      .subscribe((data: ProductViewDTO[]) => {
        this.products = data;
        this.groupProducts();
      });
  }

  groupProducts(): void {
    const groupedMap = new Map<string, ProductViewDTO[]>();

    // Agrupar productos por número de parte
    this.products.forEach(product => {
      const key = product.proNumeroParte; // Usar proNumeroParte en lugar de partNumber
      if (!groupedMap.has(key)) {
        groupedMap.set(key, []);
      }
      groupedMap.get(key)?.push(product);
    });

    // Crear array de productos agrupados
    this.groupedProducts = Array.from(groupedMap.entries()).map(([proNumeroParte, products]) => {
      // Combinar modelos de aeronave
      const modelosAeronave = products
        .map(p => p.modeloAeronave)
        .filter(model => model && model.trim() !== '')
        .join(' / ');

      // Tomar los datos del primer producto
      const firstProduct = products[0];

      return {
        ...firstProduct,
        modeloAeronave: modelosAeronave || 'N/A' // Si no hay modelos, mostrar 'N/A'
      };
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
