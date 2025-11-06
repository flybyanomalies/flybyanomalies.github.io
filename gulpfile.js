const gulp = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const gulpSass = require('gulp-sass')(require('sass')); 
const postcss = require('gulp-postcss');
const mqpacker = require('css-mqpacker');
const sourcemaps = require('gulp-sourcemaps'); // ソースマップ用
const pug = require('gulp-pug');
const rename = require('gulp-rename'); // PHP用
const pugPHPFilter = require('pug-php-filter'); // PHP用フィルタ

// パス設定
const paths = {
  pug: './src/pug/**/*.pug',         // Pugファイル
  pugExclude: '!./src/pug/**/_*.pug', // 部分ファイルを除外
  html: './',                   // 出力先ディレクトリ（HTML）
  php: './dest/',                    // 出力先ディレクトリ（PHP）
  scss: './src/scss/**/*.scss',      // SCSSファイル
  css: './assets/css/'          // 出力先ディレクトリ（CSS）
};

// SCSSをコンパイル（ソースマップ付き）
gulp.task('sass', function () {
  const plugins = [
    mqpacker() // メディアクエリをまとめる
  ];

  return gulp
    .src(paths.scss)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sourcemaps.init()) // ソースマップを初期化
    .pipe(gulpSass({ outputStyle: 'expanded' })) // SCSSをコンパイル
    .pipe(postcss(plugins)) // PostCSSを適用
    .pipe(sourcemaps.write('./')) // ソースマップを出力
    .pipe(gulp.dest(paths.css)); // 出力
});

// PugをHTMLにコンパイル
gulp.task('pug', function () {
  return gulp
    .src([paths.pug, paths.pugExclude]) // 部分ファイルを除外
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(pug({
      pretty: true, // インデントを整えたHTMLを出力
      basedir: './src/pug' // basedirを指定
    }))
    .pipe(gulp.dest(paths.html)); // 出力
});

// PugをPHPにコンパイル（コメントアウト：必要時に有効化）
/*
gulp.task('pug-php', function () {
  return gulp
    .src([paths.pug, paths.pugExclude]) // 部分ファイルを除外
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(pug({
      pretty: true,
      filters: {
        php: pugPHPFilter // PHPフィルタを適用
      }
    }))
    .pipe(rename({ extname: '.php' })) // 拡張子を .php に変更
    .pipe(gulp.dest(paths.php)); // 出力
});
*/

// ファイルの変更を監視
gulp.task('watch', function () {
  gulp.watch(paths.scss, gulp.series('sass')); // SCSSの変更を監視
  gulp.watch(paths.pug, gulp.series('pug'));  // Pugの変更を監視
  // PHP対応時は以下を有効化
  // gulp.watch(paths.pug, gulp.series('pug-php'));
});

// デフォルトタスク
gulp.task('default', gulp.parallel('watch'));