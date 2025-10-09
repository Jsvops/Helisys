import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { UsuarioService } from 'app/usuario/usuario.service';
import { UsuarioDTO } from 'app/usuario/usuario.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-usuario-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent, MatIconModule, MatTooltipModule, MatButtonModule,  MatSnackBarModule],
  templateUrl: './usuario-edit.component.html'
})
export class UsuarioEditComponent implements OnInit {

  usuarioService = inject(UsuarioService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  snackBar = inject(MatSnackBar);

  usrEdnValues?: Map<number,string>;
  usrGdoValues?: Map<number,string>;
  currentUsrId?: number;

  editForm = new FormGroup({
    usrId: new FormControl({ value: null, disabled: true }),
    usrCtIdentidad: new FormControl(null, [Validators.required]),
    usrCtMilitar: new FormControl(null, [Validators.required]),
    usrNombre: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    usrApellido: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    usrDireccion: new FormControl(null, [Validators.required, Validators.maxLength(225)]),
    usrTelefono: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    usrCargo: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    usrFoto: new FormControl(null, [Validators.required, Validators.maxLength(225)]),
    usrLogin: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    usrPassword: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
    usrEdn: new FormControl(null, [Validators.required]),
    usrGdo: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@usuario.update.success:El usuario se actualizó correctamente ✅`,
      USUARIO_USR_CT_IDENTIDAD_UNIQUE: $localize`:@@Exists.usuario.usrCtIdentidad:This Usr Ct Identidad is already taken.`,
      USUARIO_USR_CT_MILITAR_UNIQUE: $localize`:@@Exists.usuario.usrCtMilitar:This Usr Ct Militar is already taken.`,
      USUARIO_USR_LOGIN_UNIQUE: $localize`:@@Exists.usuario.usrLogin:This Usr Login is already taken.`,
      USUARIO_USR_PASSWORD_UNIQUE: $localize`:@@Exists.usuario.usrPassword:This Usr Password is already taken.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentUsrId = +this.route.snapshot.params['usrId'];
    this.usuarioService.getUsrEdnValues()
        .subscribe({
          next: (data) => this.usrEdnValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.usuarioService.getUsrGdoValues()
        .subscribe({
          next: (data) => this.usrGdoValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.usuarioService.getUsuario(this.currentUsrId!)
        .subscribe({
          next: (data) => updateForm(this.editForm, data),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.editForm.markAllAsTouched();
    if (!this.editForm.valid) {
      return;
    }
    const data = new UsuarioDTO(this.editForm.value);
    this.usuarioService.updateUsuario(this.currentUsrId!, data)
        .subscribe({
          next: () => {
                     this.snackBar.open(this.getMessage('updated'),
                     undefined,
                     {
                       duration: 3000,
                       verticalPosition: 'top',
                       horizontalPosition: 'center',
                        panelClass: ['snackbar-success']
                        });
                      this.router.navigate(['/usuarios']);
                     },
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
