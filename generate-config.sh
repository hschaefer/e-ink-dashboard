#!/bin/sh
# Generate the config.js file dynamically at container launch from environment variables
cat <<EOF > /usr/share/nginx/html/config.js
window.EINK_ENV = {
  THEME: "${EINK_THEME:-${THEME:-light}}",
  SCENARIO: "${EINK_SCENARIO:-${SCENARIO:-springShowers}}",
  SHOW_CONTROLS: "${EINK_SHOW_CONTROLS:-${SHOW_CONTROLS:-true}}"
};
EOF
echo "Generated config.js for E-Ink screen with settings:"
echo "- THEME: ${EINK_THEME:-${THEME:-light}}"
echo "- SCENARIO: ${EINK_SCENARIO:-${SCENARIO:-springShowers}}"
echo "- SHOW_CONTROLS: ${EINK_SHOW_CONTROLS:-${SHOW_CONTROLS:-true}}"
