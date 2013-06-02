/*global module:false*/
module.exports = function ( grunt ) {
	
	// Project configuration.
	grunt.initConfig({
		pkg: "<json:package.json>",
		meta: {
			version: "0.1.0",
			banner:
				"/*! PDX Roasters - v<%= meta.version %> - <%= grunt.template.today('yyyy-mm-dd') %>\n" +
				" * @author: PDX Roasters\n" +
				" * @url: http://pdxroasters.com\n" +
				" * \n" +
				" */"
		},
		lint: {
			files: {
				site: [
					"ender/ender.js",
					"pdx.js",
					"lib/*",
					"app.js"
				]
			}
		},
		qunit: {
			files: ["test/**/*.html"]
		},
		concat: {
			site: {
				src: ["<banner:meta.banner>", "<config:lint.files.site>"],
				dest: "dist/scripts.js"
			}
		},
		min: {
			site: {
				src: ["<banner:meta.banner>", "<config:concat.site.dest>"],
				dest: "dist/scripts.min.js"
			}
		},
		compass: {
			development: {
				basePath: "../",
				config: "../config.rb",
				environment: "development"
			},
			production: {
				basePath: "../",
				config: "../config.rb",
				environment: "production",
				forcecompile: true
			}
		},
		watch: {
			site: {
				files: ["<config:lint.files.site>"],
				tasks: ["concat:site", "min:site"]
			},
			
			all: {
				files: ["<config:lint.files.site>", "../sass/*.scss"],
				tasks: ["concat:site", "min:site", "compass:development"]
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			},
			globals: {
				ender: true,
				console: true
			}
		},
		uglify: {}
	});
	
	// Load plugins.
	grunt.loadNpmTasks( "grunt-compass" );
	
	// Prod deploy task. Use before commit.
	grunt.registerTask( "deploy", "concat min compass:production" );
	
	// Build task.
	grunt.registerTask( "build", "concat min compass:development" );
	
	// Test task.
	grunt.registerTask( "test", "lint" );

};
