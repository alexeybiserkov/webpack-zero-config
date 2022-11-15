const gulp = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserify = require('browserify');
const buffer = require('gulp-buffer');
const csso = require('gulp-csso');
const esLint = require('gulp-eslint');
const gulpIf = require('gulp-if');
const minify = require('gulp-babel-minify');
const mode = require('gulp-mode')({
    modes: ['prd', 'dev'],
    default: 'prd',
    verbose: false,
});
const sass = require('gulp-sass')(require('sass'));
const size = require('gulp-filesize');
const sourcemaps = require('gulp-sourcemaps');
const svgmin = require('gulp-svgmin');
const styleLint = require('gulp-stylelint');
const tap = require('gulp-tap');

const path = {
    srcFonts: 'src/js',
    distFonts: 'dist/js',
    srcImg: 'src/img',
    distImg: 'dist/img',
    srcStyles: 'src/sass',
    distStyles: 'dist/css',
    srcScripts: 'src/js',
    distScripts: 'dist/js',
};

/* ----------------------------- CSS tasks ---------------------------- */
gulp.task('sass', () => {
    return gulp.src([
        `${path.srcStyles}/*.scss`,
        `${path.srcStyles}/shortcodes/*.scss`,
        `${path.srcStyles}/taco-elements/*.scss`,
    ], { base: path.srcStyles })
        .pipe(mode.dev(sourcemaps.init()))
        .pipe(sass({ errLogToConsole: true }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(mode.dev(sourcemaps.write('./')))
        .pipe(gulp.dest(path.distStyles))
        .pipe(size());
});

gulp.task('styleLint', () => {
    return gulp.src([
        `${path.srcStyles}/**/*.scss`,
    ])
        .pipe(styleLint({
            reporters: [
                { formatter: 'string', console: true },
            ],
        }));
});

gulp.task('styleLintFix', () => {
    return gulp.src(`${path.srcStyles}/**/*.scss`)
        .pipe(styleLint({
            fix: true,
            reporters: [
                { formatter: 'string', console: true },
            ],
        }))
        .pipe(gulp.dest(path.srcStyles));
});

/* ----------------------------- JS tasks ----------------------------- */
gulp.task('js', () => {
    return gulp.src([
        `${path.srcScripts}/*.js`,
        `${path.srcScripts}/shortcodes/*.js`,
        `${path.srcScripts}/taco-elements/*.js`,
    ], { read: false, base: path.srcScripts }) // no need of reading file because browserify does.

        // transform file objects using gulp-tap plugin
        .pipe(tap((file) => {
            // replace file contents with browserify's bundle stream
            // eslint-disable-next-line no-param-reassign
            file.contents = browserify(file.path, { debug: true }).bundle();
        }))

        // transform streaming contents into buffer contents
        // (because gulp-sourcemaps does not support streaming contents)
        .pipe(buffer())

        .pipe(mode.dev(sourcemaps.init({ loadMaps: true })))

        .pipe(babel({
            presets: [
                [
                    '@babel/preset-env', {
                        targets: {
                            chrome: '70',
                            safari: '13',
                            firefox: '52',
                            edge: '16',
                            samsung: '7',
                        },
                    },
                ],
            ],
        }))

        .pipe(minify({
            mangle: {
                keepClassName: true,
            },
            builtIns: false,
        }))

        .pipe(mode.dev(sourcemaps.write('./')))
        .pipe(gulp.dest(path.distScripts))
        .pipe(size());
});

gulp.task('copyJsLib', () => {
    return gulp.src([`${path.srcScripts}/lib/*.js`], { base: path.srcScripts })
        .pipe(gulp.dest(path.distScripts))
        .pipe(size());
});

gulp.task('esLint', () => {
    return gulp.src([
        `${path.srcScripts}/**/*.js`,
        `!${path.srcScripts}/**/*.min.js`,
    ])
        .pipe(esLint({
            configFile: './.eslintrc',
        }))
        .pipe(esLint.format());
});

gulp.task('esLintFix', () => {
    function isFixed(file) {
        return file.eslint != null && file.eslint.fixed;
    }

    return gulp.src([
        `${path.srcScripts}/**/*.js`,
        `!${path.srcScripts}/**/*.min.js`,
    ])
        .pipe(esLint({
            configFile: './.eslintrc',
            fix: true,
        }))
        .pipe(esLint.format())
        .pipe(gulpIf(isFixed, gulp.dest(path.srcScripts)));
});

/* ----------------------------- Image tasks ---------------------------- */
gulp.task('svg', () => {
    return gulp.src(`${path.srcImg}/svg/**/*.svg`)
        .pipe(svgmin())
        .pipe(gulp.dest(path.distImg))
        .pipe(size());
});

gulp.task('img', () => {
    return gulp.src([`${path.srcImg}/**/*.png`, `${path.srcImg}/**/*.ico`], { base: path.srcImg })
        .pipe(gulp.dest(path.distImg))
        .pipe(size());
});

/* ----------------------------- Copy Fonts ---------------------------- */
gulp.task('fonts', () => {
    return gulp.src('./src/fonts/*')
        .pipe(gulp.dest('./dist/fonts'))
        .pipe(size());
});

/* -------------------------- WATCH, BUILD, DEFAULT -------------------------- */
// Watch command
gulp.task('watch', () => {
    gulp.watch([`${path.srcStyles}/**/*.scss`], gulp.parallel('styleLint', 'sass'));
    gulp.watch([`${path.srcScripts}/**/*.js`], gulp.parallel('esLint', 'js'));
    gulp.watch([`${path.srcImg}/svg/**/*.svg`], gulp.parallel('svg'));
});

// Build command
gulp.task('build', gulp.parallel(
    'styleLint',
    'sass',
    'esLint',
    'js',
    'copyJsLib',
    'svg',
    'img',
    'fonts',
));

// Default
gulp.task('default', gulp.series('build', 'watch'));
