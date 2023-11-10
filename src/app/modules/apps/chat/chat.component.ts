import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [RouterOutlet],
})
export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
