# TorrentAPI
Simple Node.js wrapper for RARBG's torrentapi see 
https://torrentapi.org/apidocs_v2.txt
for more info.
## Installation
```
npm install torrentapi
```

## Example
```javascript
const TorrentAPI = require('torrentapi');

const torrentAPI = new TorrentAPI('ACME');

torrentAPI.list({sort: 'leechers', limit: 5, category: '44,55'}).then(torrents => {
    console.log(torrents);
})

torrentAPI.search({imdb: 'tt1375666', sort: 'seeders'}).then(torrents => {
    console.log(torrents);
})
```

## Parameters

**string**
Free text search e.g. "The Shawshank Redemption"

**imdb**
imdb id e.g. "tt0111161"
  
**tvdb**
tvdb id e.g. "81189"
  
**themoviedb**
themoviedb id e.g. "293660"
  
**category**
Any comma-seperated combination of RARBG's category ids e.g. "44,45"
* XXX (18+): 4
* Movies/XVID: 14
* Movies/XVID/720: 48
* Movies/x264: 17
* Movies/x264/1080: 44
* Movies/x264/720: 45
* Movies/x264/3D: 47
* Movies/Full BD: 42
* Movies/BD Remux: 46
* TV Episodes: 18
* TV HD Episodes: 41
* TV UHD Episodes: 49
* Music/MP3: 23
* Music/FLAC: 25
* Games/PC ISO: 27
* Games/PC RIP: 28
* Games/PS3: 40
* Games/XBOX-360: 32
* Software/PC ISO: 33
* e-Books: 35
  
**limit**
One of the following limits can be specified: 25, 50 or 100
  
**sort**
Sort the results by "seeders", "leechers" or "last"
  
**minSeeders**
Specify a minimum number of seeders required for the torrent to be included
  
**minLeechers**
Specify a minimum number of leechers required for the torrent to be included
  
**format**
Specify the result format, the options are "json" and "json_extended"
  
**ranked**
Specify with "0" or "1" whether to return only scene releases (rarbg and rartv releases). For other groups set to "0"