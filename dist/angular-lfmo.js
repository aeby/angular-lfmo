/*!
* angular-lfmo
* @version 0.1.5
* @author Reto Aebersold <aeby@substyle.ch>
* @copyright (c) 2015 Reto Aebersold <https://github.com/aeby/>
* @license MIT <https://github.com/aeby/angular-lfmo/blob/master/LICENSE>
*
* @overview Simple models for localforage.
*/
(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) { // AMD
    define(['localforage'], function (localforage) {
      factory(root.angular, localforage);
    });
  } else if (typeof exports === 'object') {
    var angular = root.angular || (window && window.angular);
    module.exports = factory(angular, require('localforage')); // Node/Browserify
  } else {
    factory(root.angular, root.localforage); // Browser
  }
})(this, function (angular, localforage) {
  'use strict';

  angular.module('angular-lfmo', ['ng']).factory('$lfmo', ['$filter', '$q', '$parse', function ($filter, $q, $parse) {

    function uuid4() {
      var id = '', i;

      for (i = 0; i < 36; i = i + 1) {
        if (i === 14) {
          id += '4';
        }
        else if (i === 19) {
          id += '89ab'.charAt(Math.random() * 4);
        }
        else if (i === 8 || i === 13 || i === 18 || i === 23) {
          id += '-';
        }
        else {
          id += '0123456789abcdef'.charAt(Math.random() * 16);
        }
      }
      return id;
    }

    var Model = {
      _getItem: function (key) {
        var deferred = $q.defer();

        localforage.getItem(key).then(function (item) {
          deferred.resolve(item);
        }, function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      },

      _setItem: function (key, value) {
        var deferred = $q.defer();

        localforage.setItem(key, value).then(function (item) {
          deferred.resolve(item);
        }, function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      },

      _removeItem: function (key) {
        var deferred = $q.defer();

        localforage.removeItem(key).then(function (item) {
          deferred.resolve(item);
        }, function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      },

      _loadIndex: function () {
        var _this = this;
        return _this._getItem(_this.indexName).then(function (index) {
          if (!_this.index) {
            _this.index = index || [];
          }
          return _this.index;
        });
      },

      setName: function (modelName) {
        this.name = modelName;
        this.modelPrefix = modelName + '/';
        this.indexName = 'idx/' + modelName;
        this.lastModified = -1;
      },

      create: function (data) {
        var _this = this;

        if (!data.id) {
          data.id = uuid4();
        }

        return _this._loadIndex().then(function () {
          _this.index.push(data.id);
          _this._setItem(_this.indexName, _this.index);
          return _this._setItem(_this.modelPrefix + data.id, data);
        }).then(function (data) {
          _this.lastModified = Date.now();
          return data;
        });
      },

      update: function (id, data) {
        var _this = this;

        return _this.get(id).then(function (item) {
          angular.extend(item, data);
          return _this._setItem(_this.modelPrefix + id, item);
        }).then(function (item) {
          _this.lastModified = Date.now();
          return item;
        });
      },

      get: function (id) {
        var _this = this;

        return _this._getItem(_this.modelPrefix + id);
      },

      remove: function (id) {
        var _this = this;

        return _this._loadIndex().then(function () {
          _this.index.splice(_this.index.indexOf(id), 1);
          return _this._removeItem(_this.modelPrefix + id);
        }).then(function () {
          _this.lastModified = Date.now();
        });
      },

      findAll: function (filterExpression) {
        var _this = this;

        return _this._loadIndex().then(function () {
          var itemGets = [];
          if (_this.index) {
            _this.index.forEach(function (id) {
              itemGets.push(_this.get(id));
            });
          }
          return $q.all(itemGets);
        }).then(function (items) {
          return $filter('filter')(items, filterExpression);
        });
      },

      bindAll: function (scope, scopeKey, filterExpression) {
        var _this = this;

        return scope.$watch(function () {
          return _this.lastModified;
        }, function () {
          _this.findAll(filterExpression).then(function (items) {
            var model = $parse(scopeKey);
            model.assign(scope, items);
          });
        });
      },

      bindOne: function (scope, scopeKey, id) {
        var _this = this;

        return scope.$watch(function () {
          return _this.lastModified;
        }, function () {
          _this.get(id).then(function (item) {
            var model = $parse(scopeKey);
            model.assign(scope, item);
          });
        });
      }
    };

    return {
      define: function (name) {
        var myModel = Object.create(Model);
        myModel.setName(name);
        return myModel;
      }
    };
  }]);
});
