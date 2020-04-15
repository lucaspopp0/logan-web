#!/bin/bash
BCYAN='\033[1;36m'
RESET='\033[0m'

# Set up exit error handling
set -e
oldwd=$(pwd)
trap "cd '$oldwd'" EXIT

# Navigate to the appropriate directory (.../Logan/logan-web)
cd $(dirname "$0")
cd ..

# Do the stuff
echo
echo -e -n "${BCYAN}Building project:${RESET}"
npm run build-for-deployment
echo
echo -e "${BCYAN}Build complete. Clearing AWS bucket:${RESET}"
aws s3 rm s3://logan-web/ --recursive
echo
echo -e "${BCYAN}Bucket cleared. Uploading new files:${RESET}"
aws s3 cp dist s3://logan-web/ --recursive --exclude ".DS_Store" --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers
echo
echo -e "${BCYAN}Deployment complete!${RESET}"
echo
exit