import { useDataBoundary } from './context';

export type DataProps = {
  name: string;
  children: string | number | null | undefined;
};

export const Data = ({ name, children }: DataProps) => {
  const { updateErrors } = useDataBoundary();
  const isEmpty = !children && children !== 0;

  updateErrors(name, isEmpty);

  if (isEmpty) return <span style={{ color: 'red' }}>Нет данных</span>;

  return <>{children}</>;
};
