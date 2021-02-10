# OLAC Visualisation - V2

See the app in action: [https://language-archives.services/olacvis/](https://language-archives.services/olacvis/)

This application is a visualisation of the language resources at the OLAC site ([http://www.language-archives.org/](http://www.language-archives.org/)). The app
is a VueJS SPA (set up using [Vue cli](https://cli.vuejs.org/)).

- [OLAC Visualisation - V2](#olac-visualisation---v2)
  - [Repo structure](#repo-structure)
  - [Setting up for development](#setting-up-for-development)
  - [Running the data processor](#running-the-data-processor)
    - [Normal operation: download files, extract data and create indexes](#normal-operation-download-files-extract-data-and-create-indexes)
  - [Running in development mode](#running-in-development-mode)
  - [Deploying to production](#deploying-to-production)

## Repo structure

There are two parts to this app:

1. the data processor in `./data-processor`
2. the Vue app itself in `./src`

## Setting up for development

To set up for development you first need to run a harvest of the OLAC site so you have
some data to work with. Note that this can take a while to run. See the next section for
how to do this.

## Running the data processor

The data processor is a node script that scrapes the OLAC site and produces JSON data structures that the app consumes.

### Normal operation: download files, extract data and create indexes

```
> cd data-processor
> node . --folder ../data
```

Be sure to run it exactly like this for development as the repo is set up to put the data files in the
correct place for the app to find them.

Options:

- --verbose (default: false): log what it's doing
- --download (default: true): download datafiles. Set this to false and it won't download files. Only those that are already downloaded will be processed.
- --extract (default: true): process html files that have been downloaded and extract the data into a JSON data structure

## Running in development mode

```
npm run serve
```

## Deploying to production

Build the application: `npm run build` then deploy the built bundle to your server. Once you've done that
copy the data produced by the data processor to a folder named repository within your web root.
