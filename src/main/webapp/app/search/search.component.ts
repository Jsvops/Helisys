import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from 'app/producto/producto.service';
import { ProductViewDTO } from 'app/producto/product-view.dto';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule]
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

    this.products.forEach(product => {
      const key = product.proNumeroParte;
      if (!groupedMap.has(key)) {
        groupedMap.set(key, []);
      }
      groupedMap.get(key)?.push(product);
    });


    this.groupedProducts = Array.from(groupedMap.entries()).map(([proNumeroParte, products]) => {

      const modelosAeronave = products
        .map(p => p.modeloAeronave)
        .filter(model => model && model.trim() !== '')
        .join(' / ');

      const firstProduct = products[0];

      return {
        ...firstProduct,
        modeloAeronave: modelosAeronave || 'N/A'
      };
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
