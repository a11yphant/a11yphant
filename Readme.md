# A11y Challenges

![coverage](https://gitlab.mediacube.at/a11yphant/a11yphant/badges/develop/coverage.svg)

## Important Notice:

You must have Node installed via `nvm` for this project to work correctly 
([Setup Instructions](https://github.com/nvm-sh/nvm#installing-and-updating))


## Prerequisites

- Create an access token for the GitLab API. This will be required to install our private NPM packages.  
Link to the GitLab settings: [Manage GitLab Access Tokens](https://gitlab.mediacube.at/-/profile/personal_access_tokens)

## Setup

```sh
# log in to the GitLab NPM registry
npm run gitlab-registry:login YOUR_GITLAB_ACCESS_TOKEN

# Install correct node version, install packages, create symlinks
./install.sh
```

### Recommendation:

It is recommended to add one of the following scripts to your .bashrc or .zshrc.
This script changes to the correct Node version automatically when entering this project.
These scripts originate directly from the nvm documentation:

- bash: [https://github.com/nvm-sh/nvm#bash](https://github.com/nvm-sh/nvm#bash)
- zsh: [https://github.com/nvm-sh/nvm#zsh](https://github.com/nvm-sh/nvm#zsh)

## Start

### All Services:

#### Background

Start all services in the background with pm2:

```sh
npm start

or

npm run dev
```

Look into the logs of an individual service:

```sh 
# api
npm run debug:api

# site
npm run debug:site
```

Stop all services:

```sh 
npm run stop
```

#### Foreground

Start all services in the foreground:

```sh 
npm run dev:no-daemon
```

### Start individual services

The `npm run dotenv` part injects all env vars to the cli context.
Thereby it is possible to wait for other services before starting a service.
(e.g. `site` only starts when `api` has been started successfully because it depends on a working api)

```
# api
npm run dotenv -- npm run dev:api

# site
npm run dotenv -- npm run dev:site
```

## Useful pm2 Commands

##### Note:

You have to install pm2 globally using `npm i -g pm2` before these work

```sh 
# Show all running services
pm2 list

# Synchronize running services (sometimes the list is out of sync)
pm2 save 
# if this does not help
pm2 save --force

# Show logs (same as npm run debug:<service-name>)
pm2 logs <pm2-service-name>

# Stop all services
pm2 stop all

# Stop individual service
pm2 stop <pm2-service-name>

# Delete all services
pm2 del all

# Delete individual service
pm2 del <pm2-service-name>
```
