import { makeAutoObservable, runInAction } from 'mobx';
import { OnResultCallback, RequestData, RequestFn, Status } from './types';

type QueryParams<
  QueryFn extends RequestFn,
  Data extends RequestData<QueryFn>,
> = {
  queryFn: QueryFn;
  initialData?: Data | null;
  errorMessage?: string | null;
  onSuccess?: (data: Data) => void;
  onError?: (error: unknown) => void;
};

export class Query<
  QueryFn extends RequestFn,
  Data extends RequestData<QueryFn>,
> {
  private queryFn: QueryFn;
  private onSuccess?: OnResultCallback<Data>;
  private onError?: OnResultCallback<unknown>;
  private errorMessage: string | null;
  private status: Status = 'idle';

  data: Data | null = null;
  error: string | null = null;

  get isLoading() {
    return this.data === null && this.status === 'pending';
  }

  get isPending() {
    return this.status === 'pending';
  }

  get isError() {
    return this.status === 'error';
  }

  constructor({
    queryFn,
    initialData = null,
    errorMessage = null,
    onSuccess,
    onError,
  }: QueryParams<QueryFn, Data>) {
    makeAutoObservable(this);

    this.data = initialData;
    this.errorMessage = errorMessage;
    this.queryFn = queryFn;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  setData(value: Data) {
    this.data = value;
  }

  setError(value: string) {
    this.error = value;
  }

  clearData() {
    this.data = null;
    this.error = null;
  }

  fetch(...args: Parameters<QueryFn>) {
    this.error = null;
    this.status = 'pending';

    return this.queryFn(...args)
      .then((data) => {
        runInAction(() => {
          this.status = 'success';
          this.data = data;
          this.onSuccess?.(data);
        });
        return data;
      })
      .catch((error) => {
        runInAction(() => {
          this.status = 'error';
          this.error = this.errorMessage;
          this.onError?.(error);
        });
        return error;
      }) as ReturnType<QueryFn>;
  }
}
