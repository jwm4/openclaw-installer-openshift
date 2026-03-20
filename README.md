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

To develop this plugin alongside openclaw-installer without modifying the installer's package.json:

```bash
# Clone both repos side by side
git clone https://github.com/sallyom/openclaw-installer.git
git clone https://github.com/jwm4/openclaw-installer-openshift.git

# Build the plugin
cd openclaw-installer-openshift
npm install
npm run build

# Link into the installer (no package.json changes)
npm link
cd ../openclaw-installer
npm link openclaw-installer-openshift

# Start the dev server
npm run dev
```

If you're logged into an OpenShift cluster (`oc login`), the OpenShift deployer will auto-detect and appear in the UI.

Note: `npm install` in the installer removes the link. Re-run the `npm link` steps after installing new dependencies.

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
