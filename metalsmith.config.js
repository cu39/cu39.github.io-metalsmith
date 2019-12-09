'use strict';

const moment = require('moment');

module.exports = {

  '_conf': {
    'default': {
      'source': './src',
      'metadata': {
        'sitename': 'cu39 on github.io',
        'description': ''
      },
    },
    'development': {
      'destination': './.tmp'
    },
    'production': {
      'destination': './build'
    }
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
    ms.clean(false);

    /* !!! Carefylly arrange loaders to control the output !!! */

    load('ignore', [
      'assets/**/*'
    ]);

    ms.use(function(files, metalsmith, done) {
      const ptn = /\.md$/;
      Object.keys(files).forEach((path) => {
        if (!ptn.test(path)) { return; }
        const data = files[path];
        data.formattedDate = moment(data.date).format('YYYY-MM-DD');
        data.permalink = '/' + path.replace(ptn, '.html');
      });
      done();
    });

    load('collections', {
      articles: {
        pattern: 'blog/**/*.md',
        sortBy: 'date',
        reverse: true
      }
    });

    load('markdown', {
      // See Marked options on https://github.com/chjj/marked
      gfm: true,
      tables: true,
      breaks: false,
      smartypants: true,
      highlight: this._highlight
    });

    load('in-place', {
      'pattern': 'blog/**/*'
    });

    load('pug', {
      'pretty': env === 'development'
    });

    load('layouts', {
      'engine': 'pug',
      'pretty': env === 'development'
    });

    return ms;
  }

};
