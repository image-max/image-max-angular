// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma'),
        ],
        client: {
            clearContext: false, // leave Jasmine Spec Runner output visible in browser
        },
        reporters: ['progress', 'coverage', 'kjhtml'],
        coverageReporter: {
            reporters: [
                { type: 'lcov', dir: 'coverage-html/', file: 'coverage.html' },
                {
                    type: 'text',
                    dir: 'coverage-txt/',
                    file: 'coverage.txt',
                },
                {
                    type: 'cobertura',
                    dir: 'coverage-xml/',
                    file: 'coverage.xml',
                },
            ],
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_WARN,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        restartOnFileChange: true,
        proxies: {
            'assets/': 'src/assets/',
        },
    });
};
