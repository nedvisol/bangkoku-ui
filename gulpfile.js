var gulp = require('gulp');
var gls = require('gulp-live-server');
var mocha = require('gulp-mocha');
var open = require('gulp-open');
var sass = require('gulp-sass');
var jade = require('gulp-jade'),
    jstConcat = require('gulp-jst-concat');
var bowerRequireJS = require('bower-requirejs');

var config = { 
    sassPath: 'app/styles',
 bowerDir: 'app/bower_components' 
}

gulp.task('test', function() {
    return gulp.src('tests/*.js', {
            read: false
        })
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({
            reporter: 'nyan'
        }));
});


gulp.task('server', function() {
    var server = gls.static(['app', '.tmp'], 3000);
    server.start();

    //use gulp.watch to trigger server actions(notify, start or stop)
    gulp.watch(['.tmp/**/*.css', 'app/**/*.html', 'app/**/*.js'], function(file) {
        server.notify.apply(server, [file]);
    });
});






gulp.task('jst', function() {
    gulp.src('app/templates/*.html')
        //.pipe(jade())
        .pipe(jstConcat('jst.js', {
            renameKeys: ['^.*app/templates/(.*).html$', '$1']
        }))
        .pipe(gulp.dest('.tmp/scripts'))
})

gulp.task('jst:watch', function() {
    return gulp.watch('./app/templates/*.html', ['jst']);
});


gulp.task('bower', function(done) {
    var options = {
        baseUrl: 'app/scripts',
        config: 'app/scripts/requireConfig.js',
        transitive: true,
        exclude: ['requirejs']
    };

    bowerRequireJS(options, function(rjsConfigFromBower) {
        done();
    });
});


gulp.task('sass:watch', function() {
    return gulp.watch('./app/styles/**/*.scss', ['sass']);
});

gulp.task('sass', function() { 
    return gulp.src('./app/styles/**/*.scss') 
        .pipe(sass({ 
                outputStyle: 'compressed',
                includePaths: [ './app/styles', 'app/bower_components/bootstrap-sass/assets/stylesheets' ] 
            }) 
            .on('error', sass.logError))
        .pipe(gulp.dest('./.tmp/styles'));
});

gulp.task('open', ['sass', 'jst', 'server'], function() {
    gulp.src(__filename)
        .pipe(open({
            uri: 'http://localhost:3000/'
        }));
});

gulp.task('serve', ['sass', 'sass:watch', 'jst', 'jst:watch', 'server', 'open']);
