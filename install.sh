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

npm install
