# EyeCue Lab Spring 2023 Internship

 [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Socket.io Server

From your terminal:
Navigate to the app/server directory and run the following command.

```sh
$ node discussion.server.ts
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```

## Fly Setup

1. [Install `flyctl`](https://fly.io/docs/getting-started/installing-flyctl/)

2. Sign up and log in to Fly

```sh
flyctl auth signup
```

3. Setup Fly. It might ask if you want to deploy, say no since you haven't built the app yet.

```sh
flyctl launch
```

This starts your app in development mode, rebuilding assets on file changes.

4. Set your .env variable in your fly secrets.

```sh
flyctl secrets list
```
The flyctl secrets unset command will clear one or more secret values.
```sh
flyctl secrets unset MY_SECRET DATABASE_URL
```
The flyctl secrets set command will set one or more application secrets then perform a release.
```sh
flyctl secrets set DATABASE_URL=postgres://example.com/mydb 
```

## Deployment

If you've followed the setup instructions already, all you need to do is run this:

```sh
npm run deploy
```
***
***** If you get this error on build => ERROR [internal] load remote build context *****

***** Change the "deploy": script in the package.json to --local-only and make sure to have a docker daemon running. *****
***

You can run `flyctl info` to get the url and ip address of your server.

Check out the [fly docs](https://fly.io/docs/getting-started/node/) for more information.