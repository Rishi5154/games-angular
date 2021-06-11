import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Game } from 'src/app/models';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy{
  public sort!: string;
  public games: Array<Game> | undefined;
  private routeSub!: Subscription;
  private gameSub!: Subscription

  constructor(
    private httpService: HttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { 

  }

  ngOnInit(): void {
    // route subscription 
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['game-search']) {
        this.search('metacrit', // the rating
         params['game-search'], // actual filtering - will be called if there's a search query
        );
      } else {
        this.search('metacrit'); // default - filter by rating
      }
    })
  }
  // public api does the filtering
  // route the query to call from public API the filtered endpoint instead
  search(sort: string, search?: string): void {
    // game subscription
    this.gameSub = this.httpService
    .getItemList(sort, search)
    .subscribe((items: APIResponse<Game>) => {
      this.games = items.results;
      console.log(items);
    });
  }

  openDetails(id: string): void {
    this.router.navigate(['details', id])
  }

  ngOnDestroy(): void {
    // close subscriptions & avoid memory leaks
    if (this.gameSub) {
      this.gameSub.unsubscribe();
    }
    if (this.activatedRoute) {
      this.routeSub.unsubscribe();
    }
  }

}
