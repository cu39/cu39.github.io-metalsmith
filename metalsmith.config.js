'use strict';

module.exports = {

  '_conf': {
    'default': {
      'source': './src',
      'destination': './build',
      'metadata': {
        'title': 'cu39 on github.io',
        'description': ''
      },
    },
    'development': {},
    'production': {}
  },

  'conf': function (env) {
    var _ = require('lodash');
    var conf = {};
    _.merge(conf, this._conf['default']);
    if (this._isValidEnv(env)) _.merge(conf, this._conf[env]);
    return conf;
  },

  '_isValidEnv': function (env) {
    var _ = require('lodash');
    if (_.isEmpty(env)) return false;
    if (!_.has(this._conf, env)) return false;
    return true;
  },

  'create': function (env) {
    var Metalsmith = require('metalsmith');
    var ms = new Metalsmith(__dirname);

    var conf = this.conf(env);

    ms.source(conf.source);
    ms.destination(conf.destination);
    ms.metadata(conf.metadata);

    return ms;
  }

};
