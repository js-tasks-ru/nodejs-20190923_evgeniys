const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  if (path.basename(pathname) !== pathname) {
    res.statusCode = 400;
    res.end('Invalid path');
  }
  const filepath = path.join(__dirname, 'files', pathname);
  //  ====================
  switch (req.method) {
    case 'GET':
      fs.access(filepath, fs.constants.F_OK, async (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('Not Found');
          } else {
            res.statusCode = 500;
            res.end('Internal Error');
          }
        }
        if (!err) {
          const fileStream = fs.createReadStream(filepath);
          res.statusCode = 200;
          fileStream.pipe(res);
        }
      });

      break;

    case 'DELETE':
      fs.unlink(filepath, (err) => {
        if (!err) {
          res.end('Ok!');
        }
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('Not Found');
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
