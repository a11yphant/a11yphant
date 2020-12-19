
# jump to project root
cd $(dirname $0)

# create .env from .env.example
if [ ! -f ./.env ]; then
    cp ./.env.example ./.env
fi

# create api symlinks
rm -f ./services/api/.env
ln -s ./../../.env ./services/api/.env
