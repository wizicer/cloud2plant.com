markdown = require("markdown").markdown

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
      en:
        options:
          data: (dest, src) -> 
            cndata = require('./src/locales/src/en.json')
            return {
              lang: 'en'
              langlink: (s) -> s + '-en.html'
              _: (s) -> if (cndata.messages.hasOwnProperty(s) && cndata.messages[s][1] != "") then cndata.messages[s][1] else s
              _md: (s) -> markdown.toHTML(if (cndata.messages.hasOwnProperty(s) && cndata.messages[s][1] != "") then cndata.messages[s][1] else s)
            }
          pretty: true

        files: [
          {
            expand: true
            cwd: 'src/jade'
            src: ['*.jade']
            ext: '-en.html'
            dest: 'public'
          }
        ]
      zh:
        options:
          data: (dest, src) -> 
            cndata = require('./src/locales/src/zh.json')
            return {
              lang: 'zh'
              langlink: (s) -> s + '-zh.html'
              _: (s) -> if (cndata.messages.hasOwnProperty(s) && cndata.messages[s][1] != "") then cndata.messages[s][1] else s
              _md: (s) -> markdown.toHTML(if (cndata.messages.hasOwnProperty(s) && cndata.messages[s][1] != "") then cndata.messages[s][1] else s)
            }
          pretty: true

        files: [
          {
            expand: true
            cwd: 'src/jade'
            src: ['*.jade']
            ext: '-zh.html'
            dest: 'public'
          }
        ]

    copy:
      index:
        dest: 'public/index.html'
        src: 'public/index-en.html'
      assets:
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
          keyword: ["_", "_md"]

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
        tasks: ["jade", "copy:index"]
        options:
          livereload: true

      css:
        files: "**/*.less"
        tasks: ["less:dev"]
        options:
          livereload: true

      po:
        files: ["src/locales/zh.po", "src/locales/en.po"]
        tasks: ["abideCompile", "jade"]
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
    "jade"
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

