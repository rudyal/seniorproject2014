module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compass: {
	    	dev: {
	    		options: {
	    			config: 'config.rb'
	    		} //options
	    	} //dev
	    },
		sass: {
			dist: {
				files: {
					'public/stylesheets/dist/style.css' : 'sass/style.scss'
				}
			}
		},
		watch: {
			css: {
				files: 'public/stylesheets/scss/*.scss',
				tasks: ['sass']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.registerTask('default',['watch']);
}