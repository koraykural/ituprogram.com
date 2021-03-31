import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IdService } from '../services/id.service';

@Component({
  selector: 'app-id',
  templateUrl: './id.component.html',
  styleUrls: ['./id.component.css']
})
export class IdComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private idService: IdService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.idService.setProgram(id);
   });
  }

}
