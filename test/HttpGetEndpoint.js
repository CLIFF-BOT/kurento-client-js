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

/**
 * {@link HttpEndpoint} test suite.
 * 
 * <p>
 * Methods tested:
 * <ul>
 * <li>{@link HttpEndpoint#getUrl()}
 * </ul>
 * <p>
 * Events tested:
 * <ul>
 * <li>{@link HttpEndpoint#addMediaSessionStartListener(MediaEventListener)}
 * <li>
 * {@link HttpEndpoint#addMediaSessionTerminatedListener(MediaEventListener)}
 * </ul>
 * 
 * 
 * @author Jesús Leganés Combarro "piranna" (piranna@gmail.com)
 * @version 1.0.0
 * 
 */

if(typeof QUnit == 'undefined')
{
  QUnit = require('qunit-cli');

  wock = require('wock');

  kwsMediaApi = require('..');

  require('./_common');
  require('./_proxy');
};


var PlayerEndpoint  = kwsMediaApi.endpoints.PlayerEndpoint;
var HttpGetEndpoint = kwsMediaApi.endpoints.HttpGetEndpoint;


QUnit.module('HttpGetEndpoint', lifecycle);

QUnit.asyncTest('Method GetUrl', function()
{
  QUnit.expect(2);

  HttpGetEndpoint.create(pipeline, function(error, httpGet)
  {
    if(error) return onerror(error);

    QUnit.notEqual(httpGet, undefined, 'httpGet');

    httpGet.getUrl(function(error, url)
    {
      if(error) return onerror(error);

      QUnit.notEqual(url, undefined, 'URL: '+url);

      QUnit.start();
    })
  });
});

QUnit.asyncTest('Media session started', function()
{
  QUnit.expect(5);


  var timeout = new Timeout(7 * 1000, onerror);


  PlayerEndpoint.create(pipeline, {uri: URL_SMALL}, function(error, player)
  {
    if(error) return onerror(error);

    QUnit.notEqual(player, undefined, 'player');

    player.on('EndOfStream', function(data)
    {
      QUnit.ok(true, 'EndOfStream');

      timeout.stop();

      QUnit.start();
    });

    HttpGetEndpoint.create(pipeline, function(error, httpGet)
    {
      if(error) return onerror(error);

      QUnit.notEqual(httpGet, undefined, 'httpGet');

      httpGet.on('MediaSessionStarted', function(data)
      {
        QUnit.ok(true, 'MediaSessionStarted');

        timeout.stop();

        player.play(function(error)
        {
          if(error) return onerror(error);

          timeout.start();
        });
      });

      player.connect(httpGet, function(error)
      {
        if(error) return onerror(error);

        httpGet.getUrl(function(error, url)
        {
          if(error) return onerror(error);

          QUnit.notEqual(url, undefined, 'URL: '+url);

          // This should trigger MediaSessionStarted event
          doGet(url,
          function()
          {
            timeout.start()
          },
          onerror);
        })
      });
    });
  });
});
