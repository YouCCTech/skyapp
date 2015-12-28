# Welcome to Skyapp
Skyapp is a web mobile Chat app for Skype for Business but with features like Whatsapp application.

Skyapp is build on Ionic framework and uses the Skype Web API from microsoft, The application degisned to give the look and feel of a Whatsapp app which means: adding an abstruction layer for: persistent conversations, group chats, etc.

## Contributing
Want to help Skyapp? Great! We welcome pull requests, follow these steps to contribute:
1. Check the Issues tab.
2. Pick an issue that nobody has claimed and start working on it. If your issue isn't on board, open an issue.
3. Fork the project. work on your forked copy.
4. Create a branch specific to the issue or feature you are working on. Push your work to that branch.
5. Name the branch something like ```fix/xxx``` or ```feature/xxx``` where ```xxx``` is a short description of the changes or feature you are attempting to add.
6. You should have ESLint running in your editor to verify your code pass the Javascript Style rules.
7. Once your code is ready, submit a pull request from your branch. We'll do a quick code review and give you a feedback.

## Questions?
Feel free to contact me [@oryanmi](http://www.twitter.com/oryanmi) or email [corp@youcc.net](mailto:corp@youcc.net)

## Install
This project was generated with Generator-M-Ionic v1.4.1. For more info visit the [repository](https://github.com/mwaylabs/generator-m-ionic)

### Prerequisites
- Installation of:
- node & npm - http://nodejs.org/download/
  - yo: `npm install --global yo` - http://yeoman.io/
  - gulp: `npm install --global gulp` - http://gulpjs.com/
  - bower: `npm install --global bower` - http://bower.io/
  - Ionic: http://ionicframework.com/

## Get started
Since all the NPM and Bower files are excluded from git, you need to install all of them when you start with a fresh clone of your project. In order to do so, run the following commands in that order:
```sh
npm install # installs all node modules including cordova, gulp and all that
bower install # install all bower components including angular, ionic, ng-cordova, ...
gulp --cordova 'prepare' # install all cordova platforms and plugins from the config.xml
```
#### gulp watch
Prepares everything for development and opens your default browser.
```sh
gulp watch
```
#### gulp build
Builds into www.
```sh
gulp watch-build
```

###### For more info about all gulp tasks and options visit the [generator-m-ionic repository](https://github.com/mwaylabs/generator-m-ionic)

---

## License
MIT.
