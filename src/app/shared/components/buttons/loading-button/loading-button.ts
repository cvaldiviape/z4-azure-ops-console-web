import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// Botón que muestra un spinner y se bloquea mientras dura una petición.
@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.html',
  styleUrl: './loading-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingButton {
  readonly text = input.required<string>();
  readonly loadingText = input<string>('Cargando…');
  readonly loading = input<boolean>(false);
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input<boolean>(false);
}
