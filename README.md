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


To further enable Strapi successfully locally, run `docker-compose up -d --profile db-only` command to enable the database in docker.


### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```
### In Docker
To enable Strapi and the database in Docker, run the command `docker-compose up -d --profile local-run`

Link to full documentation: https://github.com/TourmalineCore/pelican-documentation/blob/master/README.md

