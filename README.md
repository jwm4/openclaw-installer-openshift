# openclaw-installer-openshift

OpenShift deployer plugin for [openclaw-installer](../openclaw-installer). Adds OAuth proxy, Routes, and ServiceAccount support for deploying OpenClaw on OpenShift clusters.

## What It Does

When installed, this plugin:

1. **Auto-detects** OpenShift by checking for the `route.openshift.io` API group
2. **Wraps** the base KubernetesDeployer with OpenShift-specific resources:
   - ServiceAccount with OAuth redirect annotation
   - OAuth config secret (SA token + cookie secret for the proxy)
   - Service with additional oauth-ui port (8443) and serving-cert annotation
   - Route (TLS edge-terminated, targeting the OAuth proxy)
   - Deployment patches: oauth-proxy sidecar, serviceAccountName, OAuth volumes
   - OpenClaw config updated with Route URL for allowedOrigins
3. **Fixes** a bug from the original claw-installer: Route deletion during teardown

No cluster-admin is required. Uses SA-based OAuth (`user:info` scope).

## Install

```bash
cd openclaw-installer
npm install openclaw-installer-openshift
```

## Usage

The plugin registers itself with the installer's deployer registry. When deploying to a Kubernetes cluster, the installer checks for OpenShift and automatically uses this plugin's `OpenShiftDeployer` instead of the base `KubernetesDeployer`.

## Architecture

The `OpenShiftDeployer` implements the `Deployer` interface by:

1. Creating OpenShift prerequisites (SA, OAuth secret, namespace)
2. Delegating to `KubernetesDeployer` for core K8s resources
3. Patching the Service, Deployment, and ConfigMap with OpenShift additions
4. Creating the Route and fetching the URL

This approach avoids replicating the full K8s deploy logic while adding all required OpenShift resources.

## Development

```bash
npm install
npm run build
```

## Documentation

- [Deploying on OpenShift](docs/deploy-openshift.md) -- full deployment guide
- [docs/examples/](docs/examples/) -- annotated YAML examples
