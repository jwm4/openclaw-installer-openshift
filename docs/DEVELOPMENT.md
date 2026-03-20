# Development Setup

How to set up both openclaw-installer and openclaw-installer-openshift for local development.

## Prerequisites

- Node.js 20+
- npm 10+
- `oc` CLI (if testing against an OpenShift cluster)
- `podman` or `docker` (if testing local deployments)

## Step-by-step setup

The plugin depends on the installer's TypeScript types and exported modules, so the **installer must be cloned and built first**.

```bash
# 1. Clone both repos side by side
git clone https://github.com/sallyom/openclaw-installer.git
git clone https://github.com/jwm4/openclaw-installer-openshift.git

# 2. Install and build the installer (build is required — the plugin imports from dist/)
cd openclaw-installer
npm install
npm run build

# 3. Install and build the plugin
cd ../openclaw-installer-openshift
npm install
npm run build

# 4. Link the plugin into the installer (creates a symlink, no package.json changes)
npm link
cd ../openclaw-installer
npm link openclaw-installer-openshift

# 5. Start the dev server
npm run dev
```

You should see in the terminal output:
```
Loading plugins...
Loaded plugin: openclaw-installer-openshift
Plugins loaded. Registered deployers: local, kubernetes, openshift
```

## Testing with OpenShift

To see the OpenShift deployer in the UI:

```bash
# Log into your OpenShift cluster
oc login --server=https://api.your-cluster.example.com:6443

# Restart the dev server (it detects OpenShift at startup)
# In the UI, the OpenShift card should appear and be auto-selected
```

## Common issues

### Plugin not showing up in the UI

- **Did you run `npm run build` in the installer?** The plugin imports types from `dist/`. Without a build, `npm install` in the plugin will fail or the types won't resolve.
- **Did you run `npm run build` in the plugin?** The plugin loader imports from the plugin's `dist/` directory.
- **Did you run both `npm link` commands?** You need `npm link` in the plugin dir (registers it globally) AND `npm link openclaw-installer-openshift` in the installer dir (creates the symlink).
- **Did you run `npm install` after linking?** `npm install` removes links. Re-run the `npm link` steps after any `npm install`.

### TypeScript errors when building the plugin

- Make sure you built the installer first (`npm run build` in openclaw-installer). The plugin's `devDependencies` reference the installer via `file:../openclaw-installer`, and TypeScript resolves types from `dist/`.

### "No deployer registered for mode: openshift"

- The plugin loaded but failed to register. Check the terminal for error messages during startup. Common cause: the plugin was built against an older version of the installer that doesn't have the expected exports.

## Making changes

When you change code:

- **Installer changes**: `tsx watch` (via `npm run dev`) auto-reloads server-side changes. Vite hot-reloads frontend changes.
- **Plugin changes**: You must rebuild the plugin (`npm run build` in the plugin dir) and restart the installer dev server. The plugin is loaded from `dist/`, not from source.
