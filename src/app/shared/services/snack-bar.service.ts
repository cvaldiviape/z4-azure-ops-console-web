import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SnackBarPosition } from '../../models/types/snack-bar-type';

interface Position {
  horizontalPosition: MatSnackBarHorizontalPosition;
  verticalPosition: MatSnackBarVerticalPosition;
}

const DEFAULT_DURATION = 6000;

@Injectable({ providedIn: 'root' })
export class SnackBarService {
  private readonly _snackBar = inject(MatSnackBar);

  showInfo(message: string, position: SnackBarPosition, duration?: number): void {
    this.showSnackBar(message, position, 'snackbar-info', duration);
  }

  showWarning(message: string, position: SnackBarPosition, duration?: number): void {
    this.showSnackBar(message, position, 'snackbar-warning', duration);
  }

  showError(message: string, position: SnackBarPosition, duration?: number): void {
    this.showSnackBar(message, position, 'snackbar-error', duration);
  }

  private showSnackBar(message: string, position: SnackBarPosition, panelClass: string, duration?: number): void {
    const snackBarPosition = this.getPosition(position);

    this._snackBar.open(message, 'Cerrar', {
      duration: duration ?? DEFAULT_DURATION,
      horizontalPosition: snackBarPosition.horizontalPosition,
      verticalPosition: snackBarPosition.verticalPosition,
      panelClass,
    });
  }

  private getPosition(position: SnackBarPosition): Position {
    const [vertical, horizontal] = position.split(' ') as [MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition];
    return { horizontalPosition: horizontal, verticalPosition: vertical };
  }
}
