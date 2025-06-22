import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type Errors = Record<string, true>;

type Params = {
  errors: Errors;
  notification: string;
  updateErrors: (name: string, value: boolean) => void;
};

const DataBoundaryContext = createContext<Params | null>(null);
export const useDataBoundary = () => useContext(DataBoundaryContext) as Params;

type ProviderProps = PropsWithChildren<{
  data: unknown;
  onStatusChange: (status: boolean) => void;
}>;

export const DataBoundary = ({
  data,
  children,
  onStatusChange,
}: ProviderProps) => {
  const [errors, setErrors] = useState<Errors>({});
  const errorsRef = useRef<Errors>({});

  const notification = useMemo(() => {
    const errorFields = Object.keys(errors).join(', ');
    if (!errorFields) return '';

    return `Не удалось получить данные: ${errorFields.toLowerCase()}`;
  }, [errors]);

  useLayoutEffect(() => {
    setErrors({ ...errorsRef.current });
    onStatusChange(Object.keys(errorsRef.current).length === 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const updateErrors = useCallback<Params['updateErrors']>((name, value) => {
    if (value) {
      errorsRef.current[name] = true;
      return;
    }
    delete errorsRef.current[name];
  }, []);

  return (
    <DataBoundaryContext.Provider
      value={{
        errors,
        notification,
        updateErrors,
      }}
    >
      {children}
    </DataBoundaryContext.Provider>
  );
};
