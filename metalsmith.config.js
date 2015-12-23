'use strict';

module.exports = {

  '_conf': {
    'default': {
      'source': './src',
      'destination': './build',
      'metadata': {
        'sitename': 'cu39 on github.io',
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

  '_highlight': function (code, lang, callback) {
    var hljs = require('highlight.js');
    return hljs.highlight(lang, code, false).value;
  },

  'create': function (env) {
    var Metalsmith = require('metalsmith');
    var ms = new Metalsmith(__dirname);

    function load(pluginName, opts) {
      var plugin = require("metalsmith-" + pluginName);
      ms.use(plugin(opts));
      return ms;
    }

    var conf = this.conf(env);

    ms.source(conf.source);
    ms.destination(conf.destination);
    ms.metadata(conf.metadata);

    /* !!! Carefylly arrange loaders to control the output !!! */

    load('ignore', [
      'assets/**/*'
    ]);

    load('markdown', {
      // See Marked options on https://github.com/chjj/marked
      gfm: true,
      tables: true,
      breaks: false,
      smartypants: true,
      highlight: this._highlight
    });

    load('permalinks', {
      'relative': false,
      'pattern': 'post/:date-:title',
      'date': 'YYYY-MM-DD'
    });

    load('layouts', {
      'engine': 'jade'
    });

    return ms;
  }

};
