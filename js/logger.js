/**
 * @file logger.js
 * @description Trazabilidad centralizada para eventos del sistema y auditoría de UI.
 */
export const AppLogger = {
    info: (msg, payload = {}) => {
        console.info(`[INFO] [${new Date().toISOString()}] - ${msg}`, payload);
    },
    warn: (msg, payload = {}) => {
        console.warn(`[WARN] [${new Date().toISOString()}] - ${msg}`, payload);
    },
    error: (msg, error = {}) => {
        console.error(`[ERROR] [${new Date().toISOString()}] - ${msg}`, error);
    }
};