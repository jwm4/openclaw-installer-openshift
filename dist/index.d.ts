export { OpenShiftDeployer } from "./openshift-deployer.js";
export { isOpenShift } from "./detection.js";
export { applyRoute, getRouteUrl, deleteRoute } from "./route.js";
export { oauthProxyContainer, oauthServiceAccount, oauthConfigSecret } from "./oauth-proxy.js";
/**
 * Plugin registration object.
 *
 * When openclaw-installer loads this plugin, it calls register() to add
 * the "openshift" deploy mode to the deployer registry.
 *
 * The detect() function probes the cluster for the route.openshift.io API
 * group. When detected, the installer can auto-select this deployer.
 */
declare const plugin: {
    register(registry: import("@openclaw/installer/deployers/registry").DeployerRegistry): void;
};
export default plugin;
