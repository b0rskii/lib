export type RequestFn = (...args: any) => Promise<any>;
export type OnResultCallback<Data> = (data: Data) => void;
export type RequestData<T extends RequestFn> = Awaited<ReturnType<T>>;
export type Status = 'idle' | 'pending' | 'success' | 'error';
