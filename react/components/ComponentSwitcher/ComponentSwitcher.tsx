import { ReactElement } from 'react';

type Props = {
  activeKey: string;
  children: ReactElement[];
};

export const ComponentSwitcher = ({ activeKey, children }: Props) => {
  return children.find((c) => c.key === activeKey) ?? null;
};
