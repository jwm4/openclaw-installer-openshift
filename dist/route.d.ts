import type { LogCallback } from "@openclaw/installer/deployers/types";
export declare function applyRoute(ns: string, log: LogCallback, withOauth?: boolean): Promise<void>;
export declare function getRouteUrl(ns: string): Promise<string>;
/**
 * Delete the Route (BUG FIX: claw-installer teardown did not delete Routes).
 */
export declare function deleteRoute(ns: string, log: LogCallback): Promise<void>;
