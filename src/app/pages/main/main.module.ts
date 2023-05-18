import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { PokemonService } from 'src/app/services/pokemon.service';
import { HttpClientModule } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { DetailsRoutingModule } from '../details/details-routing.module';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
];

@NgModule({
  declarations: [MainComponent, HeaderComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatProgressBarModule,
    FormsModule,
    MatButtonModule,
    LayoutModule,
    DetailsRoutingModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [PokemonService],
})
export class MainModule {}
