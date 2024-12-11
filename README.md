# pelican-cms

## How to use

### Local launch

Add a .env file based on .env.example

Install the required dependencies
```
npm ci
```
Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
```

To further enable Strapi successfully locally, run `docker-compose --profile db-only up -d` command to enable the database in docker.

Start your Strapi application. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
```

Start your Strapi application without s3. To work in this mode, you do not need to specify data from s3.
```
npm run start:no-s3
```

Go to http://localhost:1337/admin

### In Docker

#### Profiles
- local-run - runs cms app and the database
- db-only - runs only database

To enable Strapi and the database in Docker, run the command `docker-compose --profile local-run up -d`

Go to http://localhost:1337/admin

Link to full documentation: https://github.com/TourmalineCore/pelican-documentation/blob/master/README.md

