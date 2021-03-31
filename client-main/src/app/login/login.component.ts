import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IdService } from '../services/id.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  continueForm = new FormGroup({
    id: new FormControl('',[Validators.required, Validators.minLength(5), Validators.maxLength(5)]) 
  });
  localId: string;
  idNotFound = false;
  buttonSituation = 0;

  get id() { return this.continueForm.get('id'); }

  constructor(
    private idService: IdService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.localId = localStorage.getItem('id')
    if(this.localId) {
      this.continueForm.setValue({id: this.localId});
    }

    this.idService.idNotFound.subscribe(val => {
      this.idNotFound = val;
      if(val) this.buttonSituation = 0;
    });
  }

  onSubmit() {
    this.buttonSituation = 1;
    this.idService.setProgram(this.id.value);
  }

}
