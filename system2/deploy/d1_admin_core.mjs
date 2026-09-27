export function splitSqlStatements(sqlText) {
  if (typeof sqlText !== "string") throw new Error("sqlText must be a string");

  const out = [];
  let buf = "";
  let quote = null;
  let lineComment = false;
  let blockComment = false;

  for (let i = 0; i < sqlText.length; i += 1) {
    const ch = sqlText[i];
    const next = sqlText[i + 1];

    if (lineComment) {
      if (ch === "\n") {
        lineComment = false;
        buf += ch;
      }
      continue;
    }

    if (blockComment) {
      if (ch === "*" && next === "/") {
        blockComment = false;
        i += 1;
      }
      continue;
    }

    if (!quote && ch === "-" && next === "-") {
      lineComment = true;
      i += 1;
      continue;
    }

    if (!quote && ch === "/" && next === "*") {
      blockComment = true;
      i += 1;
      continue;
    }

    if ((ch === "'" || ch === '"') && !quote) {
      quote = ch;
      buf += ch;
      continue;
    }

    if (quote && ch === quote) {
      if (next === quote) {
        buf += ch + next;
        i += 1;
        continue;
      }
      quote = null;
      buf += ch;
      continue;
    }

    if (!quote && ch === ";") {
      const stmt = buf.trim();
      if (stmt) out.push(stmt);
      buf = "";
      continue;
    }

    buf += ch;
  }

  if (quote) throw new Error("unterminated SQL quote");
  if (blockComment) throw new Error("unterminated SQL block comment");

  const tail = buf.trim();
  if (tail) out.push(tail);
  return out;
}

export function classifyTargetResources({
  databases = [],
  workers = [],
  databaseName = "system2-research",
  workerName = "system2-shadow-research",
} = {}) {
  const targetDatabases = databases.filter((x) => x?.name === databaseName);
  const targetWorkers = workers.filter((x) => x?.id === workerName);

  if (targetDatabases.length > 1 || targetWorkers.length > 1) {
    return Object.freeze({
      state: "AMBIGUOUS_DUPLICATE_RESOURCE",
      targetDatabaseCount: targetDatabases.length,
      targetWorkerCount: targetWorkers.length,
    });
  }

  if (targetDatabases.length === 1) {
    return Object.freeze({
      state: "DATABASE_EXISTS",
      targetDatabaseCount: 1,
      targetWorkerCount: targetWorkers.length,
      database: targetDatabases[0],
      worker: targetWorkers[0] || null,
    });
  }

  return Object.freeze({
    state: "DATABASE_NOT_FOUND",
    targetDatabaseCount: 0,
    targetWorkerCount: targetWorkers.length,
    worker: targetWorkers[0] || null,
  });
}

export function assertProvisionConfirmation(value) {
  if (value !== "CREATE_SYSTEM2_ISOLATED_D1") {
    throw new Error(
      "explicit confirmation CREATE_SYSTEM2_ISOLATED_D1 is required",
    );
  }
  return true;
}

export function assertIsolatedDatabaseName(name) {
  if (name !== "system2-research") {
    throw new Error("unexpected System2 D1 database name");
  }
  return true;
}
