export const REMOTE_D1_REST_ADAPTER_VERSION = "0.1-RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function statementShape(sql, params = []) {
  return Object.freeze({
    __remoteD1Statement: true,
    sql: requiredText(sql, "sql"),
    params: Object.freeze([...params]),
  });
}

export async function createRemoteD1RestAdapter({
  accountId,
  apiToken,
  databaseName = "system2-research",
  fetchImpl = globalThis.fetch,
} = {}) {
  const account = requiredText(accountId, "accountId");
  const token = requiredText(apiToken, "apiToken");
  const expectedName = requiredText(databaseName, "databaseName");
  if (expectedName !== "system2-research") {
    throw new Error("remote System2 D1 adapter refuses non-isolated database name");
  }
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");

  const origin = "https://api.cloudflare.com/client/v4";
  const headers = {
    authorization: `Bearer ${token}`,
    accept: "application/json",
    "content-type": "application/json",
  };
  const metrics = {
    requestCount: 0,
    rowsRead: 0,
    rowsWritten: 0,
    latestSizeAfter: null,
  };

  async function api(path, { method = "GET", body } = {}) {
    metrics.requestCount += 1;
    const response = await fetchImpl(origin + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(60000),
    });
    const text = await response.text();
    let data = null;
    try { data = JSON.parse(text); } catch {}
    if (!response.ok || data?.success === false) {
      const message = data?.errors?.[0]?.message || text;
      throw new Error(
        `${method} ${path.replace(account, "<account>")} HTTP ${response.status}: ${String(message).slice(0, 500)}`,
      );
    }
    return data;
  }

  const listed = await api(`/accounts/${account}/d1/database?per_page=100`);
  const matches = (listed.result || []).filter((x) => x?.name === expectedName);
  if (matches.length !== 1) {
    throw new Error(`expected exactly one isolated D1 named ${expectedName}; found ${matches.length}`);
  }
  const database = matches[0];
  const databaseId = database.uuid || database.id;
  if (!databaseId) throw new Error("isolated System2 D1 id missing");

  function absorbMeta(blocks) {
    for (const block of blocks || []) {
      const meta = block?.meta || {};
      if (Number.isFinite(Number(meta.rows_read))) metrics.rowsRead += Number(meta.rows_read);
      if (Number.isFinite(Number(meta.rows_written))) metrics.rowsWritten += Number(meta.rows_written);
      if (Number.isFinite(Number(meta.size_after))) metrics.latestSizeAfter = Number(meta.size_after);
    }
  }

  async function queryOne(sql, params = []) {
    const data = await api(`/accounts/${account}/d1/database/${databaseId}/query`, {
      method: "POST",
      body: { sql, params },
    });
    const blocks = Array.isArray(data.result) ? data.result : [];
    absorbMeta(blocks);
    return blocks;
  }

  async function queryBatch(statements) {
    if (!statements.length) return [];
    const data = await api(`/accounts/${account}/d1/database/${databaseId}/query`, {
      method: "POST",
      body: {
        batch: statements.map((statement) => ({
          sql: statement.sql,
          params: [...statement.params],
        })),
      },
    });
    const blocks = Array.isArray(data.result) ? data.result : [];
    absorbMeta(blocks);
    return blocks;
  }

  function prepare(sql) {
    const text = requiredText(sql, "sql");
    const bound = (params = []) => ({
      ...statementShape(text, params),
      bind(...nextParams) {
        return bound(nextParams);
      },
      async first() {
        const blocks = await queryOne(text, params);
        for (const block of blocks) {
          if (Array.isArray(block?.results) && block.results.length) return block.results[0];
        }
        return null;
      },
      async all() {
        const blocks = await queryOne(text, params);
        return {
          results: blocks.flatMap((block) => Array.isArray(block?.results) ? block.results : []),
        };
      },
      async run() {
        const blocks = await queryOne(text, params);
        const success = blocks.every((block) => block?.success !== false);
        return {
          success,
          meta: blocks.at(-1)?.meta || null,
          results: blocks.flatMap((block) => Array.isArray(block?.results) ? block.results : []),
        };
      },
    });
    return bound([]);
  }

  async function batch(statements) {
    if (!Array.isArray(statements)) throw new Error("batch statements must be an array");
    for (const statement of statements) {
      if (!statement?.__remoteD1Statement) {
        throw new Error("remote D1 batch received a foreign statement");
      }
    }
    const blocks = await queryBatch(statements);
    if (blocks.length !== statements.length) {
      throw new Error(
        `remote D1 batch result count mismatch: expected ${statements.length}, got ${blocks.length}`,
      );
    }
    return blocks.map((block) => ({
      success: block?.success !== false,
      meta: block?.meta || null,
      results: Array.isArray(block?.results) ? block.results : [],
    }));
  }

  return {
    prepare,
    batch,
    database: Object.freeze({
      name: expectedName,
      idPresent: true,
      uuidDigestInput: databaseId,
    }),
    metrics,
    async rawQuery(sql, params = []) {
      const blocks = await queryOne(sql, params);
      return blocks.flatMap((block) => Array.isArray(block?.results) ? block.results : []);
    },
  };
}
