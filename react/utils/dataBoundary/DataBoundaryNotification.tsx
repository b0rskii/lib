import { useDataBoundary } from './context';

export const DataBoundaryNotification = () => {
  const { notification } = useDataBoundary();

  if (!notification) return null;

  return <div>{notification}</div>;
};
