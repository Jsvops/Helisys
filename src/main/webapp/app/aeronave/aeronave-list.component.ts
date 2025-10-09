import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AeronaveService } from 'app/aeronave/aeronave.service';
import { AeronaveDTO } from 'app/aeronave/aeronave.model';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';



@Component({
  selector: 'app-aeronave-list',
  imports: [CommonModule, RouterLink, MatIconModule, MatTooltipModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './aeronave-list.component.html',
  styleUrls: ['./aeronave-list.component.scss'],
  })
export class AeronaveListComponent implements OnInit, OnDestroy {

  aeronaveService = inject(AeronaveService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  aeronaves?: AeronaveDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Seguro que quieres eliminar esta aeronave? No se puede deshacer`,
      deleted: $localize`:@@aeronave.delete.success:La aeronave fue eliminado con éxito ✅`};
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
    this.aeronaveService.getAllAeronavesForList()
        .subscribe({
          next: (data) => this.aeronaves = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  trackById = (_: number, a: AeronaveDTO) => a.anvId ?? _;


  confirmDelete(anvId: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.aeronaveService.deleteAeronave(anvId)
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
            this.router.navigate(['/aeronaves']);
          },
            error: (error) => this.errorHandler.handleServerError(error.error)
          });
    }
  }

}
