var gulp = require('gulp');
var gls = require('gulp-live-server');
var wiredep = require('wiredep').stream;
var del = require('del');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var jstConcat = require('gulp-jst-concat');
var concat = require('gulp-concat');
var open = require('gulp-open');
var symlink = require('gulp-sym');


var config = {
  bowerDep: 'app/bower_components',
  buildDir: '.www',
  minify: false,
  sassIncludePaths: [ './app/styles'
  ,'app/bower_components/foundation/scss'
  ,'app/bower_components/foundation-icon-fonts'
  ] ,

  wiredepSrc:  './app/index.html',
  scssSrc: './app/styles/**/*.scss',
  jstSrc: 'app/templates/*.html',
  jsSrc: 'app/scripts/**/*.js'
};

//------- clean task: delete build directory, start from scratch! ------

var cleaned = false;

gulp.task('clean', function(done){
  //only clean once - don't clean again when updating files during dev
  if (!cleaned) {
    cleaned = true;
    return del([config.buildDir], done);
  } else {
    done();
    return true;
  }
});


//------- prepare tasks: copy static files that do not need to be modified/processed ------
function _js(file) {
  if (!file) {
    file = config.jsSrc;
  }
  var stream = gulp.src(config.jsSrc);
  if (config.minify) {
    stream = stream.pipe(concat('main.js'))
    .pipe(uglify())
  }

  return stream.pipe(gulp.dest(config.buildDir+'/scripts'));
}
gulp.task('prepare:fonts', ['clean'], function(){
  return gulp.src('app/bower_components/foundation-icon-fonts/foundation-icons.woff')
  .pipe(gulp.dest(config.buildDir+'/styles'));
});
gulp.task('prepare:js', ['clean'], function(){
  return _js(false);
});
gulp.task('prepare:bower-sym', ['clean'], function(){
  return gulp.src('app/bower_components')
    .pipe(symlink(config.buildDir+'/bower_components'));

});

gulp.task('prepare',['prepare:fonts','prepare:js', 'prepare:bower-sym']);
//----- compile tasks: modifying and processing source files ------
function _wiredep(mf) {
  var stream = gulp.src(config.wiredepSrc)
              .pipe(wiredep({}));
  //if mf is true, call minifyHTML
  stream = mf?stream.pipe(minifyHtml()):stream;
  return stream
        .pipe(gulp.dest('./.www/'));
}

function _sass(file, mf) {
  //default for a fresh compile
  file = file?file:config.scssSrc;

  var stream = gulp.src(file) 
      .pipe(sass({ 
              //outputStyle: 'compressed',
              includePaths: config.sassIncludePaths
          }) 
          .on('error', sass.logError));
  stream = (mf)?stream.pipe(minifyCss()):stream;
  return stream
      .pipe(gulp.dest(config.buildDir+'/styles'));
}
function _jst(mf) {
  var stream = gulp.src(config.jstSrc)
      //.pipe(jade())
      .pipe(jstConcat('jst.js', {
          renameKeys: ['^.*app/templates/(.*).html$', '$1']
      }));
  stream = (mf)?stream.pipe(uglify()):stream;

  return stream
        .pipe(gulp.dest(config.buildDir+'/scripts'));
}

gulp.task('compile:wiredep', ['clean'], function(){
  return _wiredep(config.minify);
});
gulp.task('compile:sass', ['clean'], function() { 
    //copy bootstrap fonts
    return _sass(false, config.minify);
});
gulp.task('compile:jst', ['clean'], function() {
    return _jst(false, config.minify);
})

gulp.task('compile', ['prepare','compile:wiredep', 'compile:sass', 'compile:jst']);
//------ build tasks -------
gulp.task('build', ['compile']);
gulp.task('build:dist', function(){
  config.minify = true;
  return gulp.run('build');
});

//------- development server ------
gulp.task('server', ['build'], function() {
    var server = gls.static(['.www'], 3000);
    server.start();

    //use gulp.watch to trigger server actions(notify, start or stop)
    gulp.watch(['.www/**/*.*'], function(file) {
        server.notify.apply(server, [file]);
    });
});
gulp.task('open', ['server'], function() {
    gulp.src(__filename)
        .pipe(open({
            uri: 'http://localhost:3000/'
        }));
});
gulp.task('watch', ['build'],  function(){

  gulp.watch(config.wiredepSrc, function(evt){ var file = evt.path; console.log('HTML: '+file);return _wiredep(false); });
  gulp.watch(config.scssSrc, function(evt){ var file = evt.path; console.log('SCSS: '+file);return _sass(file,false); });
  gulp.watch(config.jstSrc, function(evt){ var file = evt.path; console.log('JST: '+file);return _jst(false); });
  return gulp.watch(config.jsSrc, function(evt){ var file = evt.path; console.log('JS: '+file); return _js(file); });

});
//------------
gulp.task('default', ['open', 'watch']);
