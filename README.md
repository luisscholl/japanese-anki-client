# Villosum

This is an application for learning Japanese vocabulary.

## Current State

The project is work-in-progress. It is not usable yet.

Styling is optimized for iPhone SE (2020) only.

## Development

### Installation

Prerequisites: curl, Swiss File Knife, Git, Node, npm, Docker

Run ```./setup-development.sh``` to setup a development environment.

### Create a user

Create a user manually, e.g. for testing purposes:

```bash
curl -X PUT http://localhost:5984/_users/org.couchdb.user:<username> \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46YWRtaW4=" \
  -d '{"name": "<username>", "password": "<password>", "roles": [], "type": "user"}' 
```

## Licenses

This project is built upon various open source project (which include copyleft licenses). See https://github.com/luisscholl/japanese-anki-client/blob/master/linceses/COPYING.txt for more details about licenses concerning this project.