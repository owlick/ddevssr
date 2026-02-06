import gulp from 'gulp'
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sasslint from 'gulp-sass-lint';
import eslint from 'gulp-eslint-new';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import imagemin from 'gulp-imagemin';

const sass = gulpSass(dartSass);

const SASS = 'sass';
const CSS = 'css';
const IMG = 'img';
const JS = 'js';

const sassOptions = {
  includePaths: ['./node_modules/breakpoint-sass/stylesheets']
};

// Tasks.
gulp.task('sass', done => {
  gulp.src(SASS + '/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass.sync(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer({}))
    .pipe(sourcemaps.write('../css'))
    .pipe(gulp.dest(CSS));
  done();
});

gulp.task('sass-lint', done => {
  gulp.src(SASS + '/**/*.scss')
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
  done();
});

gulp.task('js-lint', done => {
  gulp.src(JS + '/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  done();
});

gulp.task('imagemin', done => {
  gulp.src(IMG + '/src/*', { encoding: false })
    .pipe(imagemin())
    .pipe(gulp.dest(IMG));
  done();
});

// Build without lint.
gulp.task('build', gulp.series('sass', 'imagemin'));
gulp.task('watch', () => gulp.watch(SASS + '/**/*.scss', gulp.series(gulp.series('sass', 'imagemin'))));

// Build with lint.
gulp.task('build-lint', gulp.series('sass-lint', 'sass', 'imagemin', 'js-lint'));
gulp.task('watch-lint', () => gulp.watch(SASS + '/**/*.scss', gulp.series(gulp.series('sass-lint', 'sass', 'imagemin', 'js-lint'))));
gulp.task('lint', gulp.series('build-lint', 'watch-lint'));

// Default task.
gulp.task('default', gulp.series('build', 'watch'));
