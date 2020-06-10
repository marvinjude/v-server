## Build Status

[![Build Status](https://travis-ci.com/marvinjude/v-server.svg?branch=master)](https://travis-ci.com/marvinjude/v-server)

## Setup

```
yarn
```

## Populate Database

Insert data from this [sheet](https://docs.google.com/spreadsheets/d/1bByA1JuYcawBhg9houYOvraBTYt22LjX8jhhDfUxVNM/edit#gid=2036834724) 2000 records at a time

```
yarn populate-db
```

## Development

Run dev server without delay

```
yarn dev
```

To start the dev server with some response delay which defaults to `2000ms` run:

```
yarn dev:delay
```

You can change the default delay in `package.json`
