import { CallHandler, ExecutionContext, Injectable } from "@nestjs/common";
import { GraphqlInterceptor } from "@ntegral/nestjs-sentry";
import { Observable, tap } from "rxjs";

@Injectable()
export class SentryInterceptor extends GraphqlInterceptor {
  constructor() {
    super();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const transaction = this.client.instance().startTransaction({
      name: "HTTP Request",
    });

    return super.intercept(context, next).pipe(
      tap(() => {
        transaction.finish();
      }),
    );
  }
}
