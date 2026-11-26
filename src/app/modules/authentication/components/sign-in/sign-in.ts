import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginRequestDTO } from '../../../../models/request/login-request-dto';
import { TokenResponseDTO } from '../../../../models/response/token-response-dto';
import { JwtService } from '../../../../security/services/jwt.service';
import { Roles } from '../../../../security/static/roles';
import { LoadingButton } from '../../../../shared/components/buttons/loading-button/loading-button';
import { AuthService } from '../../services/auth.service';

type SignInAlert = { tone: 'danger' | 'warning' | 'neutral'; icon: string; message: string };

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, LoadingButton],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignIn {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _authService = inject(AuthService);
  private readonly _jwtService = inject(JwtService);
  private readonly _destroyRef = inject(DestroyRef);

  protected readonly hidePassword = signal(true);
  protected readonly loading = signal(false);
  protected readonly alert = signal<SignInAlert | null>(this.initialAlert());
  protected readonly form = this._formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  togglePasswordVisibility(): void {
    this.hidePassword.update((hide) => !hide);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const loginRequestDTO: LoginRequestDTO = this.form.getRawValue();
    this.loading.set(true);
    this.alert.set(null);

    this._authService
      .login(loginRequestDTO)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => this.handleLogin(response.data),
        error: (error: HttpErrorResponse) => this.handleError(error),
      });
  }

  private handleLogin(token: TokenResponseDTO): void {
    this._jwtService.save(token);

    if (!this._jwtService.hasRole(Roles.ADMIN)) {
      this._jwtService.logout();
      this.loading.set(false);
      this.alert.set({ tone: 'warning', icon: 'lock', message: 'Tu usuario no tiene rol ADMIN. Pide acceso a un administrador.' });
      return;
    }

    void this._router.navigateByUrl('/admin');
  }

  private handleError(error: HttpErrorResponse): void {
    this.loading.set(false);

    if (error.status === 401) {
      this.alert.set({ tone: 'danger', icon: 'error', message: 'Email o contraseña incorrectos.' });
    } else if (error.status === 0) {
      this.alert.set({ tone: 'danger', icon: 'cloud_off', message: 'No se pudo conectar con auth-service.' });
    } else {
      this.alert.set({ tone: 'danger', icon: 'error', message: error.error?.message ?? 'No se pudo iniciar sesión.' });
    }
  }

  private initialAlert(): SignInAlert | null {
    const sessionExpired = this._route.snapshot.queryParamMap.get('reason') === 'expired';
    return sessionExpired ? { tone: 'neutral', icon: 'schedule', message: 'Tu sesión expiró. Vuelve a ingresar.' } : null;
  }
}
