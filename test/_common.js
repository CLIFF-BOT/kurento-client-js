/*
 * (C) Copyright 2013 Kurento (http://kurento.org/)
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl-2.1.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 */

URL_BARCODES         = "https://ci.kurento.com/video/barcodes.webm";
URL_FIWARECUT        = "https://ci.kurento.com/video/fiwarecut.webm";
URL_PLATES           = "https://ci.kurento.com/video/plates.webm";
URL_POINTER_DETECTOR = "https://ci.kurento.com/video/pointerDetector.mp4";
URL_SMALL            = "https://ci.kurento.com/video/small.webm";


/**
 * Set an assert error and re-start the test so it can fail
 */
function onerror(error)
{
  QUnit.ok(false, error.message || error);

  QUnit.start();
};

/**
 * Do an asynchronous HTTP GET request both on Node.js & browser
 */
doGet = function doGet(url, onsuccess, onerror)
{
  // Node.js
  if(typeof XMLHttpRequest == 'undefined')
    require('http').get(url, onsuccess).on('error', onerror);

  // browser
  else
  {
    var xhr = new XMLHttpRequest();

    xhr.open("get", url);
    xhr.send();

    xhr.addEventListener('load', onsuccess);
    xhr.addEventListener('error', onerror);
  };
};


/**
 * Manage timeouts in an object-oriented style
 */
Timeout = function Timeout(delay, ontimeout)
{
  if(!(this instanceof Timeout))
    return new Timeout(delay, ontimeout);

  var timeout;

  function _ontimeout(message)
  {
    clearTimeout(timeout);

    ontimeout(message);
  };

  this.start = function()
  {
    timeout = setTimeout(_ontimeout, delay, 'Time out ('+delay+'ms)');
  };

  this.stop = function()
  {
    clearTimeout(timeout);
  };
};


// Tell QUnit what WebSocket servers to use

QUnit.config.urlConfig.push(
{
  id: "ws_uri",
  label: "WebSocket server",
  value:
  {
    'ws://130.206.81.87/thrift/ws/websocket':  'Kurento demo server',
    'ws://127.0.0.1:8080/thrift/ws/websocket': 'localhost (puerto 8080)'
  },
  tooltip: "Exec the tests using a real WebSocket server instead of a mock"
});


// Tests lifecycle

lifecycle =
{
  setup: function()
  {
    var ws_uri = QUnit.config.ws_uri;
    if(ws_uri == undefined)
    {
    //  var WebSocket = wock(proxy);
    //  ws_uri = new WebSocket();
      ws_uri = 'ws://130.206.81.87/thrift/ws/websocket';
    };

    kwsMedia = new kwsMediaApi.KwsMedia(ws_uri);

    kwsMedia.on('error', onerror);

    kwsMedia.on('connect', function()
    {
      kwsMedia.createMediaPipeline(function(error, pipe)
      {
        if(error) return onerror(error);

        pipeline = pipe;

        QUnit.start();
      });
    });

    QUnit.stop();
  },

  teardown: function()
  {
    kwsMedia.close();
  }
};
