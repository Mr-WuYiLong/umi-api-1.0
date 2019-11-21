'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  oAuth2Server: {
    enable: true,
    package: 'egg-oauth2-server',
  },
  security: {
    enable: false,
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
};
