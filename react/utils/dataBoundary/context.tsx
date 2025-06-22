import {
  createContext,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

type Params = {
  notification: string;
  updateErrors: (name: string, value: boolean) => void;
};

const DataBoundaryContext = createContext<Params | null>(null);
export const useDataBoundary = () => useContext(DataBoundaryContext) as Params;

type DataBoundaryProps = PropsWithChildren<{
  data: unknown;
  onDataChange: (isValid: boolean) => void;
}>;

export const DataBoundary = ({
  data,
  children,
  onDataChange,
}: DataBoundaryProps) => {
  const [notification, setNotification] = useState('');
  const errorsRef = useRef<Record<string, true>>({});

  useLayoutEffect(() => {
    const errorFields = Object.keys(errorsRef.current).join(', ');

    setNotification(
      errorFields
        ? `Не удалось получить данные: ${errorFields.toLowerCase()}.`
        : '',
    );

    onDataChange(!errorFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const updateErrors: Params['updateErrors'] = (name, value) => {
    if (value) {
      errorsRef.current[name] = true;
      return;
    }
    delete errorsRef.current[name];
  };

  return (
    <DataBoundaryContext.Provider
      value={{
        notification,
        updateErrors,
      }}
    >
      {children}
    </DataBoundaryContext.Provider>
  );
};
