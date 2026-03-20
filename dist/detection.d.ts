/**
 * Check whether the cluster has the route.openshift.io API group,
 * indicating it's an OpenShift cluster.
 */
export declare function isOpenShift(): Promise<boolean>;
