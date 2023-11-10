import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
// import { Store } from '@ngrx/store';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { LoanStatementService } from '../../../../features/loan-statements/services/loan-statement.service';
import { AutoAnimateDirective } from '../../../../shared/ui/directives/dom-event-directives/auto-animate.directive';
import { LoanMiniCardComponent } from './loan-mini-card/loan-mini-card.component';

interface LoanCard {
  accountNo: string;
  balance: string;
  loanAmount: string;
  arrears: string;
  status: string;

  backgroundColor?: string;
  backgroundGradient?: string;
  isDummyCard?: boolean;
}

@Component({
  selector: 'app-my-loan-cards',
  templateUrl: './my-loan-cards.component.html',
  styleUrls: ['./my-loan-cards.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, LoanMiniCardComponent, NgStyle, AutoAnimateDirective, CarouselModule],
})
export class MyLoanCardsComponent implements OnInit, AfterViewInit {
  @Input() activeLoans: LoanCard[];
  @ViewChildren('loanMiniCard')
  miniCards: QueryList<ElementRef>;
  currentIndex = 0;

  // private activeLoans$: Observable<ActiveLoan[]>;

  constructor(private rndr: Renderer2, private loanStatement: LoanStatementService) {}

  ngOnInit(): void {}

  private gradients = [
    // yellowish gradient
    'linear-gradient(83deg, rgba(247, 201, 125, 1) 0%, rgba(250, 166, 28, 1) 50%, rgba(247, 201, 125, 1) 100%)',
    // redish gradient
    'linear-gradient(90deg, rgba(242,214,175,1) 0%, rgba(240,42,42,1) 50%, rgba(242,214,175,0.9735760515143558) 100%)',
    // orangeish gradient
    'linear-gradient(90deg, rgba(242,214,175,1) 0%, rgba(140,86,102,1) 53%, rgba(140,86,102,1) 58%, rgba(242,214,175,0.9735760515143558) 100%)',
  ];
  private colors = ['#f7c97d', 'rgb(242,214,175)', 'rgb(242,214,175)'];

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit() {
    this.activeLoans.map((value, index) => {
      value.backgroundColor = this.colors[index % this.colors.length];
      value.backgroundGradient = this.gradients[index % this.gradients.length];
    });

    this.renderMiniCards();
    this.updateLoanStatement();
  }

  nextLoanCard() {
    this.currentIndex = (this.currentIndex + 1) % this.miniCards.length;
    this.renderMiniCards();
    this.updateLoanStatement();
  }

  previousLoanCard() {
    if (this.currentIndex === 0) {
      this.currentIndex = this.miniCards.length;
    }
    this.currentIndex = (this.currentIndex - 1) % this.miniCards.length;

    this.renderMiniCards();
    this.updateLoanStatement();
  }

  renderMiniCards() {
    const miniCardArrays = this.miniCards.toArray();
    const size = miniCardArrays.length;

    for (let i = 0; i < size; i++) {
      const miniCard = miniCardArrays[i].nativeElement;
      this.rndr.removeClass(miniCard, 'show-card');
      this.rndr.removeClass(miniCard, 'prev-card');
      this.rndr.removeClass(miniCard, 'next-card');

      // Highlight the current card
      if (this.currentIndex === i) {
        this.rndr.addClass(miniCard, 'show-card');
      }

      // Highlight the next card
      if ((this.currentIndex + 1) % size === i) {
        this.rndr.addClass(miniCard, 'next-card');
      }

      // Highlight the previous card
      if ((this.currentIndex - 1 + size) % size === i) {
        this.rndr.addClass(miniCard, 'prev-card');
      }

      //Special cases for the first and last cards
      if (this.currentIndex === 0) {
        this.rndr.addClass(miniCardArrays[size - 1].nativeElement, 'prev-card');
      }

      if (this.currentIndex === size - 1) {
        this.rndr.addClass(miniCardArrays[0].nativeElement, 'next-card');
      }
    }
  }

  updateLoanStatement() {
    if (this.currentIndex < this.activeLoans.length)
      this.loanStatement.getLoanStatementOf(this.activeLoans[this.currentIndex].accountNo);
    else {
      this.loanStatement.getLoanStatementOf(undefined);
    }
  }
}
