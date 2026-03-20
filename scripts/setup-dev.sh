#!/usr/bin/env bash
set -euo pipefail

# Development setup script for openclaw-installer + openclaw-installer-openshift
# Run from the openclaw-installer-openshift directory.
# Expects openclaw-installer to be cloned alongside this repo (../openclaw-installer).

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
INSTALLER_DIR="$(cd "$PLUGIN_DIR/../openclaw-installer" 2>/dev/null && pwd)" || true

RED='\033[0;31m'
GREEN='\033[0;32m'
BOLD='\033[1m'
RESET='\033[0m'

step() { echo -e "\n${BOLD}→ $1${RESET}"; }
ok()   { echo -e "${GREEN}✓ $1${RESET}"; }
fail() { echo -e "${RED}✗ $1${RESET}"; exit 1; }

# Check prerequisites
command -v node >/dev/null 2>&1 || fail "node is not installed"
command -v npm >/dev/null 2>&1  || fail "npm is not installed"

# Check installer repo exists
if [ -z "$INSTALLER_DIR" ] || [ ! -f "$INSTALLER_DIR/package.json" ]; then
  step "Cloning openclaw-installer alongside this repo..."
  git clone https://github.com/sallyom/openclaw-installer.git "$PLUGIN_DIR/../openclaw-installer"
  INSTALLER_DIR="$(cd "$PLUGIN_DIR/../openclaw-installer" && pwd)"
fi
ok "Installer repo: $INSTALLER_DIR"

# Build installer
step "Installing and building openclaw-installer..."
cd "$INSTALLER_DIR"
npm install
npm run build
ok "Installer built"

# Build plugin
step "Installing and building openclaw-installer-openshift..."
cd "$PLUGIN_DIR"
npm install
npm run build
ok "Plugin built"

# Link plugin into installer
step "Linking plugin into installer..."
cd "$PLUGIN_DIR"
npm link
cd "$INSTALLER_DIR"
npm link openclaw-installer-openshift
ok "Plugin linked"

# Verify
if [ -L "$INSTALLER_DIR/node_modules/openclaw-installer-openshift" ]; then
  ok "Symlink verified in node_modules"
else
  fail "Symlink not found — npm link may have failed"
fi

echo ""
echo -e "${GREEN}${BOLD}Setup complete!${RESET}"
echo ""
echo "To start the dev server:"
echo "  cd $INSTALLER_DIR"
echo "  npm run dev"
echo ""
echo "To test with OpenShift, log in first:"
echo "  oc login --server=https://api.your-cluster.example.com:6443"
