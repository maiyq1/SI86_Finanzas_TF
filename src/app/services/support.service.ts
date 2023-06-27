import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Run } from '../models/run';
import { Firestore, addDoc, collectionData,collection,doc,getDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Support } from '../models/support';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(private firestore:Firestore) { }

  postError(support:Support){
    const runRef=collection(this.firestore,'support');
    return addDoc(runRef,support);
  }
}
