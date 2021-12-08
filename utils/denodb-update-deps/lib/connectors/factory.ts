import { MySQLConnector, MySQLOptions } from "./mysql-connector.ts";
import type { BuiltInDatabaseDialect } from "../database.ts";
import { Connector, ConnectorOptions } from "./connector.ts";

export function connectorFactory(
  dialect: BuiltInDatabaseDialect,
  connectionOptions: ConnectorOptions,
): Connector {
  switch (dialect) {
    case "mysql":
      return new MySQLConnector(connectionOptions as MySQLOptions);
    default:
      throw new Error(
        `No connector was found for the given dialect: ${dialect}.`,
      );
  }
}
