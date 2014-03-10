module.exports = (grunt) ->

	pkg = grunt.file.readJSON('package.json')

	#*------------------------------------*\
	#   $LOAD DEPENDENCIES
	#*------------------------------------*/
	dependencies = Object.keys(pkg.devDependencies).filter (o) ->
		/^grunt-.+/.test(o)

	for dep in dependencies
		grunt.loadNpmTasks(dep)

	#
	# Grunt configuration:
	#
	# https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
	#
	grunt.initConfig
		pkg: pkg,

		# Project configuration
		# ---------------------


		#*------------------------------------*\
		#   $BUMP
		#*------------------------------------*/
		bump:
			options:
				files: [
					'package.json',
					'bower.json'
				]
				commit: true
				commitMessage: 'bump version to %VERSION%'
				commitFiles: [
					'package.json',
					'bower.json'
				]
				createTag: false
				push: false


		#*------------------------------------*\
		#   $CONTRIB-COFFEE
		#*------------------------------------*/
		coffee:
			dist:
				files: [{
					expand: true
					cwd: '<%= pkg.path.coffee %>'
					src: '{,*/}*.coffee'
					dest: '<%= pkg.path.js %>'
					ext: '.js'
				}]


		#*------------------------------------*\
		#   $CONTRIB-JASMINE
		#*------------------------------------*/
		jasmine:
			dist:
				src: "<%= pkg.path.js %>/**.js"
				options:
					specs: 'spec/*Spec.js',
					helpers: 'spec/*Helper.js',
					template: 'custom.tmpl'


		#*------------------------------------*\
		#   $CONTRIB-UGLIFY
		#*------------------------------------*/
		uglify:
			target:
				files:
					'<%= pkg.path.js %>/jquery-sticktotop.min.js': '<%= pkg.path.js %>/jquery-sticktotop.js'


		#*------------------------------------*\
		#   $CONTRIB-WATCH
		#*------------------------------------*/
		watch:
			coffee:
				files: ['<%= pkg.path.coffee %>/**/*.coffee'],
				tasks: ['coffee:dist']


	#*------------------------------------*\
	#   $TASKS
	#*------------------------------------*/
	grunt.registerTask('default', ['watch'])
