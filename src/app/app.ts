import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor() {
    // Los íconos de <mat-icon> usan la fuente Material Symbols cargada en index.html.
    inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined');
  }
}
