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
		watch: {
			sass: {
				files: 'public/stylesheets/scss/*.scss',
				tasks: ['compass:dev']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.registerTask('default',['watch']);
}