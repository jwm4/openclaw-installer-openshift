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

### Prerequisites

- Node.js 20+
- npm 10+
- `oc` CLI, logged into your OpenShift cluster (`oc login`)

### Steps

```bash
# 1. Clone and build the installer
git clone https://github.com/sallyom/openclaw-installer.git
cd openclaw-installer
npm install

# 2. Install the OpenShift plugin
npm install https://github.com/jwm4/openclaw-installer-openshift

# 3. Build and start
npm run build
npm start
```

The plugin is discovered automatically at startup. If you're logged into an OpenShift cluster, the OpenShift deployment option will appear in the UI at http://localhost:3000.

## Development Setup

### Prerequisites

- Node.js 20+
- npm 10+
- `oc` CLI (if testing against an OpenShift cluster)
- `podman` or `docker` (if testing local deployments)

### Quick start

```bash
git clone https://github.com/sallyom/openclaw-installer.git
git clone https://github.com/jwm4/openclaw-installer-openshift.git
cd openclaw-installer-openshift
./scripts/setup-dev.sh
```

The script clones the installer if needed, builds both repos, and links the plugin. When it finishes, start the dev server:

```bash
cd ../openclaw-installer
npm run dev
```

You should see in the terminal output:
```
Loading plugins...
Loaded plugin: openclaw-installer-openshift
Plugins loaded. Registered deployers: local, kubernetes, openshift
```

To test with OpenShift, log into your cluster first (`oc login`) then restart the dev server. The OpenShift card will auto-detect and appear in the UI.

### After `npm install`

`npm install` removes the plugin link. Re-run the setup script to restore it:

```bash
cd openclaw-installer-openshift
./scripts/setup-dev.sh
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for manual steps and additional troubleshooting.

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
