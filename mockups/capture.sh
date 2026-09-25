#!/usr/bin/env bash
# Re-render the concept-project screen designs into public/shots (needs Chrome). Usage: bash mockups/capture.sh [slug...]
cd "$(dirname "$0")/.."
CH="/c/Program Files/Google/Chrome/Application/chrome.exe"
root="$(cygpath -m "$PWD")"
for s in ${@:-aurum-estates noir-atelier vanta-motors halcyon-clinics kairos-horology solace-resorts}; do
  "$CH" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --user-data-dir="$TEMP\bf-shot" \
    --window-size=1440,1800 --virtual-time-budget=6000 --screenshot="$root/public/shots/$s.png" \
    "file:///$(cygpath -m "$PWD")/mockups/$s.html" 2>&1 | grep -o "[0-9]* bytes written.*"
done
# convert to webp (small files for the site)
npx -y sharp-cli@5 -i public/shots/*.png -o public/shots -f webp -q 82 >/dev/null && rm -f public/shots/*.png
