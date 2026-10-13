// pm2 process definition for the A7 website. The app is typically already
// registered as `a7-website` running `npm start -- -p 3060`; this file documents
// that and lets you (re)create it with `pm2 start deploy/ecosystem.config.cjs`.
module.exports = {
  apps: [
    {
      name: "a7-website",
      cwd: "/opt/a7-website",
      script: "npm",
      args: "start -- -p 3060",
      env: { NODE_ENV: "production" },
      max_restarts: 10,
      autorestart: true,
    },
    // The integrations sync process (Property Finder / Bayut / Bitrix24) will be
    // added here as `a7-website-sync` once those integrations are enabled.
  ],
}
