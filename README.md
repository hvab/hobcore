# hobcore
> Simple markup builder to start new project

![dependencies](https://david-dm.org/hobcode/hobcore.svg)

## Basic features
* Included Gulp v4.0
* Included Bower.
* Included Bootstrap v4.0.0-alpha.2 (with tether).
* Included jQuery 2.2.2.
* [SCSS (SASS)](http://sass-lang.com/) as a preprocessor for css. Sourcemaps is included. [PostCSS](https://github.com/postcss/postcss) with [autoprefixer](https://github.com/postcss/autoprefixer), postcss-import, postcss-assets.
* JavaScript with sourcemaps, gulp-rigger and gulp-uglify.
* HTML with gulp-nunjucks.

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
/project1/src
/project2/src
```
use the gulp CLI option `--cwd`:
```sh
gulp --cwd project1
```

## Project structure

```sh
common      # Common blocks for entire project
mixins      # SCSS mixins
pages       # Blocks for pages
templates   # Nunjucks templates
vendors     # Vendor dependencies with configs, static files and fonts
```

Example
```sh
common/
  _variables.scss             # authored variables
  header/
    _header.scss              # include in main.scss
    _header.js                # include in main.js
    header.png                # copy to dist/images
  footer/
  nav/
  page/
  text/
mixins/
  _mixins.scss                # include in main.scss
pages/
  index/
    index.html                # compile with Nunjucks and copy to dist/
    _index.scss
    banner/
      _banner.scss
      _banner.js
      banner.png
      banner.mp4              # copy to dist/assets
templates/
  _nav.html                   # include by Nunjucks templates
  base.html                   # include by pages (about.html)
vendors/
  _bootstrap-variables.scss   # redefine bootstrap variables
  _bootstrap.scss             # customize bootstrap components
  fancybox/
    _fancybox.scss
    fancybox.png
  fonts/
    rubl/
      _rubl.scss              # include in main.scss
      rubl.eot                # copy to dist/assets
```
