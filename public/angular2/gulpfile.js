// including plugins
var timestamp = Date.now();
var gulp = require('gulp')
, uglify = require('gulp-uglify')
, replace = require('gulp-replace')
, concat = require('gulp-concat')
, concatCss = require('gulp-concat-css');


 
// compress file js after angular cli build
gulp.task('minify-js', function () {
    gulp.src('dist/*.js')
	    .pipe(uglify())
	    .pipe(gulp.dest('dist'));
});

//add timestamp to clear cache browser
gulp.task('timestamp-html', function(){
  	gulp.src(['dist/index.html'])
	    .pipe(replace(/(\?t=.*")/g, '"'))
	    .pipe(replace(/(\.css)/g, '$1\?t=' + timestamp))
	    .pipe(replace(/(\.js)/g, '$1\?t=' + timestamp))
	    .pipe(gulp.dest('dist'));
});

//add timestamp to clear cache browser file chunk.js - lazyloading angular.io
gulp.task('timestamp-lazyloading', function(){
  	gulp.src(['dist/inline.bundle.js'])
	    .pipe(replace(/(\?t=.*")/g, '"'))
	    .pipe(replace(/(\.chunk\.js)/g, '$1\?t=' + timestamp))
	    .pipe(gulp.dest('dist'));
});

//add concat file JS
var arrJS = ['dist/assets/plugins/jquery/jquery.js',
	        'dist/assets/plugins/rs-plugin/jquery.themepunch.tools.min.js',
	        'dist/assets/plugins/rs-plugin/jquery.themepunch.revolution.min.js',
	        'dist/assets/js/rs-script.js',
	        'dist/assets/plugins/jquery-ui/jquery-ui.js',
	        'dist/assets/plugins/menu/superfish.min.js',
	        'dist/assets/plugins/menu/tinynav.min.js',
	        'dist/assets/plugins/nicescroll/jquery.nicescroll.min.js',
	        'dist/assets/js/settings.js',
	        'dist/assets/plugins/js-composer/js_composer_front.js',
	        'dist/assets/plugins/jquery-ui/core.min.js',
	        'dist/assets/plugins/jquery-ui/tabs.min.js',
	        'dist/assets/plugins/jquery-ui/jquery-ui-tabs-rotate.js',
	        'dist/assets/plugins/bootstrap-3.3.7/js/bootstrap.min.js',
	        'dist/assets/plugins/swiper/swiper.min.js',
	        'dist/assets/plugins/select2/js/select2.min.js',
	        'dist/assets/plugins/owl-carousel/owl.carousel.js',
	        'dist/assets/plugins/moment.js',
	        'dist/assets/plugins/moment-with-locales.min.js',
	        'dist/assets/plugins/datetimepicker/js/bootstrap-datetimepicker.min.js',
	        'dist/assets/plugins/jquery.matchHeight.js',
	        'dist/assets/plugins/sticky-kit/sticky-kit.js',
	        'dist/assets/js/script.js',

			'dist/inline.bundle.js',
			'dist/polyfills.bundle.js',
			'dist/styles.bundle.js',
			'dist/vendor.bundle.js',
			'dist/main.bundle.js'
			];
gulp.task('concat-script', function() {
  return gulp.src(arrJS)
    .pipe(concat('bundle.js', {newLine: ';'}))
    .pipe(gulp.dest('./dist/'));
});

//add concat file CSS
var arrCSS = ['dist/assets/css/styles.css', 
			'dist/assets/css/nicdark_responsive.css', 
			'dist/assets/css/elusive-icons.css', 
			'dist/assets/plugins/js-composer/js_composer.css', 
			'dist/assets/plugins/jquery.timepicker.css' , 
			'dist/assets/plugins/formBuilder/form-builder.css' , 
			'dist/assets/plugins/bootstrap-3.3.7/css/bootstrap.min.css',
	       'dist/assets/fonts/icons/font-awesome-4.6.3/css/font-awesome.min.css',
	       'dist/assets/plugins/swiper/swiper.min.css',
	       'dist/assets/plugins/select2/css/select2.css',
	       'dist/assets/plugins/owl-carousel/owl.carousel.css',
	       'dist/assets/plugins/owl-carousel/owl.theme.css',
	       'dist/assets/plugins/owl-carousel/owl.transitions.css',
	       'dist/assets/plugins/datetimepicker/css/bootstrap-datetimepicker.min.css',
	       'dist/assets/plugins/ionicons.min.css',
	       'dist/assets/css/rs-style.css',
	       'dist/assets/css/toaster.css',
	       'dist/assets/css/reset.css',
	       'dist/assets/css/style.css',
	       'dist/assets/css/custom.css'
			];

gulp.task('concat-css', function () {
  return gulp.src(arrCSS)
    .pipe(concatCss('bundle.css'))
    .pipe(gulp.dest('./dist/'));
});

//Total task
gulp.task('default', ['minify-js', 'timestamp-html', 'timestamp-lazyloading']);