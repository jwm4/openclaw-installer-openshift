# openclaw-installer-openshift

OpenShift deployer plugin for [openclaw-installer](https://github.com/sallyom/openclaw-installer). Adds OAuth proxy, Routes, and ServiceAccount support for deploying OpenClaw on OpenShift clusters.

## What It Does

When installed, this plugin:

1. **Auto-detects** OpenShift by checking for the `route.openshift.io` API group
2. **Registers** an "openshift" deployer with priority 10 (auto-selected over plain K8s when both are available)
3. **Wraps** the base KubernetesDeployer with OpenShift-specific resources:
   - ServiceAccount with OAuth redirect annotation
   - OAuth config secret (SA token + cookie secret for the proxy)
   - Service with additional oauth-ui port (8443) and serving-cert annotation
   - Route (TLS edge-terminated, targeting the OAuth proxy)
   - Deployment patches: oauth-proxy sidecar, serviceAccountName, OAuth volumes
   - OpenClaw config updated with Route URL for allowedOrigins
4. **Fixes** a bug from the original claw-installer: Route deletion during teardown

No cluster-admin is required. Uses SA-based OAuth (`user:info` scope).

## Install

```bash
cd openclaw-installer
npm install openclaw-installer-openshift
```

The plugin is discovered automatically at startup — no configuration needed.

## Development Setup

### Prerequisites

- Node.js 20+
- npm 10+
- `oc` CLI (if testing against an OpenShift cluster)
- `podman` or `docker` (if testing local deployments)

### Step-by-step

The plugin depends on the installer's TypeScript types and exported modules, so the **installer must be cloned and built first**.

```bash
# 1. Clone both repos side by side
git clone https://github.com/sallyom/openclaw-installer.git
git clone https://github.com/jwm4/openclaw-installer-openshift.git

# 2. Check out the plugin system branch on the installer
cd openclaw-installer
git checkout deployer-plugin-system

# 3. Install and build the installer (build is required — the plugin imports from dist/)
npm install
npm run build

# 4. Install and build the plugin
cd ../openclaw-installer-openshift
npm install
npm run build

# 5. Link the plugin into the installer (creates a symlink, no package.json changes)
npm link
cd ../openclaw-installer
npm link openclaw-installer-openshift

# 6. Start the dev server
npm run dev
```

You should see in the terminal output:
```
Loading plugins...
Loaded plugin: openclaw-installer-openshift
Plugins loaded. Registered deployers: local, kubernetes, openshift
```

To test with OpenShift, log into your cluster first (`oc login`) then restart the dev server. The OpenShift card will auto-detect and appear in the UI.

### Common issues

- **Plugin not showing up?** Make sure you built both repos (`npm run build` in each) and ran both `npm link` steps.
- **TypeScript errors building the plugin?** Build the installer first — the plugin resolves types from `dist/`.
- **Plugin disappeared after `npm install`?** `npm install` removes links. Re-run `npm link openclaw-installer-openshift` in the installer dir.
- **Plugin changes not taking effect?** Rebuild the plugin (`npm run build`) and restart the installer dev server.

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for additional troubleshooting details.

## Architecture

The `OpenShiftDeployer` implements the `Deployer` interface by:

1. Creating OpenShift prerequisites (SA, OAuth secret, namespace)
2. Delegating to `KubernetesDeployer` for core K8s resources
3. Patching the Service, Deployment, and ConfigMap with OpenShift additions
4. Creating the Route and fetching the URL

This approach avoids replicating the full K8s deploy logic while adding all required OpenShift resources. See [ADR 0001](adr/0001-openshift-deployer-plugin-design.md) for the full design rationale.

## Documentation

- [ADR 0001](adr/0001-openshift-deployer-plugin-design.md) -- design decisions
- [Deploying on OpenShift](docs/deploy-openshift.md) -- full deployment guide
- [docs/examples/](docs/examples/) -- annotated YAML examples
