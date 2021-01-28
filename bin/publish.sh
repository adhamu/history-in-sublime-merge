#!/usr/bin/env bash

source .env

npx vsce publish patch --yarn -p $VS_MARKETPLACE_PAT
git push --tags
npx ovsx publish --yarn -p $OPEN_VSX_PAT
