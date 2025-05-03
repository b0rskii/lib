import { makeAutoObservable, runInAction } from 'mobx';
import { OnResultCallback, RequestData, RequestFn, Status } from './types';

type MutationParams<MutationFn extends RequestFn> = {
  errorMessage?: string | null;
  mutationFn: MutationFn;
  onSuccess?: (data: RequestData<MutationFn>) => void;
  onError?: (error: unknown) => void;
  onSettled?: () => void;
};

export class Mutation<
  MutationFn extends RequestFn,
  Data extends RequestData<MutationFn>,
> {
  private status: Status = 'idle';
  private errorMessage: string | null;
  private mutationFn: MutationFn;
  private onSuccess?: OnResultCallback<Data>;
  private onError?: OnResultCallback<unknown>;
  private onSettled?: OnResultCallback<void>;

  error: string | null = null;

  get isPending() {
    return this.status === 'pending';
  }

  get isError() {
    return this.status === 'error';
  }

  constructor(params: MutationParams<MutationFn>) {
    makeAutoObservable(this);

    this.errorMessage = params.errorMessage ?? null;
    this.mutationFn = params.mutationFn;
    this.onSuccess = params.onSuccess;
    this.onError = params.onError;
    this.onSettled = params.onSettled;
  }

  setError(value: string) {
    this.error = value;
  }

  reset() {
    this.error = null;
  }

  mutate(...args: Parameters<MutationFn>) {
    this.status = 'pending';
    this.error = null;

    return this.mutationFn(...args)
      .then((data) => {
        runInAction(() => {
          this.status = 'success';
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
      }) as ReturnType<MutationFn>;
  }
}
