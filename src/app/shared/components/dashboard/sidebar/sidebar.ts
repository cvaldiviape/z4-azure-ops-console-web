import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Item } from '../../../../models/others/item';
import { SizeDisplay } from '../../layouts/admin-layout/size-display';

// Menú lateral: ítems con enlace directo o con submenú desplegable (uno abierto a la vez).
@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  readonly openSidebar = input.required<boolean>();
  readonly sizeDisplay = input.required<SizeDisplay>();
  readonly appName = input.required<string>();
  readonly username = input.required<string>();
  readonly items = input.required<Item[]>();
  readonly navigated = output<void>();

  protected readonly openedTitle = signal<string | null>(null);

  toggleSubMenu(title: string): void {
    const isOpened = this.openedTitle() === title;
    this.openedTitle.set(isOpened ? null : title);
  }

  isSubMenuOpen(title: string): boolean {
    return this.openSidebar() && this.openedTitle() === title;
  }

  isMobile(): boolean {
    return this.sizeDisplay() === 'sm' || this.sizeDisplay() === 'md';
  }
}
