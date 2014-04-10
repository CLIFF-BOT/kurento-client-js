/*
 * (C) Copyright 2013-2014 Kurento (http://kurento.org/)
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

var extend   = require('extend');
var inherits = require('inherits');


/**
 * Media API for the Kurento Web SDK
 *
 * @module kwsMediaApi/endpoints
 *
 * @copyright 2013-2014 Kurento (http://kurento.org/)
 * @license LGPL
 */

var Endpoint = require('../Endpoint');


/**
 * Session based endpoint. A session is considered to be started when the media exchange starts. On the other hand, sessions terminate when a timeout, defined by the developer, takes place after the connection is lost.
 *
 * @abstract
 * @class   module:kwsMediaApi/endpoints~SessionEndpoint
 * @extends module:kwsMediaApi~Endpoint
 */

/**
 *
 * @constructor
 *
 * @param {string} id
 * @param {module:kwsMediaApi~MediaContainer} parent
 * @param {module:kwsMediaApi~MediaPipeline} pipeline
 * @param {module:kwsMediaApi/endpoints~SessionEndpoint.constructorParams} params
 */
function SessionEndpoint(id, parent, pipeline, params)
{
  Endpoint.call(this, id, parent, pipeline, params);
};
inherits(SessionEndpoint, Endpoint);


/**
 * @type   module:kwsMediaApi/endpoints~SessionEndpoint.constructorParams
 * @extend module:kwsMediaApi~Endpoint.constructorParams
 */
SessionEndpoint.constructorParams = {};
extend(SessionEndpoint.constructorParams, Endpoint.constructorParams);

/**
 * @type   module:kwsMediaApi/endpoints~SessionEndpoint.events
 * @extend module:kwsMediaApi~Endpoint.events
 */
SessionEndpoint.events = ['MediaSessionStarted', 'MediaSessionTerminated'];
SessionEndpoint.events.concat(Endpoint.events);


module.exports = SessionEndpoint;
