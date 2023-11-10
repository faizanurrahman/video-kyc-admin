import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-wizards',
  templateUrl: './wizards.component.html',
  standalone: true,
  imports: [RouterOutlet],
})
export class WizardsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
