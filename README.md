# rustic.js


A simple albeit powerful jQuery plugin for creating elegant page by page scrolling

**This plugin was written as a fun personal project when I was a kid. It has not
been in development since 2015.**


## Contribution and Issues


This plugin is early in development and new features will be added soon. Feel free to contribute by sending in [pull requests](http://github.com/pratinav/rustic.js/pulls) and help me improve the plugin by pointing out bugs in the [issues page](http://github.com/pratinav/rustic.js/issues).


#### Pull Requests


Feel free to send in [pull requests](http://github.com/pratinav/rustic.js/pulls) to improve the plugin or add new features. If you want to add a new feature please send in a clear and elaborate description and explanation of the working of it and a [codepen](http://codepen.io) or [jsFiddle](http://jsFiddle.net) demostrating your feature. Your feature has to be compatible with all other features and settings available.


#### Issues


Feel free to report any issues/problems with the plugin at [issues page](http://github.com/Pratinav/jCider/issues).


You may send me an email describing your issue.

## Installation


- Download the files or use the CDN.

- Link ```rustic.js.min.js``` or ```rustic.js``` in your ```head``` tag or at the end of your ```body``` tag.


**Don't forget to link [jQuery](https://jquery.com) before the rustic.js file.**


Like this:

```
<script type="text/javascript" src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="PATH_TO_FILE/rustic.min.js"></script>
```

**CDN**

```
<script type="text/javascript" src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.rustic.js/latest/rustic.min.js"></script>
```

#### Package Managers


For [Bower](http://bower.io)-


`bower install --save rustic.js`


For [NPM](http://npmjs.com)-


`npm install --save rustic.js`


## Usage


#### HTML


The scroller uses a 2 layer structure in the HTML document. For, example-

```
<div class="main">
	<section>First page</section>
	<section>Second Page</section>
	<section>Third page</section>
</div>
```

For the rest of the docs we will refer to the outermost element as the **wrapper**, and the innermost elements as the **pages**.


All your content for each slide should go inside the innermost elements, as illustrated above.


The **wrapper** or **page elements** are not limited to any specific elements or Class/ID names. So this too can be used-

```
<section>
	<div>First Page</div>
	<div>Second Page</div>
	<div>Third Page</div>
</section>
```

**Only insert page elements in the wrapper.**


#### CSS


You will have to give your desired dimensions to the **page elements** yourself. The plugin supports variable height and width to the **page elements**. The [Pagination CSS](#pagination-css) option allows you to enable or disable the default pagination styles.


#### Basic Usage


Put the following code in ```script``` tags in the ```head``` tag of your HTML document.

```
$(document).ready(function(){
	// Make sure to call rustic on the wrapper element
	$('yourWrapperElementHere').rustic();
});
```

> Make sure to call ```.rustic()``` on the wrapper element. 


#### Advance Usage- Settings


You can pass in multiple options as arguments for the `.rustic()` function. They are-

```
$('yourWrapperElementHere').rustic.js({
	looping: false, // For looping at the end of slides,
	defaultCallback: [ // Default callback function before/after all slide-changes
		function() {}, // Before
		function() {} // After
	],
	specificCallbacks: { // Specific callback functions before and after slide-change
		1: [ // Page number
			function() {

			}, // Before
			function() {

			} // After
		]
	},
	breakingPoint: 0, // For breaking scroll at specific width
	easing: 'easeInOutQuad', // JS easing
	transitionDuration: 800, // Duration of slide transition
	pagination: true, // For visibility of default pagination,
	paginationWrapper: ['div.rustic-pagination', ''], // Element for pagination wrapper
	paginationPoint: ['span.rustic-pagination-point', ''], // Element for pagination points
	paginationCss: true, // For default pagination styles
	specificPaginationPoints: { // Element for specific pagination points. Only if paginationCss is false.
		1: '<span class="rustic-pagination-point custom"></div>' // Pagination number. Corresponds to page number
	}
});
```

| Setting Name | Value | Description | Default |
|--------------|-------|-------------|---------|
| looping | boolean | Selects if looping is one. true is looping. | false |
| defaultCallback | array > 2 functions | [More information below.](#default-callback) | empty |
| specificCallbacks | object > arrays > 2 functions | [More information below.](#specific-callbacks) | empty |
| breakingPoint | integer | Selects the breaking point for the page-scrolling in pixels`. It reverts to ordinary scrollling, after breaking. The pagination still functions. | 0 |
| easing | string | JS Easing for transitions. Default options are- `easeInOutQuad`, `linear` and `swing`. For more options you may use the [jQuery Easing plugin](http://gsgd.co.uk/sandbox/jquery/easing/) | 'easeInOutQuad' |
| transitionDuration | integer | Selects the transition-duration for the slide changes in milliseconds | 800 |
| pagination | boolean | Selects if pagination is present or absent. true is present. | true |
| paginationWrapper | array > string * 2 | Selector for the pagination wrapper. Array containing two strings. The first string is the Element followed by an optional id or multiple classes. Multiple classes must be separated by periods. The second string is optional content. | ['div.rustic-pagination', ''] |
| paginationPoint | array > string * 2 | Selector for each pagination point. Array containing two strings. The first string is the Element followed by an optional id or multiple classes. Multiple classes must be separated by periods. The second string is optional content. | ['div.rustic-pagination', ''] |
| paginationCss | boolean | [More information below.](#pagination-css) | true |
| specificPaginationPoints | object > arrays > string * 2 | [More information below.](#specific-pagination-points) | empty |



#### Default Callback


**Name:** `defaultCallback`


**Contains:** Array with two functions.


Default before/after callbacks for all page-changes. The first function in the array executes before any page-transition takes place. The second function in the array executes after any page-transition takes place.


**Default:** Empty


**Example**

```
$(wrapperElement).rustic({
	// Some options,
	defaultCallback: [
		function() {
			// Before transition
		},
		function() {
			// After transition
		}
	]
});
```




#### Specific Callbacks


**Name:** `specificCallbacks`


**Contains:** Object with multiple arrays. Each array with two functions.


Custom before/after callbacks for specific pages. Overrides default callback. Use the page number as an object property name. The property must contain an array with two functions. The first function in the array executes before the page-transition takes place. The second function in the array executes after any page-transition takes place. The functions execute before and after the page-transition **to the specified page takes place.**


**Default:** Empty


**Example**

```
$(wrapperElement).rustic({
	// Some options,
	specificCallbacks: {
		1: [ // first page
			function() {
				// Before transition to the first page
			},
			function() {
				// After transition to the first page
			}
		],
		3: [ // third page
			function() {
				// Before transition to the third page
			},
			function() {
				// After transition to the third page
			}
		]
	}
});
```




#### Pagination CSS


**Name:** `paginationCss`


**Contains:** boolean


**Only applicable if the `pagination` option is set to `true`**

Selects if default pagination styles are present or not. true is present. false is absent.


If not using default styles you can use your own custom styles for the pagination. Default styles may override any custom styles.


**Default:** true


**Example**

```
$(wrapperElement).rustic({
	// Some options,
	paginiationCss: false
});
```




#### Specific pagination points


**Name:** `specificPaginationPoints`


**Contains:** Object containing strings.


**Only applicable if the `pagination` and `paginationCss` options are set to `true**

You may have different elements (tag, class, ID, content) for different pagination-points according to their number. The object must contain the pagination-point number as the property name and the string containing the element as the value.


**Default:** empty


**Example**

```
$(wrapperElement).rustic({
	// Some options,
	specificPaginationPoints: {
		1: ['span.rustic-pagination-point custom', 'someContent'], // First pagination-point
		3: ['span.rustic-pagination-point.anyClass#anyID', 'someContent2'], // Third pagination-point
		7: ['div.anyElement', 'someContent3'] // Seventh pagination-point
	}
});
```


#### Summary


By now your code must look similar to this-


**HTML**

```
<body>
	<section id="main">
		<div>First page</div>
		<div>Second Page</div>
		<div>Third page</div>
		<div>Fourth page</div>
		<div>Fifth page</div>
		<div>Sixth page</div>
	</section>

	<script type="text/javascript" src="//code.jquery.com/jquery-1.11.3.min.js"></script>
	<script type="text/javascript" src="PATH_TO_FILE/rustic.min.js"></script>
</body>
```

**CSS**

```
div {
	width: 100%;
	height: 100vh;
}
```

**JS**

```
$(document).ready(function() {
	$('#main').rustic({
		element: 'div',
		looping: 'true',
		transitionDuration: 400,
		breakingPoint: 540
	});
});
```


## Functions


The plugin provides functions other than `.rustic()` to provide more extensibility, to suit your requirements.


#### `rustic.moveUp()`


The `rustic.moveUp()` function makes the page transition upwards once.


**Arguments:** none


Example:

```
$(document).ready(function() {
	$('#main').rustic({
		//Some options
	});

	$('button#up').click(function() {
		$('#main').rustic.moveUp();
	});
});
```


#### `rustic.moveDown()`


The `rustic.moveDown()` function makes the page transition upwards once.


**Arguments:** None


Example:

```
$(document).ready(function() {
	$('#main').rustic({
		//Some options
	});

	$('button#down').click(function() {
		$('#main').rustic.moveDown();
	});
});
```


#### `rustic.moveTo(page)`


The `rustic.moveTo(page)` function makes the page transition to your desired page.


**Arguments:** Page number to be transitioned to. (integer)


Example:

```
$(document).ready(function() {
	$('#main').rustic({
		//Some options
	});

	$('button#home').click(function() {
		$('#main').rustic.moveTo(1);
	});
});
```


#### `rustic.hidePagination()`


The `rustic.hidePagination()` function disables the pagination.


**Arguments:** None


Example:

```
$(document).ready(function() {
	$('#main').rustic({
		//Some options
	});

	$('button#hide').click(function() {
		$('#main').rustic.hidePagination();
	});
});
```


#### `rustic.showPagination()`


The `rustic.showPagination()` function enables the pagination.


**Arguments:** None


Example:

```
$(document).ready(function() {
	$('#main').rustic({
		//Some options
	});

	$('button#show').click(function() {
		$('#main').rustic.showPagination();
	});
});
```


#### `rustic.togglePagination()`


The `rustic.togglePagination()` function toggles between enabling and disabling the pagination.


**Arguments:** None


Example:

```
$(document).ready(function() {
	$('#main').rustic({
		//Some options
	});

	$('button#show').click(function() {
		$('#main').rustic.showPagination();
	});
});
```


#### `unrustic()`


The `unrustic()` function disables the page-transitions.


**Arguments:** None


Example:

```
$(document).ready(function() {
	$('#main').rustic({
		//Some options
	});

	$('button#destroy').click(function() {
		$('#main').unrustic();
	});
});
```


#### `rerustic()`


The `rerustic()` function re-enables the page-transitions and can be used for changing settings.


**Arguments:** (Optional) Settings


Example:

```
$(document).ready(function() {
	$('#main').rustic({
		//Some options
		transitionDuration: 700
	});

	$('button#change').click(function() {
		// Change settings or re-enable transitions
		$('#main').rerustic({
			transitionDuration: 300	
		});
	});
});
```


#### `rustic.toggle()`


The `rustic.toggle()` function toggles between enabling and disabling the page-transitions.


**Arguments:** None


Example:

```
$(document).ready(function() {
	$('#main').rustic({
		//Some options
	});

	$('button#toggle').click(function() {
		$('#main').rustic.toggle();
	});
});
```


## Dependencies


[jQuery](https://jquery.com) - 1.x

## License

Released under [The MIT License](http://github.com/Pratinav/rustic.js/blob/master/LICENSE.txt).

