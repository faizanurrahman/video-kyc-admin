import { Component, Input } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';

@Component({
  selector: 'app-aside-menu-item',
  templateUrl: './aside-menu-item.component.html',
  styleUrls: ['./aside-menu-item.component.scss'],
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
})
export class AsideMenuItemComponent {
  @Input() routerLink: string;
}
