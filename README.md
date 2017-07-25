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
</br>
<dl>
  <dt>string</dt>
  <dd>Free text search e.g. "The Shawshank Redemption"</dd>

  <dt>imdb</dt>
  <dd>imdb id e.g. "tt0111161"</dd>
  
  <dt>tvdb</dt>
  <dd>tvdb id e.g. "81189"</dd>
  
  <dt>themoviedb</dt>
  <dd>themoviedb id e.g. "293660"</dd>
  
  <dt>category</dt>
  <dd>
  Any comma-seperated combination of RARBG's category ids e.g. "44,45"
    <ul>
      <li>XXX (18+): 4</li>
      <li>Movies/XVID: 14</li>
      <li>Movies/XVID/720: 48</li>
      <li>Movies/x264: 17</li>
      <li>Movies/x264/1080: 44</li>
      <li>Movies/x264/720: 45</li>
      <li>Movies/x264/3D: 47</li>
      <li>Movies/Full BD: 42</li>
      <li>Movies/BD Remux: 46</li>
      <li>TV Episodes: 18</li>
      <li>TV HD Episodes: 41</li>
      <li>TV UHD Episodes: 49</li>
      <li>Music/MP3: 23</li>
      <li>Music/FLAC: 25</li>
      <li>Games/PC ISO: 27</li>
      <li>Games/PC RIP: 28</li>
      <li>Games/PS3: 40</li>
      <li>Games/XBOX-360: 32</li>
      <li>Software/PC ISO: 33</li>
      <li>e-Books: 35</li>
    </ul>
  </dd>
    
  
  <dt>limit</dt>
  <dd>One of the following limits can be specified: 25, 50 or 100</dd>
  
  <dt>sort</dt>
  <dd>Sort the results by "seeders", "leechers" or "last"</dd>
  
  <dt>minSeeders</dt>
  <dd>Specify a minimum number of seeders required for the torrent to be included</dd>
  
  <dt>minLeechers</dt>
  <dd>Specify a minimum number of leechers required for the torrent to be included</dd>
  
  <dt>format</dt>
  <dd>Specify the result format, the options are "json" and "json_extended"</dd>
  
  <dt>ranked</dt>
  <dd>Specify with "0" or "1" whether to return only scene releases (rarbg and rartv releases). For other groups set to "0"</dd>
</dl>