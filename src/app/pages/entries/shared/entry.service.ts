import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs'
import { map, catchError, flatMap } from 'rxjs/operators'
import { Entry } from './entry.model'
import { CategoryService } from './../../categories/shared/category.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private apiPath: string = 'api/entries'

  constructor(
    private http: HttpClient,
    private categoryService: CategoryService
  ) { }

  getAll(): Observable<Entry[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToEntries)
    )
  }

  getById(id: number): Observable<Entry> {
    return this.http.get(this.apiPath + '/' + id).pipe(
      catchError(this.handlerError),
      map(this.jsonDataToEntry)
    )
  }

  create(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category

        return this.http.post(this.apiPath, entry).pipe(
          catchError(this.handlerError),
          map(this.jsonDataToEntry)
        )
      })
    )
  }

  update(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category
        
        return this.http.put(this.apiPath + '/' + entry.id, entry).pipe(
          catchError(this.handlerError),
          map(() => entry)
        )
      })
    )
  }

  delete(id: number): Observable<Entry> {
    return this.http.delete(this.apiPath + '/' + id).pipe(
      catchError(this.handlerError),
      map(() => null)
    )
  }

  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = []

    jsonData.forEach(element => {
      const entry = Object.assign(new Entry(), element)
      entries.push(entry)
    })
    return entries
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData)
  }

  private handlerError(error: any): Observable<any> {
    console.log('ERRO NA REQUISIÇÃO => ', error)
    return throwError(error)
  }
}
