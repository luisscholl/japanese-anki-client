# Villosum

This is an application for learning Japanese vocabulary. You need to install Villosum on on your computer, where Villosum will serve as a synchronization server between itself and other devices on which you want to use Villosum.

## Current State

The project is work-in-progress. It is not usable yet.

Styling is optimized for iPhone SE (2020) only.

## Architecture

The architecture is an Angular progressive web app frontend + an ExpressJS backend. The twist is that both are packaged within an Electron app.

This means that users will host their own backend without requiring technical knowledge. This comes with the following benefits:

* no costs are generated, meaning Villosum can stay and make use of free software
* no one needs to manage a platform and its user content
* users own their data by default

## Development

### Installation

Prerequisites: curl, Swiss File Knife, Git, Node, npm

Run ```npm install && npm install -g concurrently``` to setup a development environment.

Run ```npm start``` to start the Electron app and the development server of the frontend localhost:4200. Note that the frontend, which runs inside of the Electron app uses the latest build, which you can generate with ```npm run build``` in the client folder. This - most of the time outdated - version of the frontend can also be accessed at localhost:80.

## Licenses

This project is built upon various open source project (which include copyleft licenses). See https://github.com/luisscholl/japanese-anki-client/blob/master/linceses/COPYING.txt for more details about licenses concerning this project.