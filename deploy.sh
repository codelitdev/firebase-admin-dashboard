# Deploys everything to Firebase
# ==============================
#
# Note: make sure env variables are set on the server prior to deployment using
# firebase functions:config:set
cd adminapp
yarn buildncopy
cd ../
firebase deploy
