import { glob } from "glob";

import { DataSourceEntry } from "./DataSourceEntry";
import { DataSourceEnv } from "./DataSourceEnv";

export class DataSource {
  public value: string;
  public readonly options: DataSourceEnv;

  constructor(options: DataSourceEnv) {
    this.value = "";
    this.options = options;
  }

  update(value: string) {
    this.value = value;
  }

  entries(value: string): Promise<DataSourceEntry[]> {
    const entry = new DataSourceEntry(value, this.options);

    return new Promise((resolve) => {
      let resolved = 0;
      let entries: DataSourceEntry[] = [];

      const done = () => {
        if (resolved === 2) {
          resolve(entries.filter((entry) => entry.collapsedPath));
        }
      };

      glob(`${entry.path}/*/`, { nocase: true }, (err, matches) => {
        resolved += 1;

        entries.push(
          ...(err
            ? []
            : matches.map((match) => new DataSourceEntry(match, this.options))),
        );

        done();
      });

      glob(`${entry.path}*/`, { nocase: true }, (err, matches) => {
        resolved += 1;

        entries.push(
          ...(err
            ? []
            : matches.map((match) => new DataSourceEntry(match, this.options))),
        );

        done();
      });
    });
  }
}
