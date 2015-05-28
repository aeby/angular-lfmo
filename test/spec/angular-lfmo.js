describe('$lfmo factory', function () {
  'use strict';

  var $rootScope,
    $lfmo;

  beforeEach(module('angular-lfmo'));

  beforeEach(inject(function (_$rootScope_, _$lfmo_) {
    $rootScope = _$rootScope_;
    $lfmo = _$lfmo_;
  }));

  afterEach(function (done) {
    localforage.clear().then(function () {
      done();
    }, done);
  });

  it('service should be defined', function () {
    expect($lfmo).toBeDefined();
  });

  it('define should be defined', function () {
    expect($lfmo.define).toBeDefined();
    expect(typeof $lfmo.define).toBe('function');
  });

  describe('model tests', function () {
    var myModel,
      interval,
      triggerDigests = function () {
        return setInterval(function () {
          $rootScope.$digest();
        }, 10);
      },
      stopDigests = function (interval) {
        window.clearInterval(interval);
      };

    beforeEach(function (done) {
      interval = triggerDigests();
      myModel = $lfmo.define('myModel');
      myModel.indexReady().then(function () {
        done();
      });
    });

    afterEach(function (done) {
      localforage.clear().then(function () {
        stopDigests(interval);
        done();
      }, done);
    });

    it('should create and get a model instance', function (done) {
      var name = 'luuk';
      myModel.create({name: name})
        .then(function (data) {
          return myModel.get(data.id);
        }, done)
        .then(function (data) {
          expect(data.name).toEqual(name);
          done();
        }, done);
    });

    it('should create and get all models', function (done) {
      myModel.create({name: 'foo'})
        .then(function () {
          return myModel.create({name: 'bar'});
        })
        .then(function () {
          return myModel.findAll();
        })
        .then(function (data) {
          expect(data.length).toEqual(2);
          done();
        });
    });

    it('should find model with filter', function (done) {
      var name = 'luuk';
      myModel.create({name: name, age: 22})
        .then(function () {
          return myModel.create({name: 'foo', age: 30});
        })
        .then(function () {
          return myModel.findAll({age: 22});
        })
        .then(function (data) {
          expect(data.length).toEqual(1);
          expect(data[0].name).toEqual(name);
          done();
        });
    });

    it('should update a model', function (done) {
      var name = 'luuk';
      myModel.create({name: 'foo'})
        .then(function (item) {
          return myModel.update(item.id, {name: name});
        })
        .then(function () {
          return myModel.findAll();
        })
        .then(function (data) {
          expect(data[0].name).toEqual(name);
          done();
        });
    });

    it('should remove a model', function (done) {
      myModel.create({name: 'foo'})
        .then(function (item) {
          return myModel.remove(item.id);
        })
        .then(function () {
          return myModel.findAll();
        })
        .then(function (data) {
          expect(data.length).toEqual(0);
          done();
        });
    });

    it('should update scope on create with bindAll', function (done) {
      myModel.bindAll($rootScope, 'items');
      myModel.create({name: 'foo'});

      setTimeout(function () {
        expect($rootScope.items.length).toEqual(1);
        done();
      }, 100);
    });

    it('should update scope on update with bindAll', function (done) {
      var name = 'luuk';
      myModel.bindAll($rootScope, 'items');
      myModel.create({name: 'foo'})
        .then(function (model) {
          return myModel.update(model.id, {name: name});
        });

      setTimeout(function () {
        expect($rootScope.items[0].name).toEqual(name);
        done();
      }, 100);
    });

    it('should update scope on remove with bindAll', function (done) {
      myModel.bindAll($rootScope, 'items');
      myModel.create({name: 'foo'})
        .then(function (model) {
          return myModel.remove(model.id);
        });

      setTimeout(function () {
        expect($rootScope.items.length).toEqual(0);
        done();
      }, 100);
    });

    it('should update scope on create with bindOne', function (done) {
      var name = 'luuk';
      myModel.create({name: name})
        .then(function (item) {
          myModel.bindOne($rootScope, 'item', item.id);
        });

      setTimeout(function () {
        expect($rootScope.item.name).toEqual(name);
        done();
      }, 100);
    });

    it('should update scope on update with bindOne', function (done) {
      var name = 'luuk';
      myModel.create({name: 'bar'})
        .then(function (item) {
          myModel.bindOne($rootScope, 'item', item.id);
          myModel.update(item.id, {name: name});
        });

      setTimeout(function () {
        expect($rootScope.item.name).toEqual(name);
        done();
      }, 100);
    });

    it('should update scope on remove with bindOne', function (done) {
      myModel.create({name: 'bar'})
        .then(function (item) {
          myModel.bindOne($rootScope, 'item', item.id);
          myModel.remove(item.id);
        });

      setTimeout(function () {
        expect($rootScope.item).toBeNull();
        done();
      }, 100);
    });
  });
});
