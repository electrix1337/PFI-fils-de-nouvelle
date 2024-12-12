/////////////////////////////////////////////////////////////////////
// This module is the starting point of the http server
/////////////////////////////////////////////////////////////////////
// Author : Nicolas Chourot
// Lionel-Groulx College
/////////////////////////////////////////////////////////////////////

import APIServer from "./APIServer.js";
import RouteRegister from './routeRegister.js';

//bookmarks
RouteRegister.add('GET', 'Bookmarks', 'list');
//likes
RouteRegister.add('GET', 'likes', 'deleteuser');
RouteRegister.add('GET', 'likes', 'getliked');
RouteRegister.add('GET', 'likes', 'getlikesfrompost');
RouteRegister.add('GET', 'likes', 'setlike');


//accounts
RouteRegister.add('GET', 'accounts');
RouteRegister.add('POST', 'accounts', 'register');
RouteRegister.add('GET', 'accounts', 'verify');
RouteRegister.add('GET', 'accounts', 'logout');
RouteRegister.add('PUT', 'accounts', 'modify');
RouteRegister.add('GET', 'accounts', 'remove');
RouteRegister.add('GET', 'accounts', 'deleteuser');
RouteRegister.add('GET', 'accounts', 'conflict');
RouteRegister.add('POST', 'accounts', 'block');
RouteRegister.add('POST', 'accounts', 'promote');

let server = new APIServer();
server.start();