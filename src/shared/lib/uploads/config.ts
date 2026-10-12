import path from "node:path"

/** Absolute root directory for uploaded media files. */
export const UPLOADS_ROOT = path.resolve(process.env.UPLOADS_DIR ?? "./.uploads")

/** Max upload size — matches nginx `client_max_body_size 50m`. */
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024
