const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (path.basename(pathname) !== pathname) {
        res.statusCode = 400;
        res.end('Invalid path');
        return;
      }
      fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
          res.statusCode = 404;
          res.end('File does not exist');
          return;
        }
      });
      fs.unlink(filepath, (err) => {
        if (err) {
          res.statusCode = 500;
          res.end('cannot delete file');
          return;
        }
        res.statusCode = 200;
        res.end('File has been deleted');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
