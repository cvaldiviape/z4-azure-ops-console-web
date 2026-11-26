import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Item } from '../../../../models/others/item';
import { JwtService } from '../../../../security/services/jwt.service';
import { Navbar } from '../../dashboard/navbar/navbar';
import { Sidebar } from '../../dashboard/sidebar/sidebar';
import { SizeDisplay } from './size-display';

// Estructura de la consola: sidebar + navbar + la página actual. Se adapta al ancho de la pantalla.
@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Sidebar, Navbar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(window:resize)': 'questionSizeDisplay()' },
})
export class AdminLayout implements OnInit {
  private readonly _router = inject(Router);
  private readonly _jwtService = inject(JwtService);

  protected readonly appName = 'Z4 Ops';
  protected readonly username = this._jwtService.getEmail();
  protected readonly openSidebar = signal(false);
  protected readonly sizeDisplay = signal<SizeDisplay>('xl');
  protected readonly items: Item[] = [
    {
      title: 'Sagas',
      icon: 'account_tree',
      subMenu: [
        { subTitle: 'Todas', subIcon: 'list', path: '/admin/saga/list' },
        { subTitle: 'En curso', subIcon: 'sync', path: '/admin/saga/list', queryParams: { status: 'IN_PROGRESS' } },
        { subTitle: 'Compensando', subIcon: 'undo', path: '/admin/saga/list', queryParams: { status: 'COMPENSATING' } },
        { subTitle: 'Con timeout', subIcon: 'timer_off', path: '/admin/saga/list', queryParams: { status: 'TIMED_OUT' } },
      ],
    },
  ];

  ngOnInit(): void {
    this.questionSizeDisplay();
  }

  toggleSidebar(): void {
    this.openSidebar.update((open) => !open);
  }

  closeSidebarOnlyMobile(): void {
    if (this.isMobile()) {
      this.openSidebar.set(false);
    }
  }

  logout(): void {
    this._jwtService.logout();
    void this._router.navigate(['/auth/sign-in']);
  }

  isMobile(): boolean {
    return this.sizeDisplay() === 'sm' || this.sizeDisplay() === 'md';
  }

  questionSizeDisplay(): void {
    const width = window.innerWidth;
    const sizeDisplay = this.resolveSizeDisplay(width);

    this.sizeDisplay.set(sizeDisplay);
    this.openSidebar.set(sizeDisplay === 'xl');
  }

  private resolveSizeDisplay(width: number): SizeDisplay {
    if (width < 480) {
      return 'sm';
    }
    if (width < 768) {
      return 'md';
    }
    if (width < 992) {
      return 'lg';
    }
    return 'xl';
  }
}
