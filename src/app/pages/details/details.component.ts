import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Pokemon } from 'src/app/interfaces/pokemon';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  pokemonDetails: Pokemon | undefined;
  currentScreenSize: string | undefined;
  destroyed = new Subject<void>();

  atributos: any[] = [
    { nome: 'Velocidade', valor: 0 },
    { nome: 'Ataque', valor: 0 },
    { nome: 'Defesa', valor: 0 },
    { nome: 'Vida', valor: 0 },
  ];

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize = query;
          }
        }
      });
  }

  ngOnInit() {
    const pokemonId = this.route.snapshot.params['id'];
    this.getPokemonDetails(pokemonId);
  }

  getPokemonDetails(id: number) {
    this.pokemonService.getPokemonDetails(id).subscribe((response: any) => {
      const filteredStats = response.stats.filter((stat: any) => {
        const statName = stat.stat.name.toLowerCase();
        return (
          statName === 'speed' ||
          statName === 'attack' ||
          statName === 'defense' ||
          statName === 'hp'
        );
      });

      this.pokemonDetails = {
        name: response.name ? response.name : '',
        height: response.height ? response.height : 0,
        weight: response.weight ? response.weight : 0,
        image:
          response.sprites && response.sprites.front_default
            ? response.sprites.front_default
            : '',
        code: response.id ? response.id : 0,
        types: response.types
          ? response.types.map((type: any) => type.type.name)
          : [],
        stats: filteredStats.map((stat: any) => ({
          name: stat.stat.name,
          value: stat.base_stat,
        })),
      };
      this.atributos[0].valor = response.stats[0].base_stat; // Velocidade
      this.atributos[1].valor = response.stats[1].base_stat; // Ataque
      this.atributos[2].valor = response.stats[2].base_stat; // Defesa
      this.atributos[3].valor = response.stats[3].base_stat; // Vida
    });
  }

  getProgressBarColor(index: number): string {
    const colors = ['#C4F789', '#F7802A', '#49D0B0', '#EA686D'];
    return colors[index % colors.length];
  }

  getPokemonPhoto() {
    const pokemonId = this.route.snapshot.params['id'];
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
