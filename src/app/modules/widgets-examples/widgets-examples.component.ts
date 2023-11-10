import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-widgets-examples',
  templateUrl: './widgets-examples.component.html',
  styleUrls: ['./widgets-examples.component.scss'],
  standalone: true,
  imports: [RouterOutlet],
})
export class WidgetsExamplesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
