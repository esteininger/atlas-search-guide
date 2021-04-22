# MongoDB Autocomplete

This application uses MongoDB's Autocomplete feature to display potential autocomplete matches in the search input field.

Learn more about MongoDB's [Autocomplete](https://docs.atlas.mongodb.com/reference/atlas-search/autocomplete/).

https://user-images.githubusercontent.com/23062728/115612913-c86a6f00-a2b9-11eb-9981-0fcd25ece29c.mov



## Environment

Copy `sample.env.local` to `.env.local` to make this configuration accessible to client and/or server-side code.

Learn more about [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables) in Next.js.

## Development

Start the server in development mode with hot-code reloading.

```bash
npm run dev
```

## Production

Start the application in production mode.

```bash
npm start
```
_The default Next.js `start` script has been updated to first build the application._

## Notes

In both development and production the application will start at http://localhost:3000 by default. The default port can be changed with `-p` in the `dev` and `start:prod` scripts in `package.json`, like:
```bash
...
"scripts": {
    "dev": "next -p 4000",
    ...
    "start:prod": "next start -p 4000",
    ...
  }
...
```

## Author
Reach out to (Isa Torres)[https://github.com/isamarietr] for help
