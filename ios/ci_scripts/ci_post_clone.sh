#!/bin/sh

set -e
echo "Running ci_post_clone.sh"

# cd out of ios/ci_scripts into main project directory
cd ../../

# install node and cocoapods
brew install node cocoapods
npm install

npx expo prebuild