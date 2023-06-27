import { Component } from '@angular/core';
import { SupportService } from 'src/app/services/support.service';
import { Support } from 'src/app/models/support';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent {

  FormularioGroup !: FormGroup;
  messageInfo : string = "";

  constructor( private supportService: SupportService, private fb: FormBuilder) {
    this.FormularioGroup = this.fb.group({
      message: ['', [Validators.required]],
      type: ['', [Validators.required]]
    })
  }

  public sendData() {
    this.messageInfo = "";
    const support: Support = {
      type: this.FormularioGroup.get("type")?.value,
      message: this.FormularioGroup.get("message")?.value,
      postDate: new Date(Date.now())
    };
    //validate if the form is valid
    if (this.FormularioGroup.valid) {
      this.supportService.postError(support);
      this.messageInfo = "Mensaje enviado con éxito ! 🤗";
      this.FormularioGroup.reset();
    } else {
      this.messageInfo = "Por favor complete todos los campos 😱";
    }

  }

}
