module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    uglify:
      prod:
        options:
          banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"

        files:
          "public/script/main.min.js": ["src/script/main.js"]

    less:
      dev:
        options:
          paths: ["css"]

        files:
          "css/style.css": "less/style.less"

      prod:
        options:
          paths: ["css"]
          cleancss: true
          modifyVars:
            imgPath: "\"http://mycdn.com/path/to/images\""
            bgColor: "red"

        files:
          "css/style.css": "less/style.less"

    jade:

      options:
        data: (dest, src) -> 
          cndata = require('./src/locales/src/cn.json')
          return {
            _ : (s) -> if (cndata.messages.hasOwnProperty(s)) then cndata.messages[s][1] else s
          }


      dev:
        options:
          pretty: true

        files: [
          {
            expand: true
            cwd: 'src/jade'
            src: ['*.jade']
            ext: '.html'
            dest: 'public'
          }
        ]
      prod:
        files: [
          {
            expand: true
            cwd: 'src/jade'
            src: ['*.jade']
            ext: '.html'
            dest: 'public'
          }
        ]
    copy:
      main:
        files: [
          {
            expand: true
            cwd: 'src'
            src: ['img/**'] #, 'lib/**']
            dest: 'public'
          }
          {
            expand: true
            cwd: 'src/style/css'
            src: ['*.css']
            dest: 'public/style'
          }
          {
            expand: true
            cwd: 'src/assets'
            src: ['**']
            dest: 'public'
          }
        ]
    clean:
      prod: [ 'public' ]

    'gh-pages':
      options:
        base: 'public'
      src: '**/*'

    abideExtract:
      js:
        src: "src/jade/**/*.jade"
        dest: "src/locales/messages.pot"
        options:
          cmd: "jsxgettext"
          language: "jade"
          keyword: "_"

    abideCompile:
      json:
        dest: "src/locales/"
        options:
          localeDir: "src/locales/"
          type: "json"
          createJSFiles: false # defaults to true

    express:
      all:
        options:
          bases: ["./"]
          port: 8080
          hostname: "0.0.0.0"
          livereload: true

    
    # grunt-watch will monitor the projects files
    # https://github.com/gruntjs/grunt-contrib-watch
    watch:
      all:
        files: [
          "src/**/*.html"
          "src/**/*.js"
          "src/**/*.css"
          "src/**/*.jade"
          "src/img/*"
        ]
        options:
          livereload: true

      copy:
        files: ["src/img/*", "src/**/*.css"]
        tasks: ["copy"]
        options:
          livereload: true

      uglify:
        files: "src/script/*.js"
        tasks: ["uglify"]
        options:
          livereload: true

      jade:
        files: "src/jade/**/*.jade"
        tasks: ["jade:dev", "abideExtract"]
        options:
          livereload: true

      css:
        files: "**/*.less"
        tasks: ["less:dev"]
        options:
          livereload: true

      po:
        files: "src/locales/**/*.po"
        tasks: ["abideCompile", "jade:dev"]
        options:
          livereload: true

  
  # Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-less"
  grunt.loadNpmTasks "grunt-contrib-jade"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-express"
  grunt.loadNpmTasks "grunt-i18n-abide"
  grunt.loadNpmTasks "grunt-gh-pages"
  
  # Default task(s).
  grunt.registerTask "default", [
    "abideCompile"
    "jade:dev"
    "uglify"
    "copy"
    "express"
    "watch"
  ]
  grunt.registerTask "pot", [ "abideExtract" ]
  grunt.registerTask "publish", [
    "clean"
    "jade:prod"
    "uglify:prod"
    "copy"
    "gh-pages"
  ]
  return

