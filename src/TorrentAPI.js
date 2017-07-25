import rp from 'request-promise';
import querystring from 'querystring';

class Queue {
  queue = [];
  running = false;

  add(func) {
    this.queue.push(func);
    this.start();
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.process();
    }
  }

  process() {
    if (this.queue.length === 0) {
      this.running = false;
      return;
    }

    this.queue.shift()();

    setTimeout(this.process.bind(this), 2000);
  }
}

class TorrentAPI {
  url = 'https://torrentapi.org/pubapi_v2.php';
  _token = 'cdzyrob3nf';
  _tokenTime = null;

  _request(query) {
    query = this._translateAndValidate(query);

    const options = {
      url: this.url + '?' + querystring.stringify({...query, token: this._token}),
      json: true,
    };

    return rp(options);
  }

  _query(query) {
    if (!this._token) { // no token set
      return this._setToken(query);
    }
    if (Date.now() - this._tokenTime > 900000) { // token has run out
      return this._setToken(query);
    }
    return new Promise((resolve, reject) => {
      this._request(query).then(result => {
        if (result.hasOwnProperty('error')) {
          if ([3, 4, 5].includes(result.error_code)) {
            this._setToken(query).then(resolve);
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

  _setToken(query) {
    return this._request({get_token: 'get_token'}).then(result => {
      this._token = result.token;
      this._tokenTime = Date.now();
      return this._query(query);
    });
  }

  _translateAndValidate(query) {
    const allowed = {
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
      ranked: 'ranked',
    };

    return Object.assign(...Object.keys(query).map(key => {
      if (!allowed[key]) throw new Error(`Query parameter '${key}' is not allowed.`);
      return {
        [allowed[key]]: query[key],
      };
    }));
  }

  list(query) {
    return this._query({mode: 'list', ...query});
  }

  search(query) {
    return this._query({mode: 'search', ...query});
  }
}

export default TorrentAPI;