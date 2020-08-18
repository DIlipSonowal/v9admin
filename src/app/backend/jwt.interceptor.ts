import {Injectable} from  '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable} from 'rxjs';
import {AuthService} from '../home/services/auth.service';


@Injectable()

export class JwtInterceptor implements HttpInterceptor{

    constructor(private auth:AuthService){}
    intercept(request:HttpRequest<any>, next:HttpHandler) : Observable<HttpEvent<any>> {
        let currentUser = this.auth.currentUserValue;
        if(currentUser && currentUser.token ){
            request= request.clone({
                setHeaders:{
                    Authorization: 'Bearer ${currentUser.token}'
                }
            })
        }
        return next.handle(request);
    }
}
