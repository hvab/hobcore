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
```sh
git clone https://github.com/hobcode/hobcore.git new-project
cd new-project
npm install
```
`bower` dependencies are installed in the `libs` directory by `npm postinstall`.

## Usage
Basic developer usage
```sh
export PATH=./node_modules/.bin:$PATH
export NODE_ENV=development
gulp
```

Production
```sh
NODE_ENV=production gulp
```
or just build `dist` without run server
```sh
NODE_ENV=production gulp build
```

Deploy to FTP
```sh
NODE_ENV=production gulp deploy
```

For multiple projects with nested directory structure, such as:
```
/projects
  /layer1/src
  /layer2/src
```
use the gulp CLI option `--cwd`:
```sh
gulp --cwd projects/layer1
```
Dont't forget to change pathes to bower components, for example
```scss
@import "../libs/bootstrap/scss/bootstrap.scss";
```
to
```scss
@import "../../../libs/bootstrap/scss/bootstrap.scss";
```
