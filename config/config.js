/* global process */

var env = process.env.NODE_ENV || 'production';

var config = {
  development: {
    port: 18080,
    neo_url: process.env.NEO_HOST || 'http://localhost:7474'
  },

  production: {
    port: 18080,
    neo_url: process.env.NEO_HOST || 'http://neo4j.ynu.edu.cn'
  }
};

module.exports = config[env];
