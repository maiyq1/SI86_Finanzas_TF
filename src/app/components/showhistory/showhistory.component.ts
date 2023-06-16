import { Component,EventEmitter,Input, Output} from '@angular/core';
import { Run } from 'src/app/models/run';
import { RunService } from 'src/app/services/run.service';

@Component({
  selector: 'app-showhistory',
  templateUrl: './showhistory.component.html',
  styleUrls: ['./showhistory.component.css']
})
export class ShowhistoryComponent {
  @Input() show!:boolean;
  @Output() cambio=new EventEmitter<number>()
  typeMoney!:string;
  priceProperty!:number;
  firstFee!:number;
  amountFinance!:number;
  nameRate!:string;
  rate!:number;
  nameConvertRate!:string;
  nueva_tasa!:number;
  frecuencyPay!:string;
  num_periodos!:number;
  numberYear!:number;
  //corrida
  saldo_iniciales:number[]=[];
  tasa:number=0;
  cuota:number=0;
  intereses:number[]=[];
  amortizaciones:number[]=[];
  plazo_gracia=""
  simbolo=""
  supuesto:number[]=[];
  saldosfinales:number[]=[];
  interesfinales:number[]=[];
  amortizacionfinales:number[]=[];
  supuestofinal:number[]=[];
  nuevacuota!:number;
  gracePeriod!:string;
  numbergracePeriod!:number;
  cok!:number;
  van!:number;
  tir!:number;
  date!:Date;
  data!:Run;
  plazo_gracia1=0;
  plazo_gracia2=0;
  plazo_gracia3=0;
  plazos="";
  plazo="";
  nuevacuota2=0;
  supuestofinalultimo:number[]=[];
  saldosfinalesultimo:number[]=[];
  interesfinalesultimo:number[]=[];
  amortizacionfinalesultimo:number[]=[];
  periodos_completos:number[]=[];
  iniciarCorrida=false;
  supuestofinalalterno:number[]=[];
  saldosfinalesalterno:number[]=[];
  interesfinalesalterno:number[]=[];
  amortizacionfinalesalterno:number[]=[];
  nuevacuota3=0;
  corrida_dos=false;
  corrida_tres=false;
  corrida_uno=false;
  constructor(private runService:RunService){
    this.runService.getRun(localStorage.getItem("idRun")?.toString()!).then(
      (data:any)=>{
        this.data=data;
        console.log(this.data);
        this.typeMoney=data.typeMoney;
        this.priceProperty=data.priceProperty;
        this.firstFee=data.firstFee;
        this.amountFinance=data.amountFinance;
        this.rate=data.rate;
        this.nameRate=data.nameRate+data.timeRate;
        this.nueva_tasa=data.convertRate;
        this.nameConvertRate=data.nameConvertRate;
        this.frecuencyPay=data.frequencyPay;
        this.num_periodos=data.numberPeriods;
        this.numberYear=data.numberYear;
        this.plazo=data.gracePeriod;
        this.plazo_gracia1=data.numberGracePeriod1;
        this.plazo_gracia2=data.numberGracePeriod2;
        this.plazo_gracia3=data.numberGracePeriod3;
        if(this.plazo_gracia1==0 && this.plazo_gracia2==0 && this.plazo_gracia3==0){
          this.plazos="Ninguno"
          this.corrida_uno=true;
          this.corrida()
        } 
        else if(this.plazo_gracia1!=0 && this.plazo_gracia2==0 && this.plazo_gracia3==0){
          this.plazos=this.plazo_gracia1.toString();
          this.corrida_uno=true;
          this.corrida()
        }
        else if(this.plazo_gracia1!=0 && this.plazo_gracia2!=0 && this.plazo_gracia3==0){
          this.plazos=this.plazo_gracia1+" ; "+this.plazo_gracia2 ;
          this.corrida_dos=true;
          this.corrida2()
        }
        else if(this.plazo_gracia1!=0 && this.plazo_gracia2!=0 && this.plazo_gracia3!=0){
          this.plazos=this.plazo_gracia1+" ; "+this.plazo_gracia2+" ; "+this.plazo_gracia3 ;
          this.corrida_dos=true;
          this.corrida_tres=true;
          this.corrida2()
        }
        this.van=data.van;
        this.tir=data.tir;
        this.cok=data.cok;
        this.date=data.dateSave!;
      }
    )
    
  }
  regresarAtras(){
    this.cambio.emit(1)
  }
  
 
  corrida(){
    if(this.plazo=="Ninguno"){
      this.plazo_gracia1=this.num_periodos + 1;
    }
    if(this.typeMoney=='Dólares'){
      this.simbolo='US$'
    }
    else if(this.typeMoney=='Soles'){
      this.simbolo='S/'
    }
   
    this.supuesto=Array(this.plazo_gracia1).fill(0)
    this.periodos_completos=Array(this.plazo_gracia1).fill(0)
    this.iniciarCorrida=true;
    this.tasa=this.nueva_tasa/100;
    this.cuota=Number((this.amountFinance*((this.tasa*(Math.pow(1+this.tasa,this.num_periodos)))/((Math.pow(1+this.tasa,this.num_periodos))-1))))
    this.saldo_iniciales.push(Number(this.amountFinance));
    let i:number;
    
    for(i=0;i<this.plazo_gracia1 - 1;i++){
     let interes=Number((this.saldo_iniciales[i]*this.tasa));
     let amortizaciones=Number((this.cuota-interes));
     this.intereses.push(interes);
     this.amortizaciones.push(amortizaciones);
     let saldo_final=Number((this.saldo_iniciales[i]-amortizaciones));
     this.saldo_iniciales.push(saldo_final);
    }
    if(this.plazo=="Total"){
    this.intereses[this.plazo_gracia1-1]=this.saldo_iniciales[this.plazo_gracia1-1]*this.tasa;
    this.amortizaciones[this.plazo_gracia1 - 1]= 0;
    this.saldo_iniciales[this.plazo_gracia1]= this.saldo_iniciales[this.plazo_gracia1 - 1] + this.intereses[this.plazo_gracia1 - 1]
    this.corridaContinua()
    }
    else if(this.plazo=="Parcial"){
      this.intereses[this.plazo_gracia1-1]=this.saldo_iniciales[this.plazo_gracia1-1]*this.tasa;
      this.amortizaciones[this.plazo_gracia1 - 1]= 0;
      this.saldo_iniciales[this.plazo_gracia1]= this.saldo_iniciales[this.plazo_gracia1 - 1];
      this.corridaContinua()
    }
  }
  corrida2(){
    if(this.typeMoney=='Dólares'){
      this.simbolo='US$'
    }
    else if(this.typeMoney=='Soles'){
      this.simbolo='S/'
    }
    this.supuesto=Array(this.plazo_gracia1).fill(0)
    this.periodos_completos=Array(this.num_periodos).fill(0)
    this.iniciarCorrida=true;
    this.tasa=this.nueva_tasa/100;
    this.cuota=Number((this.amountFinance*((this.tasa*(Math.pow(1+this.tasa,this.num_periodos)))/((Math.pow(1+this.tasa,this.num_periodos))-1))))
    this.saldo_iniciales.push(Number(this.amountFinance));
   
    let i:number;
    
    for(i=0;i<this.plazo_gracia1 - 1;i++){
     let interes=Number((this.saldo_iniciales[i]*this.tasa));
     let amortizaciones=Number((this.cuota-interes));
     this.intereses.push(interes);
     this.amortizaciones.push(amortizaciones);
     let saldo_final=Number((this.saldo_iniciales[i]-amortizaciones));
     this.saldo_iniciales.push(saldo_final);
    }
    if(this.plazo=="Total"){
    this.intereses[this.plazo_gracia1-1]=this.saldo_iniciales[this.plazo_gracia1-1]*this.tasa;
    this.amortizaciones[this.plazo_gracia1 - 1]= 0;
    this.saldo_iniciales[this.plazo_gracia1]= this.saldo_iniciales[this.plazo_gracia1 - 1] + this.intereses[this.plazo_gracia1 - 1]
    this.segundaCorrida2()
    }
    else if(this.plazo=="Parcial"){
      this.intereses[this.plazo_gracia1-1]=this.saldo_iniciales[this.plazo_gracia1-1]*this.tasa;
      this.amortizaciones[this.plazo_gracia1 - 1]= 0;
      this.saldo_iniciales[this.plazo_gracia1]= this.saldo_iniciales[this.plazo_gracia1 - 1];
      this.segundaCorrida2()
    }
  }
  corridaContinua(){
    this.supuestofinal=Array(this.num_periodos-this.plazo_gracia1).fill(0)
    this.saldosfinales.push(this.saldo_iniciales[this.plazo_gracia1]);
    let tasa=Number(this.nueva_tasa)/100;
    this.nuevacuota=Number((this.saldosfinales[0]*((tasa*(Math.pow(1+tasa,this.num_periodos-this.plazo_gracia1)))/((Math.pow(1+tasa,this.num_periodos-this.plazo_gracia1))-1))));
    let i:number;
    for(i=0;i<this.num_periodos-this.plazo_gracia1;i++){
      let interes=Number((this.saldosfinales[i]*tasa));
      let amortizaciones=Number((this.nuevacuota-interes));
      this.interesfinales.push(interes);
      this.amortizacionfinales.push(amortizaciones);
      let saldo_final=Number((this.saldosfinales[i]-amortizaciones));
      this.saldosfinales.push(saldo_final);
    }
  }
  segundaCorrida2(){
      this.supuestofinal=Array(this.plazo_gracia2-this.plazo_gracia1).fill(0)
      this.saldosfinales.push(this.saldo_iniciales[this.plazo_gracia1]);
      let tasa=Number(this.nueva_tasa)/100;
      this.nuevacuota=Number((this.saldosfinales[0]*((tasa*(Math.pow(1+tasa,this.num_periodos-this.plazo_gracia1)))/((Math.pow(1+tasa,this.num_periodos-this.plazo_gracia1))-1))));
      let i:number;
      for(i=0;i<this.plazo_gracia2-this.plazo_gracia1;i++){
        let interes=Number((this.saldosfinales[i]*tasa));
        let amortizaciones=Number((this.nuevacuota-interes));
        this.interesfinales.push(interes);
        this.amortizacionfinales.push(amortizaciones);
        let saldo_final=Number((this.saldosfinales[i]-amortizaciones));
        this.saldosfinales.push(saldo_final);
      }
      
      if(this.plazo=="Total"){
        this.interesfinales[this.plazo_gracia2-this.plazo_gracia1-1]=this.saldosfinales[this.plazo_gracia2-this.plazo_gracia1-1]*tasa;
        this.amortizacionfinales[this.plazo_gracia2-this.plazo_gracia1-1]= 0;
        this.saldosfinales[this.plazo_gracia2-this.plazo_gracia1]= this.saldosfinales[this.plazo_gracia2-this.plazo_gracia1-1] + this.interesfinales[this.plazo_gracia2-this.plazo_gracia1-1]
      }
      else if(this.plazo=="Parcial"){
        this.interesfinales[this.plazo_gracia2-this.plazo_gracia1-1]=this.saldosfinales[this.plazo_gracia2-this.plazo_gracia1-1]*tasa;
        this.amortizacionfinales[this.plazo_gracia2-this.plazo_gracia1-1]= 0;
        this.saldosfinales[this.plazo_gracia2-this.plazo_gracia1]= this.saldosfinales[this.plazo_gracia2-this.plazo_gracia1 - 1];
      }
      if(this.corrida_tres){
        this.corridaAlterna3();
      }
      else{
        this.finalCorrida2()
      }
     
   
  }
  corridaAlterna3(){
    console.log("Entre aqui")
    this.supuestofinalalterno=Array(this.plazo_gracia3-this.plazo_gracia2).fill(0)
    this.saldosfinalesalterno.push(this.saldosfinales[this.plazo_gracia2-this.plazo_gracia1]);
    console.log(this.saldosfinalesalterno)
    let tasa=Number(this.nueva_tasa)/100;
    this.nuevacuota3=Number((this.saldosfinalesalterno[0]*((tasa*(Math.pow(1+tasa,this.num_periodos-this.plazo_gracia2)))/((Math.pow(1+tasa,this.num_periodos-this.plazo_gracia2))-1))));
    
    let i:number;
    for(i=0;i<this.plazo_gracia3-this.plazo_gracia2;i++){
      let interes=Number((this.saldosfinalesalterno[i]*tasa));
      let amortizaciones=Number((this.nuevacuota3-interes));
      this.interesfinalesalterno.push(interes);
      this.amortizacionfinalesalterno.push(amortizaciones);
      let saldo_final=Number((this.saldosfinalesalterno[i]-amortizaciones));
      this.saldosfinalesalterno.push(saldo_final);
    }

    if(this.plazo=="Total"){
      this.interesfinalesalterno[this.plazo_gracia3-this.plazo_gracia2-1]=this.saldosfinalesalterno[this.plazo_gracia3-this.plazo_gracia2-1]*tasa;
      this.amortizacionfinalesalterno[this.plazo_gracia3-this.plazo_gracia2-1]= 0;
      this.saldosfinalesalterno[this.plazo_gracia3-this.plazo_gracia2]= this.saldosfinalesalterno[this.plazo_gracia3-this.plazo_gracia2-1] + this.interesfinalesalterno[this.plazo_gracia3-this.plazo_gracia2-1]
    }
    else if(this.plazo=="Parcial"){
      this.interesfinalesalterno[this.plazo_gracia3-this.plazo_gracia2-1]=this.saldosfinalesalterno[this.plazo_gracia3-this.plazo_gracia2-1]*tasa;
      this.amortizacionfinalesalterno[this.plazo_gracia3-this.plazo_gracia2-1]= 0;
      this.saldosfinalesalterno[this.plazo_gracia3-this.plazo_gracia2]= this.saldosfinalesalterno[this.plazo_gracia3-this.plazo_gracia2 - 1];
    }
    
    this.finalCorrida2();
  }
  finalCorrida2(){
    if(this.corrida_tres){
      this.supuestofinalultimo=Array(this.num_periodos-this.plazo_gracia3).fill(0)
      this.saldosfinalesultimo.push(this.saldosfinalesalterno[this.plazo_gracia3-this.plazo_gracia2]);
      let tasa=Number(this.nueva_tasa)/100;
      this.nuevacuota2=Number((this.saldosfinalesultimo[0]*((tasa*(Math.pow(1+tasa,this.num_periodos-this.plazo_gracia3)))/((Math.pow(1+tasa,this.num_periodos-this.plazo_gracia3))-1))));
      let i:number;
        for(i=0;i<this.num_periodos-this.plazo_gracia3;i++){
          let interes=Number((this.saldosfinalesultimo[i]*tasa));
          let amortizaciones=Number((this.nuevacuota2-interes));
          this.interesfinalesultimo.push(interes);
          this.amortizacionfinalesultimo.push(amortizaciones);
          let saldo_final=Number((this.saldosfinalesultimo[i]-amortizaciones));
          this.saldosfinalesultimo.push(saldo_final);
        }
  
    }
    else{
    this.supuestofinalultimo=Array(this.num_periodos-this.plazo_gracia2).fill(0)
    this.saldosfinalesultimo.push(this.saldosfinales[this.plazo_gracia2-this.plazo_gracia1]);
    let tasa=Number(this.nueva_tasa)/100;
    this.nuevacuota2=Number((this.saldosfinalesultimo[0]*((tasa*(Math.pow(1+tasa,this.num_periodos-this.plazo_gracia2)))/((Math.pow(1+tasa,this.num_periodos-this.plazo_gracia2))-1))));
    let i:number;
      for(i=0;i<this.num_periodos-this.plazo_gracia2;i++){
        let interes=Number((this.saldosfinalesultimo[i]*tasa));
        let amortizaciones=Number((this.nuevacuota2-interes));
        this.interesfinalesultimo.push(interes);
        this.amortizacionfinalesultimo.push(amortizaciones);
        let saldo_final=Number((this.saldosfinalesultimo[i]-amortizaciones));
        this.saldosfinalesultimo.push(saldo_final);
      }

    }
  }
}
