import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const userToken = localStorage.getItem("token");

        if (!userToken) {
            return next.handle(req);
        }

        const modifiedReq = req.clone({
            headers: req.headers.set("token", userToken),
        });
        return next.handle(modifiedReq);
    }
}