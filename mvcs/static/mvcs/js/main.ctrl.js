// Get the module "app" and init a new controller "MainController"
// The second argument to the controller method is a function where all of
// the controlling code will live.
angular.module("app").controller("MainController", function(){
  var viewModel = this;
  viewModel.title = 'AngularJS Tutorial Example';
  viewModel.searchInput = '';
  viewModel.shows = [
    {
        title: 'Game of Thrones',
        year: 2011,
        favorite: true
    },
    {
        title: 'Walking Dead',
        year: 2010,
        favorite: false
    },
    {
        title: 'Firefly',
        year: 2002,
        favorite: true
    },
    {
        title: 'Banshee',
        year: 2013,
        favorite: true
    },
    {
        title: 'Greys Anatomy',
        year: 2005,
        favorite: false
    }
  ];
  viewModel.orders = [
    {
        id: 1,
        title: 'Year Ascending',
        key: 'year',
        reverse: false
    },
    {
        id: 2,
        title: 'Year Descending',
        key: 'year',
        reverse: true
    },
    {
        id: 3,
        title: 'Title Ascending',
        key: 'title',
        reverse: false
    },
    {
        id: 4,
        title: 'Title Descending',
        key: 'title',
        reverse: true
    }
  ];
  viewModel.order = viewModel.orders[0];

  viewModel.new = {};
  viewModel.addShow = function() {
    viewModel.shows.push(viewModel.new);
    viewModel.new = {};
  };
});
