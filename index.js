let Plugin = require('gulp-query').Plugin
  , node_path = require('path')
  , stylus = require('gulp-stylus')
  , gulp = require('gulp')
  , gulpif = require('gulp-if')
  , rename = require('gulp-rename')
  , cssnano = require("gulp-cssnano")
  , sourcemaps = require('gulp-sourcemaps')
;

class StylusPlugin extends Plugin {

  static method() {
    return 'stylus';
  }

  run(task_name, config, callback) {

    let full = ('full' in config ? config['full'] : false);
    let path_to = this.path(config.to);
    let path_from = this.path(config.from);
    let includePaths = 'include' in config ? config['include'] : [];

    let autoprefixer = {
      browsers: ["> 1%", "last 2 versions"],
    };

    if ('autoprefixer' in config) {
      autoprefixer = config['autoprefixer'];
    }

    let sourceMap = ('source_map' in config ? config['source_map'] : true);
    let sourceMapType = ('source_map_type' in config ? config['source_map_type'] : 'inline');
    sourceMapType = sourceMapType === 'inline' ? 'inline-source-map' : 'source-map';

    if (this.isProduction()) {
      sourceMap = false;
    }

    let filename_from = node_path.basename(path_from);
    path_from = node_path.dirname(path_from) + '/';

    let filename_to;

    if (node_path.extname(path_to) !== '') {
      filename_to = node_path.basename(path_to);
      path_to = node_path.dirname(path_to) + '/';
    } else {
      let basename = node_path.basename(filename_from, '.styl');
      filename_to = basename === '*' ? '' : basename + '.css';
    }

    let list = [];

    if (sourceMap) {
      if (sourceMapType === 'source-map') {
        list.push('Source map: file');
      } else {
        list.push('Source map: inline');
      }
    }

    if (this.isProduction() && !full) {
      list.push('Compress');
    }

    includePaths = includePaths.map((name) => {
      return this.path(name);
    });

    let _src = path_from + filename_from;
    let _dest = path_to + filename_to;

    return gulp.src(_src)
      .pipe(this.plumber(this.reportError.bind(this, task_name, _src, _dest)))
      .pipe(gulpif(sourceMap, sourcemaps.init()))
      .pipe(stylus({
        paths: includePaths
      }))
      .pipe(gulpif(
        !full && this.isProduction(),
        cssnano({
          autoprefixer: autoprefixer
        })
      ))
      .pipe(gulpif(sourceMap, sourcemaps.write(
        (sourceMapType === 'inline-source-map' ? null : '.'),
        {includeContent: (sourceMapType === 'inline-source-map')}
      )))
      .pipe(gulpif(!!filename_to, rename(filename_to)))
      .pipe(gulp.dest(path_to))
      .pipe(this.notify(this.report.bind(this, task_name, _src, _dest, true, list)))
      ;

  }
}

module.exports = StylusPlugin;