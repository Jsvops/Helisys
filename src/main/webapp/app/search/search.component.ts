import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from 'app/producto/producto.service';
import { ProductViewDTO } from 'app/producto/product-view.dto';


@Component({
  selector: 'app-search',
  standalone: true, // Marcar como standalone
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  imports: [CommonModule, FormsModule] // importar los módulos aquí
})
export class SearchComponent implements OnInit {

  partNumber!: string;
  name!: string;
  alterPartNumber!: string;
  products!: ProductViewDTO[];

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void { }

  searchProducts(): void {
    this.productoService.findFilteredProducts(this.partNumber, this.name, this.alterPartNumber)
      .subscribe((data: ProductViewDTO[]) => {
        this.products = data;
      });
  }
}
