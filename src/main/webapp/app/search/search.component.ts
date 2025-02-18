import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from 'app/producto/producto.service';
import { ProductViewDTO } from 'app/producto/product-view.dto';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-search',
  standalone: true, // Marcar como standalone
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'], // Asegúrate de que esta línea esté presente
  imports: [CommonModule, FormsModule] // importar los módulos aquí
})
export class SearchComponent implements OnInit {
  partNumber!: string;
  name!: string;
  alterPartNumber!: string;
  products!: ProductViewDTO[];
  searchPerformed: boolean = false; // Nueva variable para rastrear si se ha realizado una búsqueda

  constructor(
    private productoService: ProductoService,
    public dialogRef: MatDialogRef<SearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  searchProducts(): void {
    this.searchPerformed = true; // Marcar que se ha realizado una búsqueda
    this.productoService.findFilteredProducts(this.partNumber, this.name, this.alterPartNumber)
      .subscribe((data: ProductViewDTO[]) => {
        this.products = data;
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
