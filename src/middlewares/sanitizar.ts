import type { Request, Response, NextFunction } from "express";
import { sanitize } from "express-mongo-sanitize";

/**
 * Sanitiza body/params/query contra inyección NoSQL (claves con `$` o `.`).
 *
 * No usamos el middleware por defecto de `express-mongo-sanitize`: internamente
 * hace `req.query = target`, y en Express 5 `req.query` es un getter sin
 * setter — esa reasignación lanza "Cannot set property query of
 * #<IncomingMessage> which has only a getter" en TODAS las peticiones.
 * `sanitize()` ya limpia el objeto en el sitio (misma referencia), así que
 * basta con llamarla sin reasignar `req[key]`.
 */
export function sanitizarEntradas(req: Request, _res: Response, next: NextFunction): void {
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  if (req.query) sanitize(req.query);
  next();
}
