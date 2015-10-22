/* global process */
/* global it */
/* global describe */
var should = require("should");
var urllib = require('urllib');
var Concept = require('nagu-concepts').Concept;

var base = 'http://localhost:18080/concepts/';

describe('Concept model test', function () {

	var id = null;
	it('create.创建Concept', function (done) {
		this.timeout(15000);
		urllib.request(base, {
			type: 'PUT',
			data: {
				name: 'restName',
				desc: 'restDesc'
			}
		}, function(err, data){
			should.not.exist(err);
			var c = JSON.parse(data.toString());
			c.ret.should.eql(0);
			should.ok(c.data.id);
			id = c.data.id;
			done();
		});
	});

	it('get.获取Concept', function (done) {
		this.timeout(15000);
		urllib.request(base + id, {
			type: 'GET'
		}, function(err, data){
			var c = JSON.parse(data.toString());
			c.ret.should.eql(0);
			should.ok(c.data.id);
			c.data.labels.indexOf(Concept.LABEL).should.above(-1);
			c.data.names.indexOf('restName').should.above(-1);
			c.data.descs.indexOf('restDesc').should.above(-1);
			done();
		});
	});
	
	it('添加Concept的name', function(done){
		this.timeout(15000);
		urllib.request(base + id + '/name', {
			type: 'PUT',
			data: {
				name: 'restName2'
			}
		}, function(err, data){
			urllib.request(base + id + '/name', {			// 执行两次添加，确保只会被添加一次
				type: 'PUT',
				data: {
					name: 'restName2'
				}
			}, function(err, data){
				urllib.request(base + id, {
					type: 'GET'
				}, function(err, data){
					var c = JSON.parse(data.toString());
					c.ret.should.eql(0);
					c.data.names.indexOf('restName2').should.above(-1);
					c.data.names.indexOf('restName2').should.be.eql(c.data.names.lastIndexOf('restName2'));
					done();
				});
			});
		
			
		});
	});
	
	it('添加Desc', function(done){
		this.timeout(15000);
		urllib.request(base + id + '/desc', {
			type: 'PUT',
			data: {
				desc: 'restDesc2'
			}
		}, function(err, data){
			urllib.request(base + id + '/desc', {			// 执行两次添加，确保只会被添加一次
				type: 'PUT',
				data: {
					desc: 'restDesc2'
				}
			}, function(err, data){
				urllib.request(base + id, {
					type: 'GET'
				}, function(err, data){
					var c = JSON.parse(data.toString());
					c.ret.should.eql(0);
					c.data.descs.indexOf('restDesc2').should.above(-1);
					c.data.descs.indexOf('restDesc2').should.be.eql(c.data.descs.lastIndexOf('restDesc2'));
					done();
				});
			});
		});
	});
	
	it('findByName', function(done){
		this.timeout(15000);
		urllib.request(base + '/by-name/restName', {
			type: 'GET'
		}, function(err, data){
			var c = JSON.parse(data.toString());
			c.ret.should.eql(0);
			c.data.length.should.above(0);
			done();
		});
	});
	
	it('删除Concept的name', function(done){
		this.timeout(15000);
		urllib.request(base + id + '/name', {
			type: 'DELETE',
			data: {
				name: 'restName2'
			}
		}, function(err, data){
			urllib.request(base + id + '/name', {			// 执行两次添加，确保只会被添加一次
				type: 'DELETE',
				data: {
					name: 'restName2'
				}
			}, function(err, data){
				urllib.request(base + id, {
					type: 'GET'
				}, function(err, data){
					var c = JSON.parse(data.toString());
					c.ret.should.eql(0);
					c.data.names.indexOf('restName2').should.eql(-1);
					done();
				});
			});
		
			
		});
	});
	
	it('删除desc', function(done){
		this.timeout(15000);
		urllib.request(base + id + '/desc', {
			type: 'DELETE',
			data: {
				desc: 'restDesc2'
			}
		}, function(err, data){
			urllib.request(base + id + '/desc', {			// 执行两次添加，确保只会被添加一次
				type: 'DELETE',
				data: {
					desc: 'restDesc2'
				}
			}, function(err, data){
				urllib.request(base + id, {
					type: 'GET'
				}, function(err, data){
					var c = JSON.parse(data.toString());
					c.ret.should.eql(0);
					c.data.descs.indexOf('restDesc2').should.eql(-1);
					done();
				});
			});
		});
	})
	
	
	it('删除Concept', function (done) {
		this.timeout(15000);
		urllib.request(base + id, {
			type: 'DELETE'
		}, function(err, data){
			var c = JSON.parse(data.toString());
			c.ret.should.eql(0);
			urllib.request(base + id, {
				type: 'GET'
			}, function(err, data){
				var c = JSON.parse(data.toString());
				c.ret.should.below(0);
				done();
			});
		});
	});
});