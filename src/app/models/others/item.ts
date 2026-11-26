import { SubItem } from './sub-item';

// Ítem del sidebar: con "path" navega directo; con "subMenu" despliega sus opciones.
export interface Item {
  title: string;
  icon: string;
  path?: string;
  subMenu?: SubItem[];
}
