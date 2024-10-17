# pelican-cms

## How to use
### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

### Local launch


To further enable Strapi successfully locally, run `docker-compose --profile db-only up -d` command to enable the database in docker.


### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```
### In Docker
#### Profiles
- local-run - runs cms app and the database
- db-only - runs only database

To enable Strapi and the database in Docker, run the command `docker-compose --profile local-run up -d`

Link to full documentation: https://github.com/TourmalineCore/pelican-documentation/blob/master/README.md

