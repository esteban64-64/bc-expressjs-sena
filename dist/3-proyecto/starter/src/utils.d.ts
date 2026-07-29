/**
 * Utilidades de filesystem
 */
export declare function leerJSON<T>(relativePath: string): Promise<T>;
export declare function escribirJSON<T>(relativePath: string, data: T): Promise<void>;
export declare function escribirTexto(relativePath: string, content: string): Promise<void>;
//# sourceMappingURL=utils.d.ts.map