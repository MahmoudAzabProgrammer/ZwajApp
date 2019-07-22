import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginationResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {

baseUrl = environment.apiUrl + 'users/';
constructor(private http: HttpClient) { }

getUsers(page? , itemsPerpage?, userParams?): Observable<PaginationResult<User[]>> {
  const paginationResult: PaginationResult<User[]> = new PaginationResult<User[]>();
  let params = new HttpParams();
  if(page != null && itemsPerpage != null){
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerpage);
  }
  if(userParams != null) {
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
  }
  return this.http.get<User[]>(this.baseUrl, { observe: 'response', params }).pipe(map(response => {
    paginationResult.result = response.body;
    if(response.headers.get('Pagination') != null) {
      paginationResult.pagination = JSON.parse(response.headers.get('Pagination'))
    }
    return paginationResult;
  }));
}
getUser(id): Observable<User>{
  return this.http.get<User>(this.baseUrl + id );
}
updateUser(id: number , user: User){
  return this.http.put(this.baseUrl + id , user);
}
setMainPhoto(userId: number , id: number) {
  return this.http.post(this.baseUrl + userId + '/photos/' + id + '/setMain', {} );
}
deletePhoto(userId: number , id: number){
  return this.http.delete(this.baseUrl + userId + '/photos/' + id);
}

}
