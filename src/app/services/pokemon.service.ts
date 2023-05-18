import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getAllPokemon(offset: number, limit: number): Observable<any[]> {
    const url = `${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`;
    return this.http.get(url).pipe(
      map((response: any) => response.results),
      catchError((error: any) => {
        console.error(error);
        throw new Error('Erro ao obter a lista de Pokémon.');
      })
    );
  }

  getPokemonDetails(id: number): Observable<any> {
    const url = `${this.baseUrl}/pokemon/${id}`;
    return this.http.get(url);
  }

  searchPokemon(query: string): Observable<any[]> {
    const url = `${this.baseUrl}/pokemon?limit=100&name=${query}`;
    return this.http.get(url).pipe(
      map((response: any) => response.results),
      catchError((error: any) => {
        console.error(error);
        throw new Error('Erro ao pesquisar Pokémon.');
      })
    );
  }
}
