## gulp-query-stylus
Stylus for [gulp-query](https://github.com/gulp-query/gulp-query)

Uses [cssnano](http://cssnano.co/) with autoprefixer for optimization

This plugin provides automatic source maps, compiling Stylus into CSS, autoprefixing and minification.
Write your CSS rules without vendor prefixes — autoprefixer will do everything itself

```text
npm install gulp-query gulp-query-stylus
```

### Example
Paste the code into your `gulpfile.js` and configure it
```javascript
let build = require('gulp-query')
  , stylus = require('gulp-query-stylus')
;
cocktail(function (query) {
    query.plugins([stylus])
      .stylus('src/stylus/app.styl','css/','app')

      .stylus('src/stylus/admin.styl','css/undercover.css',{
        include: [
          ...
        ]
      })

      .stylus({
        from: 'src/stylus/main.styl',
        to: 'css/',
        name: 'main'
      })
      ;
});
```
And feel the freedom
```
gulp
gulp --production // For production
gulp watch // Watching change
gulp stylus // Only for stylus
gulp stylus:app // Only for app.stylus
gulp stylus:admin stylus:main watch // Watching change only for admin and main
...
```

### Options
```javascript
.stylus({
    name: "task_name", // For gulp stylus:task_name 
    from: "stylus/app.styl",
    to: "css/",
    source_map: true,
    source_map_type: 'inline',
    full: false, // if set true is without compress in prod
    include: [
        //'../node_modules/compass-mixins/lib/', // relative path from gulpfile.js 
    ],
    autoprefixer: {
      browsers: ["> 1%", "last 2 versions"],
    }
})
```