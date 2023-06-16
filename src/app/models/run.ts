import { Customer } from "./customer";

export interface Run{
    id?:number;
    typeMoney:string;
    priceProperty:number;
    firstFee:number;
    amountFinance:number;
    nameRate:string;
    timeRate:string;
    rate:number;
    frequencyPay:string;
    convertRate:number;
    nameConvertRate:string;
    numberYear:number;
    numberPeriods:number;
    gracePeriod:string;
    numberGracePeriod1:number,
    numberGracePeriod2:number,
    numberGracePeriod3:number,
    cok:number;
    van:number;
    tir:number;
    dateSave:string;
    customer:Customer;
}

