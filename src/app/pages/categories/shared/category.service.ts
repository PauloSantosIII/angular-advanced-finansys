import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs'
import { map, catchError, flatMap } from 'rxjs/operators'
import { Category } from './category.model'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiPath: string = 'api/categories'

  constructor(private http: HttpClient ) { }

  getAll(): Observable<Category[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToCategories)
    )
  }

  getById(id: number): Observable<Category> {
    return this.http.get(this.apiPath + '/' + id).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToCategory)
    )
  }

  create(category: Category): Observable<Category> {
    return this.http.post(this.apiPath, category).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToCategory)
    )
  }

  update(category: Category): Observable<Category> {
    return this.http.put(this.apiPath + '/' + category.id, category).pipe(
      catchError(this.handlerError),
      map(() => category)
    )
  }

  delete(id: number): Observable<Category> {
    return this.http.delete(this.apiPath + '/' + id).pipe(
      catchError(this.handlerError),
      map(() => null)
    )
  }

  private jsonDataToCategories(jsonData: any[]): Category[] {
    const categories: Category[] = []
    jsonData.forEach(element => categories.push(element as Category))
    return categories
  }

  private jsonDataToCategory(jsonData: any): Category {
    return jsonData as Category
  }

  private handlerError(error: any): Observable<any> {
    console.log('ERRO NA REQUISIÇÃO => ', error)
    return throwError(error)
  }
}
