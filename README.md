# openclaw-installer-openshift (retired)

> **This repo was an experimental prototype and is now retired.** The OpenShift deployer plugin has been moved into the main installer repo at [`provider-plugins/openshift/`](https://github.com/sallyom/openclaw-installer/tree/main/provider-plugins/openshift).

## What happened

This repo originally implemented the OpenShift deployer as a separate npm package that plugged into [openclaw-installer](https://github.com/sallyom/openclaw-installer) via its deployer plugin system. It served as a proof-of-concept for the plugin architecture.

The plugin now ships as a built-in provider plugin inside the installer itself. No separate install is needed -- just `oc login` and start the installer.

## Where to go

- **OpenShift deployer source**: [`provider-plugins/openshift/`](https://github.com/sallyom/openclaw-installer/tree/main/provider-plugins/openshift) in openclaw-installer
- **Deploy guide**: [`provider-plugins/openshift/docs/deploy-openshift.md`](https://github.com/sallyom/openclaw-installer/tree/main/provider-plugins/openshift/docs/deploy-openshift.md)
- **Design ADR**: [`provider-plugins/openshift/adr/0001-openshift-deployer-plugin-design.md`](https://github.com/sallyom/openclaw-installer/tree/main/provider-plugins/openshift/adr/0001-openshift-deployer-plugin-design.md)
