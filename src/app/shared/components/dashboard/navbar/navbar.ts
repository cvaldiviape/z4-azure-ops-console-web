import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

// Barra superior: abre o cierra el sidebar, busca un pedido por su id y cierra la sesión.
@Component({
  selector: 'app-navbar',
  imports: [FormsModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly _router = inject(Router);

  readonly openSidebar = input.required<boolean>();
  readonly toggleSidebar = output<void>();
  readonly logout = output<void>();

  protected readonly grafanaUrl = environment.grafanaUrl;
  protected orderId = '';

  searchOrder(): void {
    const orderId = this.orderId.trim();
    if (!/^\d+$/.test(orderId)) {
      return;
    }
    void this._router.navigate(['/admin/saga/detail', orderId]);
    this.orderId = '';
  }
}
