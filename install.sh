source ~/.nvm/nvm.sh

# jump to project root
cd $(dirname $0)

# use correct npm and install dependencies
nvm install
nvm use

# create .env from .env.example
if [ ! -f ./.env ]; then
    cp ./.env.example ./.env
fi

# create api symlinks
rm -f ./services/api/.env
ln -s ./../../.env ./services/api/.env
rm -f ./services/api/.npmrc
ln -s ./../../.npmrc ./services/api/.npmrc

# create site symlinks
rm -f ./services/site/.env
ln -s ./../../.env ./services/site/.env
rm -f ./services/site/.npmrc
ln -s ./../../.npmrc ./services/site/.npmrc

# create submission-checker symlinks
rm -f ./services/submission-checker/.env
ln -s ./../../.env ./services/submission-checker/.env
rm -f ./services/submission-checker/.npmrc
ln -s ./../../.npmrc ./services/submission-checker/.npmrc

# create submission-renderer symlinks
rm -f ./services/submission-renderer/.env
ln -s ./../../.env ./services/submission-renderer/.env
rm -f ./services/submission-renderer/.npmrc
ln -s ./../../.npmrc ./services/submission-renderer/.npmrc

# create nestjs-aws-messaging symlinks
rm -f ./packages/nestjs-aws-messaging/.env
ln -s ./../../.env ./packages/nestjs-aws-messaging/.env
rm -f ./packages/nestjs-aws-messaging/.npmrc
ln -s ./../../.npmrc ./packages/nestjs-aws-messaging/.npmrc

npm install