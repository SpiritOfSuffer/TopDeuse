import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { classToPlain } from 'class-transformer';
import { isArray, isObject } from 'lodash';
 @Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    return call$.pipe(map(res => (isObject(res) ? this.transformResponse(res) : res)));
  }
   transformResponse(response) {
    if (isArray(response)) {
      return response.map(item => this.transformToPlain(item));
    }
    return this.transformToPlain(response);
  }
   transformToPlain(plainOrClass) {
    return plainOrClass && plainOrClass.constructor !== Object
      ? classToPlain(plainOrClass)
      : plainOrClass;
  }
}