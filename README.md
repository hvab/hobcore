# hobcore
> Simple markup builder to start new project

## Basic features
* Included Gulp v4.0
* Included Bower.
* Included Bootstrap v4.0.0-alpha.2 (with tether).
* Included jQuery 2.2.2.
* [SCSS (SASS)](http://sass-lang.com/) as a preprocessor for css. Sourcemaps is included. [PostCSS](https://github.com/postcss/postcss) with [autoprefixer](https://github.com/postcss/autoprefixer), postcss-import, postcss-assets.
* JavaScript with sourcemaps, gulp-rigger and gulp-uglify.
* HTML with gulp-rigger.

## Install
1. Clone repository
  ```
  $ git clone https://github.com/hobcode/hobcore
  ```
  or without project folder
  ```
  $ git clone https://github.com/hobcode/hobcore .
  ```

2. Install node modules.
  ```
  $ npm install
  ```

3. Install bower globally and components.
  ```
  $ npm install -g bower
  $ bower install
  ```

## Usage
Basic developer usage
```
$ export PATH=./node_modules/.bin:$PATH
$ export NODE_ENV=development
$ gulp
```
Production
```
$ NODE_ENV=production gulp
```
or just build `dist` without run server
```
$ NODE_ENV=production gulp build
```
