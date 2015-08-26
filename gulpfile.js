var gulp = require('gulp');
var gls = require('gulp-live-server');
var mocha = require('gulp-mocha');
var open = require('gulp-open');
var sass = require('gulp-sass');
var jade = require('gulp-jade'),
    jstConcat = require('gulp-jst-concat');
var bowerRequireJS = require('bower-requirejs');
var amdOptimize = require('amd-optimize');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del');
var symlink = require('gulp-sym');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var usemin = require('gulp-usemin');
var requirejsOptimize = require('gulp-requirejs-optimize');
var replace = require('gulp-replace');

var config = { 
    sassPath: 'app/styles',
 bowerDir: 'app/bower_components' 
}


// ---- compile ----
gulp.task('jst',function() {
    return gulp.src('app/templates/*.html')
        //.pipe(jade())
        .pipe(jstConcat('jst.js', {
            renameKeys: ['^.*app/templates/(.*).html$', '$1']
        }))
        .pipe(gulp.dest('.tmp/scripts'))
})

gulp.task('sass', function() { 
    //copy bootstrap fonts
    gulp.src('app/bower_components/bootstrap-sass/assets/fonts/**')
    .pipe(gulp.dest('.tmp/fonts'));

    return gulp.src('./app/styles/**/*.scss') 
        .pipe(sass({ 
                outputStyle: 'compressed',
                includePaths: [ './app/styles', 'app/bower_components/bootstrap-sass/assets/stylesheets' ] 
            }) 
            .on('error', sass.logError))
        .pipe(gulp.dest('./.tmp/styles'));
});

gulp.task('bowerReqJs', function(done) {
    var options = {
        baseUrl: 'app/scripts',
        config: 'app/scripts/main.js',
        transitive: true,
        exclude: ['requirejs']
    };

    bowerRequireJS(options, function(rjsConfigFromBower) {
        done();
    });
});

gulp.task('jst:watch', function() {
    return gulp.watch('./app/templates/*.html', ['jst']);
});

gulp.task('sass:watch', function() {
    return gulp.watch('./app/styles/**/*.scss', ['sass']);
});

gulp. task('compile', ['jst', 'sass', 'bowerReqJs']);

// ---- tests ----

gulp.task('test', function() {
    return gulp.src('tests/*.js', {
            read: false
        })
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({
            reporter: 'nyan'
        }));
});


//---- server ----

gulp.task('server', function() {
    var server = gls.static(['app', '.tmp'], 3000);
    server.start();

    //use gulp.watch to trigger server actions(notify, start or stop)
    gulp.watch(['.tmp/**/*.css', 'app/**/*.html', 'app/**/*.js'], function(file) {
        server.notify.apply(server, [file]);
    });
});

gulp.task('server:dist', ['build'], function() {
    var server = gls.static(['dist'], 3000);
    server.start();

});

gulp.task('open', ['sass', 'jst', 'server'], function() {
    gulp.src(__filename)
        .pipe(open({
            uri: 'http://localhost:3000/'
        }));
});

gulp.task('open:dist', ['sass', 'jst', 'server:dist'], function() {
    gulp.src(__filename)
        .pipe(open({
            uri: 'http://localhost:3000/'
        }));
});


gulp.task('serve', ['compile','sass:watch', 'jst:watch', 'server', 'open']);
gulp.task('serve:dist', ['build','server:dist', 'open:dist']);

// ---- build ---

gulp.task('build:clean', function(cb){
  del(['.tmp', 'dist'], cb);
});

gulp.task('build:prepare', ['compile', 'build:clean'],  function(){
  gulp.src('.tmp/scripts/**/*.js')
  .pipe(gulp.dest('.tmp/build/scripts'));

  gulp.src('.tmp/styles/**')
  .pipe(gulp.dest('.tmp/build/styles'));

  gulp.src('app/bower_components')
    .pipe(symlink('.tmp/build/bower_components'));

  return gulp.src(['app/**/*.*', '!**/bower_components/**'])
  .pipe(gulp.dest('.tmp/build'));
});

gulp.task('build:scripts', ['build:prepare'],  function () {



  /*return gulp.src(['.tmp/build/scripts/ * * / *.js', ])
    // Traces all modules and outputs them in the correct order.
    .pipe(amdOptimize('main', {
        baseUrl: '.tmp/build/scripts',
        configFile : "app/scripts/requireConfig.js"
      }))
    .pipe(concat('main.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));*/

    return gulp.src('.tmp/build/scripts/main.js')
          .pipe(requirejsOptimize({
            mainConfigFile: '.tmp/build/scripts/main.js',
            optimize: 'none'
          }))
          .pipe(gulp.dest('dist/scripts'));
});

gulp.task('build:usemin',['build:scripts'], function () {
  return gulp.src('.tmp/build/index.html')
      .pipe(replace(/<!-- dist:([^\s]*) -->/g, '<script type="text/javascript" src="$1"></script>'))
      .pipe(usemin({
        css: [minifyCss(), 'concat'],
        html: [minifyHtml({empty: true, quotes: true, loose: true})],
        //js: [uglify(), 'concat']
        js: [ 'concat']
      }))
      .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['build:clean','compile', 'build:prepare','build:scripts', 'build:usemin' ]);
