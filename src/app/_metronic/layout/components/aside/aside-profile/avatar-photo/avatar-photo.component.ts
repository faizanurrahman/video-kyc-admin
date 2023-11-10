import { Component, Input, OnInit } from '@angular/core';
import { NgStyle, NgIf } from '@angular/common';

@Component({
  selector: 'app-avatar-photo',
  templateUrl: './avatar-photo.component.html',
  styleUrls: ['./avatar-photo.component.scss'],
  standalone: true,
  imports: [NgStyle, NgIf],
})
export class AvatarPhotoComponent implements OnInit {
  @Input() public photoUrl: string;
  @Input() public name: string;

  public showInitials: boolean = false;
  public initials: string;
  public circleColor: string = '';
  // private colors: string[] = ['#31343D', '#320024', '#0A2342', '#4E3022'];
  private colors: string[] = ['#fff'];

  constructor() {}

  ngOnInit(): void {
    if (!this.photoUrl) {
      this.showInitials = true;
      this.initials = this.generateInitials(this.name);
      this.circleColor = this.getRandomColor();
    }
  }

  generateInitials(name: string): string {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  }

  getRandomColor(): string {
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    return color;
  }
}
