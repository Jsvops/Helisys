import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { TransaccionEventoService } from 'app/transaccion-evento/transaccion-evento.service';
import { TransaccionEventoDTO } from 'app/transaccion-evento/transaccion-evento.model';


@Component({
  selector: 'app-transaccion-evento-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './transaccion-evento-list.component.html'})
export class TransaccionEventoListComponent implements OnInit, OnDestroy {

  transaccionEventoService = inject(TransaccionEventoService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  transaccionEventos?: TransaccionEventoDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@transaccionEvento.delete.success:Transaccion Evento was removed successfully.`,
      'transaccionEvento.transaccion.tceTvo.referenced': $localize`:@@transaccionEvento.transaccion.tceTvo.referenced:This entity is still referenced by Transaccion ${details?.id} via field Tce Tvo.`
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
    this.transaccionEventoService.getAllTransaccionEventos()
        .subscribe({
          next: (data) => this.transaccionEventos = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(tvoId: number) {
    if (confirm(this.getMessage('confirm'))) {
      this.transaccionEventoService.deleteTransaccionEvento(tvoId)
          .subscribe({
            next: () => this.router.navigate(['/transaccionEventos'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            }),
            error: (error) => {
              if (error.error?.code === 'REFERENCED') {
                const messageParts = error.error.message.split(',');
                this.router.navigate(['/transaccionEventos'], {
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
