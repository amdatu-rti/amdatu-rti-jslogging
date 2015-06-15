/**
 * Created by paul on 05/09/14.
 */
require
    .config({
        paths: {
            'lodash': 'bower_components/lodash/lodash.min',
            'Atmosphere' : 'bower_components/atmosphere/atmosphere',
            'RtiLogger' : 'bower_components/amdatu-rti-jslogging/RtiRestLogger'
        },

        shim: {
            'Atmosphere' : {
                exports: 'Atmosphere'
            }
        }
    }
);

require(['ExampleApp'], function(Example) {
    new Example().testLogging();
});
