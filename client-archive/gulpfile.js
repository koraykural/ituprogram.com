const gulp = require("gulp");
const purify = require("gulp-purifycss");
const gzip = require("gulp-gzip");

const distPath = "./dist/";

gulp.task("purifyCSS", () => {
  return gulp
    .src(`${distPath}**/styles.*.css`)
    .pipe(
      purify([`${distPath}**/*.js`, `${distPath}**/*.html`], {
        info: true,
        minify: true,
        rejected: false,
        whitelist: ["*transition*", "*dimmer*"],
      })
    )
    .pipe(gulp.dest(distPath));
});

gulp.task("compress", function () {
  return gulp
    .src([`${distPath}**/*.*`])
    .pipe(gzip())
    .pipe(gulp.dest(distPath));
});
