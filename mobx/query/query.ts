import { makeAutoObservable, runInAction } from 'mobx';
import { OnResultCallback, RequestData, RequestFn, Status } from './types';

type QueryParams<
  QueryFn extends RequestFn,
  Data extends RequestData<QueryFn>,
> = {
  initialData?: Data | null;
  errorMessage?: string | null;
  queryFn: QueryFn;
  onSuccess?: (data: Data) => void;
  onError?: (error: unknown) => void;
  onSettled?: () => void;
};

export class Query<
  QueryFn extends RequestFn,
  Data extends RequestData<QueryFn>,
> {
  private status: Status = 'idle';
  private errorMessage: string | null;
  private queryFn: QueryFn;
  private onSuccess?: OnResultCallback<Data>;
  private onError?: OnResultCallback<unknown>;
  private onSettled?: OnResultCallback<void>;

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

  constructor(params: QueryParams<QueryFn, Data>) {
    makeAutoObservable(this);

    this.data = params.initialData ?? null;
    this.errorMessage = params.errorMessage ?? null;
    this.queryFn = params.queryFn;
    this.onSuccess = params.onSuccess;
    this.onError = params.onError;
    this.onSettled = params.onSettled;
  }

  setData(value: Data | null) {
    this.data = value;
  }

  setError(value: string) {
    this.error = value;
  }

  reset() {
    this.data = null;
    this.error = null;
  }

  fetch(...args: Parameters<QueryFn>) {
    this.status = 'pending';
    this.error = null;

    return this.queryFn(...args)
      .then((data) => {
        runInAction(() => {
          this.status = 'success';
          this.data = data;
          this.onSuccess?.(data);
        });
        return data;
      })
      .catch((error: unknown) => {
        runInAction(() => {
          this.status = 'error';
          this.error = this.errorMessage;
          this.onError?.(error);
        });
        return error;
      })
      .finally(() => {
        this.onSettled?.();
      }) as ReturnType<QueryFn>;
  }
}
