import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/models';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  gameRating = 0;
  gameId!: string;
  game!: Game;
  routeSub!: Subscription;
  gameSub!: Subscription;

  constructor(
    // provides API of the route once it's activated
    private ActivatedRoute: ActivatedRoute,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.routeSub = this.ActivatedRoute.params.subscribe((params: Params) => {
      this.gameId = params['id'];
      this.getDetails(this.gameId);
    })
  }

  getDetails(id: string): void {
    this.gameSub = this.httpService
      .getDetails(id)
      .subscribe((gameResp: Game) => {
        this.game = gameResp;
        console.log(this.game)
        setTimeout(() => {
          this.gameRating = this.game.metacritic;
        }, 1000)
      });
  }
  // set the rating color
  getColor(value: number): string {
    return value > 75 ? '#5ee432'
      : value > 50 ? '#fffa50'
        : value > 30 ? '#f7aa38': '#ef4655';
  }

  ngOnDestroy(): void {
    if (this.gameSub) {
      this.gameSub.unsubscribe();
    }

    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}
