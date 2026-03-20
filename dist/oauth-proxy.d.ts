import * as k8s from "@kubernetes/client-node";
export declare function oauthProxyContainer(ns: string): k8s.V1Container;
export declare function oauthServiceAccount(ns: string): k8s.V1ServiceAccount;
export declare function oauthConfigSecret(ns: string): Promise<k8s.V1Secret>;
