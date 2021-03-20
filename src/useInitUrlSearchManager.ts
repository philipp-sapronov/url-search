import {useEffect, useState} from 'react';
import {UrlSearchManager} from './UrlSearchManager';
import {useLocation} from 'react-router-dom';

export const useInitSearchManager = <T extends string>() => {
  const location = useLocation();

  const [manager, setManager] = useState<UrlSearchManager<T>>(UrlSearchManager.of(location));

  useEffect(() => {
    setManager(UrlSearchManager.of(location));
  }, [location]);

  return manager;
};
