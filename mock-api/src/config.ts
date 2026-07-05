// Render injects the service's own public URL at runtime, so a single
// deployed service (this backend serving the built Mini App) can
// self-configure without needing to know its own hostname ahead of time.
const platformUrl = process.env.RENDER_EXTERNAL_URL;

export const publicUrl = process.env.MINI_APP_URL ?? platformUrl ?? 'http://localhost:5173';
