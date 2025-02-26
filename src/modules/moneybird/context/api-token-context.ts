import { createContext } from 'react';

export const APITokenContext = createContext<
  [string | undefined, (token: string | null | undefined) => void]
>([undefined, () => {}]);
