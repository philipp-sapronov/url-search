type LocationType = {
  pathname: string;
  search?: string;
};

const toMap = <K extends string>(keys: K[]): Record<string, boolean> => {
  return keys.reduce((acc, item) => ({...acc, [item]: true}), {});
};

export class UrlSearchManager<T extends string = string> {
  private readonly $USP: URLSearchParams;
  private readonly $Location: LocationType;

  public static of<K extends string>(location: LocationType) {
    const empty = {};

    return new Proxy(empty as UrlSearchManager<K>, {
      get(target, name: keyof UrlSearchManager) {
        const instance = new UrlSearchManager(location);
        const accessProperty = instance[name];

        if (typeof accessProperty === 'function') return accessProperty.bind(instance);

        return accessProperty;
      },
    });
  }

  private constructor(location: LocationType) {
    this.$USP = new URLSearchParams(location.search || '');
    this.$Location = location;
  }

  public append(key: T, ...values: string[]) {
    if (values.length === 0) return this;

    values.forEach((value) => {
      this.$USP.append(key, value);
    });

    return this;
  }

  public delete(key: T, ...$values: string[]) {
    if ($values.length > 0) {
      const map = toMap($values);

      const values = this.$USP.getAll(key);
      const filtered = values.filter((value) => !map[value]);
      this.set(key, ...filtered);

      return this;
    }

    this.$USP.delete(key);
    return this;
  }

  public deleteKeys(...keys: T[]) {
    keys.forEach((key) => {
      this.$USP.delete(key);
    });

    return this;
  }

  public set(key: T, ...values: string[]) {
    this.$USP.delete(key);

    values.forEach((value) => {
      this.$USP.append(key, value);
    });

    return this;
  }

  public has(key: T, ...values: string[]) {
    if (values.length > 0) {
      const map = toMap(this.$USP.getAll(key));
      return values.findIndex((value) => map[value]) !== -1;
    }

    return this.$USP.has(key);
  }

  public get(key: T): string | null {
    return this.$USP.get(key);
  }

  public getAll(key: T): string[] {
    return this.$USP.getAll(key);
  }

  public get path() {
    return this.pathname + this.search;
  }

  public get search(): string {
    const searchString = this.$USP.toString();
    if (!searchString.length) return '';
    return '?' + searchString;
  }

  public get pathname(): string {
    return this.$Location.pathname;
  }

  public get json(): Record<string, string[]> {
    const keys = this.keys();

    return keys.reduce((json, key) => ({...json, [key]: this.getAll(key)}), {});
  }

  public keys(): T[] {
    return Array.from(this.$USP.keys()) as T[];
  }

  public values(): string[] {
    return Array.from(this.$USP.values());
  }

  public create(): UrlSearchManager {
    return new UrlSearchManager(this.$Location);
  }
}
