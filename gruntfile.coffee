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
      dev:
        options:
          data:
            debug: true

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
        options:
          data:
            debug: false

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
        ]

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
        tasks: ["jade:dev"]
        options:
          livereload: true

      css:
        files: "**/*.less"
        tasks: ["less:dev"]
        options:
          livereload: true

  
  # Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-less"
  grunt.loadNpmTasks "grunt-contrib-jade"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-express"
  
  # Default task(s).
  grunt.registerTask "default", [
    "jade:dev"
    "uglify"
    "copy"
    "express"
    "watch"
  ]
  grunt.registerTask "prod", [
    "jade:prod"
    "uglify:prod"
  ]
  # grunt.registerTask "pub", [
  #   "less:prod"
  #   "jade:prod"
  #   "uglify:prod"
  #   "copy"
  # ]
  return

