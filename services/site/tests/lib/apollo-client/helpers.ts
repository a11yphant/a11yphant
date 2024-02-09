import { ApolloLink, Observable } from "@apollo/client";

export function createTerminatingLink(): ApolloLink {
  return new ApolloLink((operation) => {
    operation.setContext({
      response: { headers: { get: jest.fn().mockReturnValue("a11yphant_session=header-content") } },
    });

    return createFakeObservable();
  });
}

export function createFakeObservable(): Observable<unknown> {
  return new Observable((observer) => {
    observer.next({ data: { userId: 4 } });
    observer.complete();
  });
}
