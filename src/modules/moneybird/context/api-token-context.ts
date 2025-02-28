import { createContext } from 'react';

export const APITokenContext = createContext<
  [string | null, (token: string | null | undefined) => void]
>([null, () => {}]);
