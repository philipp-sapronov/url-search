import React, { useContext } from "react";

import { UrlSearchManager } from "./UrlSearchManager";
import { useInitSearchManager } from "./useInitUrlSearchManager";
import { SearchKey } from "../../constants/routes";

export const UrlSearchCtx = React.createContext({
  urlSearchManager: {} as UrlSearchManager<SearchKey>,
});

export const useUrlSearchManager = () => {
  return useContext(UrlSearchCtx).urlSearchManager;
};

export const UrlSearchProvider: React.FC = ({ children }) => {
  const urlSearch = useInitSearchManager<SearchKey>();
  return (
    <UrlSearchCtx.Provider value={{ urlSearchManager: urlSearch }}>
      {children}
    </UrlSearchCtx.Provider>
  );
};
