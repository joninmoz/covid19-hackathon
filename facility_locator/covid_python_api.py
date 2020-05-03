from http.server import HTTPServer, BaseHTTPRequestHandler
import http.server
import socketserver
import urllib.parse
from covid_facilities_recommender import generate_list_of_providers
import socketserver
import json
import cgi

from http.server import HTTPServer, SimpleHTTPRequestHandler, test
import sys

class CORSRequestHandler (SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

    def do_GET(self):
      print('HIT')
      o = urllib.parse.urlparse(self.path)
      self.send_response(200)
      self.send_header('Content-type', 'application/json')
      self.end_headers()
      self.wfile.write(generate_list_of_providers(urllib.parse.parse_qs(o.query)).encode())

#
# if __name__ == '__main__':
#     test(CORSRequestHandler, HTTPServer, port=int(sys.argv[1]) if len(sys.argv) > 1 else 8000)

class Server(BaseHTTPRequestHandler):
  def _set_headers(self):
    self.send_response(200)
    self.send_header('Content-type', 'application/json')
    self.end_headers()

  def do_HEAD(self):
    self._set_headers()

  # GET sends back a Hello world message
  def do_GET(self):
    print('HIT')
    o = urllib.parse.urlparse(self.path)
    self._set_headers()
    self.wfile.write(generate_list_of_providers(urllib.parse.parse_qs(o.query)).encode())


def run(server_class=HTTPServer, handler_class=CORSRequestHandler, port=8008):
  server_address = ('', port)
  httpd = server_class(server_address, handler_class)

  print('Starting httpd on port %d...' % port)
  httpd.serve_forever()


if __name__ == "__main__":
  from sys import argv

  if len(argv) == 2:
    run(port=int(argv[1]))
  else:
    run()
