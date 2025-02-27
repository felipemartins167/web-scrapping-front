import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { UsersService } from '../../../../services/users.service';
import { UserModel } from '../../../../models/user-model';
import { LoadingService } from '../../../../services/loading.service';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ButtonModule, Ripple, FloatLabel, InputTextModule, FormsModule, PaginatorModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  first: number = 1;
  rows: number = 10;
  totalItems: number = 1;

  userList = Array<UserModel>();
  search: string = '';

  constructor(private userService: UsersService, private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.doSearch();
  }

  async doSearch() {
    this.loadingService.show();
    await this.userService.getAll(this.first, this.rows, this.search)
      .subscribe({
        next: (users) => {
          this.loadingService.hide();
          this.userList = users.data;
          this.totalItems = users.totalPage ? users.totalPage : 0;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: ((err) => {
          this.loadingService.hide();
        })
      });
  }
}
