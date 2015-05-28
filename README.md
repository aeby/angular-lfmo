angular-lfmo [![Build Status](https://travis-ci.org/aeby/angular-lfmo.svg)](https://travis-ci.org/aeby/angular-lfmo)
============

Angular factory to define simple models for https://github.com/mozilla/localForage (Offline storage, improved.)


----------

## Features:
- Manages your model entries using an index

- Allows you to find your models using [filter expressions](https://docs.angularjs.org/api/ng/filter/filter)

- Bind one entry or a collection to your `$scope`

- Lightweight (3kB) and depends on localForage only

## Usage:
- Download the project or install via bower `bower install angular-lfmo` or npm `npm install angular-lfmo`
- Download [localForage](https://github.com/mozilla/localForage) or install via bower `bower install localforage` or npm `npm install localforage`
- Put _angular-lfmo.js_ and _localforage.js_ into your project
- Add the module `angular-lfmo` to your application
```js
angular.module('yourModule', ['angular-lfmo']);
```
- Use the `$lfmo` factory
```js
angular.module('yourModule', ['angular-lfmo'])
  .controller('yourCtrl', ['$scope', '$lfmo', function ($scope, $lfmo) {
    var myModel = $lfmo.define('myModel');

    myModel.bindAll($scope, 'items', {isActive: true});

    myModel.create({name: 'foo', isActive: true})
      .then(function (model) {
        return myModel.update(model.id, {name: 'bar'});
      });

    myModel.create({name: 'john', isActive: false});

  }]);
```

Visit [this plunker](http://plnkr.co/edit/D7mJ5CsiKMqEtM0ROxtT?p=preview) for a complete example.

## Factory Functions:

- `define(name)`: returns a model

## Model Functions:

- `create(data)`: creates a new entry

- `get(id)`: retrieves an entry

- `update(id, data)`: updates an entry at given id

- `remove(id)`: removes an entry

- `findAll(filterExpression)`: finds all entries matching the given [filter expression](https://docs.angularjs.org/api/ng/filter/filter)

- `bindAll($scope, scopeKey, filterExpression)`: lets you directly bind all entries matching the given [filter expression](https://docs.angularjs.org/api/ng/filter/filter) to a $scope variable

- `bindOne($scope, scopeKey, id)`: lets you directly bind an entry to a $scope variable
