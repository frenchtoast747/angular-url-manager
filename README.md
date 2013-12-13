angular-url-manager
===================

**DISCLAIMER:** I'm new to AngularJS so I'm probably doing something wrong...

Why I made this...
------------------
I'm used to using Django's URLConf, Views (Controllers), and Models setup. It was driving me nuts to see every example out there hard coding their URLs into the templates. For small applications where you only have a single link for a resource, this may not be a big deal, but for even middle sized applications, as soon as you want to change your URLs at all, you have to pretty much sed every instance of that URL.

Why would you want this?
-----------------------
If you're used to using Django's `{% url %}` tag or `reverse()` function and want the same functionality within your AngularJS app, then you'll probabaly like this.

Dependencies
------------
- ngRoute
  - Be sure to include `angular-route.js` in your `index.html`

How to Install
--------------
Inside of your `index.html`, add `url-manager.js` and make sure `ngRoute` is there also:

```html
<script src="/js/lib/angular-route.js"></script>
<script src="/path/to/url-manager.js"></script>
```

Add both `url.manager` and `ngRoute` as dependencies in your app:

```javascript
var app = angular.module('myApp', ['url.manager', 'ngRoute']);
```

Configuration
-------------
Instead of specifying your routes using the `ngRoute` module, you specify them using the `urlManagerProvider`'s 
`addUrlPattern` method (this automatically configures `ngRoute`):

```javascript
app.config(['urlManagerProvider', function(urlManagerProvider){
    urlManagerProvider
        .addUrlPattern('BookListView', '/', {
            templateUrl: 'book_list.html',
            controller : 'BookListCtrl'
        })
        .addUrlPattern('BookDetailView', '/books/:id/:slug/', {
            templateUrl: 'book_detail.html',
            controller : 'BookDetailCtrl'
        })
        .otherwise({
            redirectTo: 'nope.avi'
        });
}]);
```
The `addUrlPattern` method takes in three parameters:

1. The name of the view (must be unique)
1. The URL pattern to match. For example: `/books/:id/:slug/`
1. A configuration object. This is directly passed to `ngRoute`'s `when` method.

There is also an `otherwise` method which is just a wrapper around `ngRoute`'s `otherwise` method.

Usage
-----
The `url-manager` module includes a directive, `alink`, as a convience function that will output an `<a>` tag with the current URL given a view name and keyword arguments:

```html
<div ng-controller="BookListCtrl">
  <ul>
    <li><alink view="BookDetailView" id="42" slug="the-adventures-of-fred-funnies" text="The Adventures of Fred Funnies" /></li>
  </ul>
</div>
```

Assuming there is a view that exists with the name `BookDetailView` and has a url pattern of `'/books/:id/:slug/'` then the following `<a>` tag will be generated (and also replace the `<alink>` directive):

```html
<a href="/books/42/the-adventures-of-fred-funnies">The Adventures of Fred Funnies</a>
```

The `<alink>` directive has two required attributes, `view` which specifies the name of the view and `text` which specifies the new `<a>` tag's text node. Any other additional attribute added will be considered a keyword argument to the URL reverse function. Any attribute that does not match any of the url pattern's keywords will be safely ignored. For example: passing the attributes `id`, `slug`, and `title` with a url pattern of `/books/:id/:slug/`, the `title` attribute will be ignored and `id` and `slug` will match thus producing the url `/books/42/the-adventures-of-fred-funnies`.

Since, most of the time, data is usually passed around as objects, the `<alink>` directive has a special attribute `obj` that accepts a JavaScript object. So, assuming from the previous examples that `books` is a list of `book` objects where each book has the attributes `id`, `title`, and `slug`, the `<alink>` example can be simplified to:

```html
<div ng-controller="BookListCtrl">
  <ul>
    <li ng-repeat="book in boooks"><alink view="BookDetailView" obj="book" text="{{ book.title }}" /></li>
  </ul>
</div>
```
**Note:** The `obj` attribute does not require `"{{ book }}"`, but `"book"`.

Using the `urlManager.reverse()` method in controllers
------------------------------------------------------
Sometimes you may want to create a URL within the controller itself. This is simple. All that is needed to be done is to inject the `urlManager` into your controller and then call its `reverse` method:

```javascript
app.controller('BookListCtrl', function(urlManager, resourceManager, $location){
  var book;
  var books = resourceManager.getBooks().then(function(){
    book = books[0];
    $location.url(urlManager.reverse('BookDetailView', book));
    // or the second parameter could be built
    // $location.url(urlManager.reverse('BookDetailView', {id: book.pk, slug: slugify(book.title)});
  });
});
```

The `urlManager.reverse()` takes two arguments:

1. The name of the view
2. An object of parameters to match against the view's url pattern

Demo
----
A quick demo can be found in the `gh-pages` branch or a live demo can be found [here](http://frenchtoast747.github.io/angular-url-manager/)
