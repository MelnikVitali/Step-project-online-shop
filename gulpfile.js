const gulp = require('gulp'), // Connect gulp
    sass = require('gulp-sass'), // Connect the Sass package
    browserSync = require('browser-sync'), // Connect Browser Sync
    concat = require('gulp-concat'), // Connect gulp-concat (to concatenate files)
    uglify = require('gulp-uglifyjs'), // Connect gulp-uglifyjs (for JS compression)
    cssnano = require('gulp-cssnano'), // Connect package (for minification of CSS)
    rename = require('gulp-rename'), // Connect the library to rename files
    del = require('del'), // Connect the library to delete files and folders
    babel = require('gulp-babel'),
    plumber= require('gulp-plumber'),// prevents thread interruption in case of error
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'), // Connect the library for working with images
    pngquant = require('imagemin-pngquant'), // Connect library for work with png
    cache = require('gulp-cache'), // Connect the caching library
    autoprefixer = require('gulp-autoprefixer');//Connect the library to automatically add prefixes

gulp.task('sass', () => { // Create Task Sass
    return gulp.src('src/scss/**/*.scss') //  Take a source
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))//Convert(compressed)Sass to CSS
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))// Create Prefixes
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/css')) // Upload result to src / css folder
        .pipe(browserSync.reload({stream: true})) // Updating CSS on the page when changing
});

gulp.task('browser-sync',  () => { //Create a browser-sync task
    browserSync({ // Running browserSync
        server: { // assign server parameters
            baseDir: 'src' // Directory for server - src
        },
        notify: false // Turn off notifications
    });
});

gulp.task('libsJs', () => {
    return gulp.src([ // Take all the necessary libraries
        'node_modules/jquery/dist/jquery.min.js', // Take jQuery
        'node_modules/axios/dist/axios.min.js',
        'node_modules/popper.js/dist/umd/popper.min.js',// Take popper.js
        'node_modules/bootstrap/dist/js/bootstrap.min.js' //Take bootstrap
    ])
        .pipe(concat('libs.min.js')) // Putting them together in the new libs.min.js file
        .pipe(gulp.dest('src/js')); // Upload to src / js folder
});

gulp.task('scripts', () => {//Take all js files from src/js/ folder
    return gulp.src(['src/js/**/*.js', '!src/js/**/*.min.js'])//exclude min.js files
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))// Putting them together in the new main.min.js file
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/js'))// Upload to src / js folder
        .pipe(browserSync.reload({stream: true})) // Updating js on the page when changing
});

gulp.task('code', () => {
    return gulp.src('src/*.html')
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('css-libs', () => {
    return gulp.src('src/scss/libs.scss') // Select a file for minification
        .pipe(sass()) // Convert Scss to CSS with gulp-sass
        .pipe(cssnano()) // compress
        .pipe(rename({suffix: '.min'})) // Add the suffix .min
        .pipe(gulp.dest('src/css')); // Upload to src / css folder
});

gulp.task('img', () => {
    return gulp.src('src/img/**/*') // take all the images from src
        .pipe(cache(imagemin({ // Compress them with the best caching options
            // .pipe(imagemin({ // without caching!!!
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))/**/)
        .pipe(gulp.dest('dist/img')); // Unload on production
});

gulp.task('icons',() => {// unload fonts fontawesome from node_modules
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest('src/webfonts/')) // Download the result to the src/webfonts/folder
        .pipe(gulp.dest('dist/webfonts/'))
});

gulp.task('prebuild', async () => {
    gulp.src([ // Transfer libraries to production
        'src/css/main.min.css',
        'src/css/libs.min.css'
    ])
        .pipe(gulp.dest('dist/css'));

    gulp.src('src/fonts/**/*') // Transfer fonts to production
        .pipe(gulp.dest('dist/fonts'));

    gulp.src('src/js/main.min.js') //Transfer scripts to production
        .pipe(uglify())//compressed js
        .pipe(gulp.dest('dist/js'));

    gulp.src(
        'src/js/libs.min.js')// Transfer libs.js to production
        .pipe(gulp.dest('dist/js'));

    gulp.src('src/*.html') // Transfer HTML to production
        .pipe(gulp.dest('dist'));
});

gulp.task('clear', (callback) => {
    return cache.clearAll();
});

gulp.task('clean', async () => {
    del.sync('dist'); // Delete the dist folder before building the project
    del.sync('src/webfonts/'); // Delete the src / web fonts fontawesome folder before building the project
});

gulp.task('watch', () => {
    gulp.watch('src/scss/**/*.scss', gulp.parallel('sass')); // Monitoring Sass Files
    gulp.watch('src/*.html', gulp.parallel('code')); // Monitoring HTML files at the root of the project
    gulp.watch(['src/js/main.js', 'src/libs/**/*.js'], gulp.parallel('scripts')); // Monitoring the main JS file and libraries
});

gulp.task('dev', gulp.parallel(
    'icons',
    'css-libs',
    'sass',
    'libsJs',
    'scripts',
    'browser-sync',
    'watch'
));

gulp.task('build', gulp.parallel(
    'prebuild',
    'clean',
    'icons',
    'img',
    'sass',
    'libsJs',
    'scripts'
));