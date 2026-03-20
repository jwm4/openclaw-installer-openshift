import type { Deployer, DeployConfig, DeployResult, LogCallback } from "@openclaw/installer/deployers/types";
/**
 * OpenShiftDeployer wraps KubernetesDeployer, adding:
 * - ServiceAccount with OAuth redirect annotation
 * - OAuth config secret (SA token + cookie secret)
 * - Service with additional oauth-ui port and serving-cert annotation
 * - Route (TLS edge-terminated, targeting oauth-ui)
 * - Deployment patches: oauth-proxy sidecar, serviceAccountName, OAuth volumes
 * - OpenClaw config patched with routeUrl for allowedOrigins + disabled device auth
 *
 * BUG FIX vs claw-installer: teardown() now deletes the Route.
 *
 * Design note: KubernetesDeployer doesn't expose hooks for manifest customization,
 * so this deployer lets K8s deployer create base resources, then patches the
 * Service, Deployment, and ConfigMap with OpenShift additions. This avoids
 * replicating the full deploy logic while still adding all required OpenShift
 * resources.
 */
export declare class OpenShiftDeployer implements Deployer {
    private k8s;
    deploy(config: DeployConfig, log: LogCallback): Promise<DeployResult>;
    start(result: DeployResult, log: LogCallback): Promise<DeployResult>;
    status(result: DeployResult): Promise<DeployResult>;
    stop(result: DeployResult, log: LogCallback): Promise<void>;
    teardown(result: DeployResult, log: LogCallback): Promise<void>;
}
