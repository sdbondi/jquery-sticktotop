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
		#   $CONTRIB-WATCH
		#*------------------------------------*/
		watch:
			coffee:
				files: ['<%= pkg.path.coffee %>/**/*.coffee'],
				tasks: ['coffee:dist']


		#*------------------------------------*\
		#   $CONTRIB-UGLIFY
		#*------------------------------------*/
		uglify:
			target:
				files:
					'<%= pkg.path.js %>/jquery-sticktotop.min.js': '<%= pkg.path.js %>/jquery-sticktotop.js'


	#*------------------------------------*\
	#   $TASKS
	#*------------------------------------*/
	grunt.registerTask('default', ['watch'])
