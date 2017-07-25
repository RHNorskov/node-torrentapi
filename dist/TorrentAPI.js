'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue = function () {
  function Queue() {
    _classCallCheck(this, Queue);

    this.queue = [];
    this.running = false;
  }

  _createClass(Queue, [{
    key: 'add',
    value: function add(func) {
      this.queue.push(func);
      this.start();
    }
  }, {
    key: 'start',
    value: function start() {
      if (!this.running) {
        this.running = true;
        this.process();
      }
    }
  }, {
    key: 'process',
    value: function process() {
      if (this.queue.length === 0) {
        this.running = false;
        return;
      }

      this.queue.shift()();

      setTimeout(this.process.bind(this), 2000);
    }
  }]);

  return Queue;
}();

var TorrentAPI = function () {
  function TorrentAPI() {
    _classCallCheck(this, TorrentAPI);

    this.url = 'https://torrentapi.org/pubapi_v2.php';
    this._token = 'cdzyrob3nf';
    this._tokenTime = null;
  }

  _createClass(TorrentAPI, [{
    key: '_request',
    value: function _request(query) {
      query = this._translateAndValidate(query);

      var options = {
        url: this.url + '?' + _querystring2.default.stringify(_extends({}, query, { token: this._token })),
        json: true
      };

      return (0, _requestPromise2.default)(options);
    }
  }, {
    key: '_query',
    value: function _query(query) {
      var _this = this;

      if (!this._token) {
        // no token set
        return this._setToken(query);
      }
      if (Date.now() - this._tokenTime > 900000) {
        // token has run out
        return this._setToken(query);
      }
      return new Promise(function (resolve, reject) {
        _this._request(query).then(function (result) {
          if (result.hasOwnProperty('error')) {
            if ([3, 4, 5].includes(result.error_code)) {
              _this._setToken(query).then(resolve);
            } else {
              reject(result);
            }
          } else if (result.hasOwnProperty('torrent_results')) {
            resolve(result.torrent_results);
          } else {
            reject(new Error('unkown error'));
          }
        });
      });
    }
  }, {
    key: '_setToken',
    value: function _setToken(query) {
      var _this2 = this;

      return this._request({ get_token: 'get_token' }).then(function (result) {
        _this2._token = result.token;
        _this2._tokenTime = Date.now();
        return _this2._query(query);
      });
    }
  }, {
    key: '_translateAndValidate',
    value: function _translateAndValidate(query) {
      var allowed = {
        mode: 'mode',
        string: 'search_string',
        imdb: 'search_imdb',
        tvdb: 'search_tvdb',
        themoviedb: 'search_themoviedb',
        category: 'category',
        get_token: 'get_token',
        limit: 'limit',
        sort: 'sort',
        minSeeders: 'min_seeders',
        minLeechers: 'min_leechers',
        format: 'format',
        ranked: 'ranked'
      };

      return Object.assign.apply(Object, _toConsumableArray(Object.keys(query).map(function (key) {
        if (!allowed[key]) throw new Error('Query parameter \'' + key + '\' is not allowed.');
        return _defineProperty({}, allowed[key], query[key]);
      })));
    }
  }, {
    key: 'list',
    value: function list(query) {
      return this._query(_extends({ mode: 'list' }, query));
    }
  }, {
    key: 'search',
    value: function search(query) {
      return this._query(_extends({ mode: 'search' }, query));
    }
  }]);

  return TorrentAPI;
}();

exports.default = TorrentAPI;