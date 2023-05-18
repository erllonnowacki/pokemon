import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

export interface GridColumns {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  pokemonList: any[] = [];
  currentPage: number = 1;

  totalPokemonCount: number = 0;
  totalPages: number = 0;

  pageSize: number = 10;

  cols: number | undefined;
  gridByBreakpoint = {
    xl: 5,
    lg: 4,
    md: 3,
    sm: 2,
    xs: 1,
  };

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.getPokemonList(this.currentPage);

    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((result) => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.cols = this.gridByBreakpoint.xs;
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.cols = this.gridByBreakpoint.sm;
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.cols = this.gridByBreakpoint.md;
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.cols = this.gridByBreakpoint.lg;
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.cols = this.gridByBreakpoint.xl;
        }
      });
  }

  getPokemonList(page: number) {
    const offset = (page - 1) * this.pageSize;
    this.pokemonService.getAllPokemon(offset, this.pageSize).subscribe(
      (response: any[]) => {
        this.pokemonList = response;
        this.totalPokemonCount = response.length;
        this.totalPages = this.totalPokemonCount;
        this.currentPage = page;
        this.getPokemonDetails();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getPokemonDetails() {
    for (const pokemon of this.pokemonList) {
      const pokemonId = this.getPokemonIdFromUrl(pokemon.url);
      this.pokemonService.getPokemonDetails(pokemonId).subscribe(
        (response: any) => {
          pokemon.height = response.height;
          pokemon.weight = response.weight / 10;
          pokemon.image = response.sprites.front_default;
          pokemon.code = response.id;
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }

  navigateToDetails(pokemon: any) {
    const pokemonCode = pokemon.code;
    this.router.navigate(['/details', pokemonCode]);
  }

  getPokemonIdFromUrl(url: string): number {
    const segments = url.split('/');
    const id = segments[segments.length - 2];
    return parseInt(id, 10);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getPokemonList(this.currentPage);
    }
  }

  nextPage() {
    console.log(this.currentPage, this.totalPages);

    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getPokemonList(this.currentPage);
    }
  }
}
