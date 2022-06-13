import { BaseResourceModel } from '../models/base-resource.model'

import { Injector } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

export abstract class BaseResourceService<T extends BaseResourceModel> {
  protected http: HttpClient
  
  constructor(protected apiPath: string, protected injector: Injector) {
    this.http = injector.get(HttpClient)
  }

  getAll(): Observable<T[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToResources)
    )
  }

  getById(id: number): Observable<T> {
    return this.http.get(this.apiPath + '/' + id).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToResource)
    )
  }

  create(resource: T): Observable<T> {
    return this.http.post(this.apiPath, resource).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToResource)
    )
  }

  update(resource: T): Observable<T> {
    return this.http.put(this.apiPath + '/' + resource.id, resource).pipe(
      catchError(this.handlerError),
      map(() => resource)
    )
  }

  delete(id: number): Observable<T> {
    return this.http.delete(this.apiPath + '/' + id).pipe(
      catchError(this.handlerError),
      map(() => null)
    )
  }


  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = []
    jsonData.forEach(element => resources.push(element as T))
    return resources
  }

  protected jsonDataToResource(jsonData: any): T {
    return jsonData as T
  }

  protected handlerError(error: any): Observable<any> {
    console.log('ERRO NA REQUISIÇÃO => ', error)
    return throwError(error)
  }
}