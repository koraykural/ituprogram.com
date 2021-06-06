import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  links = [
    {
      label: 'Hızlı Program Oluştur',
      value: '/quick',
    },
    {
      label: 'Ders Arşivi',
      value: '/archive',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
