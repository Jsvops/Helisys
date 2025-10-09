import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ModeloAeronaveService } from 'app/modelo-aeronave/modelo-aeronave.service';
import { ModeloAeronaveDTO } from 'app/modelo-aeronave/modelo-aeronave.model';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-modelo-aeronave-list',
  imports: [CommonModule, RouterLink, MatIconModule, MatTooltipModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './modelo-aeronave-list.component.html',
  styleUrls: ['./modelo-aeronave-list.component.scss'],
  })
export class ModeloAeronaveListComponent implements OnInit, OnDestroy {

  modeloAeronaveService = inject(ModeloAeronaveService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  modeloAeronaves?: ModeloAeronaveDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Seguro que quieres eliminar este modelo de aeronave? No se puede deshacer`,
      deleted: $localize`:@@modeloAeronave.delete.success:El modelo de aeronave fue eliminado con éxito ✅`,
      'modeloAeronave.aeronave.anvMre.referenced': $localize`:@@modeloAeronave.aeronave.anvMre.referenced:This entity is still referenced by Aeronave ${details?.id} via field Anv Mre.`,
      'modeloAeronave.producto.proMre.referenced': $localize`:@@modeloAeronave.producto.proMre.referenced:This entity is still referenced by Producto ${details?.id} via field Pro Mre.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.loadData();
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    this.navigationSubscription!.unsubscribe();
  }

  loadData() {
    this.modeloAeronaveService.getAllModeloAeronaves()
        .subscribe({
          next: (data) => this.modeloAeronaves = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(mreId: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.modeloAeronaveService.deleteModeloAeronave(mreId)
          .subscribe({
            next: () => {
                  this.snackBar.open(this.getMessage('deleted'),
                  undefined,
                  {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'center',
                    panelClass: ['snackbar-success']
                  });
                  this.router.navigate(['/modeloAeronaves']);
                },

            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/modeloAeronaves'], {
                  state: {
                    msgError: this.getMessage(messageParts[0], { id: messageParts[1] })
                  }
                });
                return;
              }
              this.errorHandler.handleServerError(error.error)
            }
          });
    }
  }

}
