// Thin SQL client abstraction. The Postgres store depends only on this
// interface, never on a specific driver's API, so the concrete driver
// (currently postgres.js, works with any Postgres incl. Neon's pooler)
// can be swapped — or a Neon HTTP driver added for edge — in one file.

export type SqlRow = Record<string, unknown>;

export interface SqlClient {
  /** Parameterised query. `$1`, `$2`, … placeholders map to `params`. */
  query<T = SqlRow>(text: string, params?: unknown[]): Promise<T[]>;
  /** Close the underlying pool. */
  end(): Promise<void>;
}

/**
 * Build a SqlClient over postgres.js. Serverless-friendly defaults:
 * a small pool, short idle timeout, and prepared statements disabled
 * (required when connecting through a transaction-mode pooler such as
 * Neon's `-pooler` endpoint).
 */
export async function createPgClient(connectionString: string): Promise<SqlClient> {
  const { default: postgres } = await import("postgres");

  const sql = postgres(connectionString, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 15,
    prepare: false,
  });

  return {
    async query<T = SqlRow>(text: string, params: unknown[] = []): Promise<T[]> {
      const rows = await sql.unsafe(text, params as never[]);
      return rows as unknown as T[];
    },
    async end(): Promise<void> {
      await sql.end({ timeout: 5 });
    },
  };
}
