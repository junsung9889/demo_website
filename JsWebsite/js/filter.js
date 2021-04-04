
/********************************/
/*	Initialization Functions 	*/
/********************************/

//	Step 1: Function to add the reference to Sisense.js
function initScript(){
	//	Save a copy of the original jQuery library, to avoid conflicts
	window.jq = $.noConflict();
	//  Define the script tag to add
    var tag = document.createElement('script');
    tag.src = mySisenseApp.settings.server + '/js/sisense.js';
    tag.id = 'sisense-script';
    tag.type = 'text/javascript';
    tag.charset = 'utf-8';

    //  Add event handler for when the script loads
    tag.onload = connect;
    //  Add the tag to the web page
    document.getElementsByTagName('body')[0].appendChild(tag);
}

//	Step 2: Function to start a connection to sisense.js
function connect(){

	//	Attempt to connect to the Sisense server
	try {
		Sisense.connect(mySisenseApp.settings.server)
			.then(loadApplication);
	} catch (err){
		console.log("Error: Failed connecting to the Sisense server")
	}
}

//	Step 3: Function to load the dashboard/widgets
function loadApplication(app){
	//  Save a reference to the sisenseApp
	mySisenseApp.app = app;
	//  Create a dashboard to store any potential widgets
	var dash = new Dashboard();
	//	Set the Elasticube for this dashboard (needed for filters)
	dash.datasource = mySisenseApp.settings.elasticube;

	//	Save the dashboard to the application
	mySisenseApp.app.dashboards.add(dash);
	mySisenseApp.dashboard = dash;

	//widget_default.js
	// var widgets = $('div[widgetid]');
	var url = mySisenseApp.settings.server + '/api/v1/dashboards/' + mySisenseApp.dashboardId + '/widgets';
	var app = mySisenseApp.app;
	$widgetSelect = $('<select></select>');
	//	Make an API call to get the filters from an existing dashboard
	app.$$http.get(url).then(function(response){
		var wArr = response.data;
		for(var w = 0; w < wArr.length; w++) {
			var t = wArr[w].title != '' ? wArr[w].title : wArr[w].oid;
			// $widgetSelect.append('<option value="' + wArr[w].oid + '">' + t + '</option>');
			//console.log(t);
			// $wdiv = $(`<div id=${"card-W-"+wArr[w].oid}>
			// 								<div class="card border-left-warning shadow h-100 py-2">
			// 										<div class="card-body">
			// 												<div class="row no-gutters align-items-center">
			// 														<div class="col mr-2">
			// 																<div class="text-xs font-weight-bold text-dark text-uppercase mb-1">
			// 																	<a class="title W-${wArr[w].oid}"></a> (W-${wArr[w].oid})
			// 																	<div class="test" id=${'W-'+wArr[w].oid} widgetid=${wArr[w].oid}>
			// 																		<div class="description widget"></div>
			// 																	</div>
			// 														</div>
			// 												</div>
			// 										</div>
			// 								</div>
			// 							</div>
			// 						</div>`);
			// $wa = $(`<a class="collapse-item" href="#">${'W-'+wArr[w].oid}</a>`)
			// //append the div area to the DOM
			// $('.grid_sisense').append($wdiv);
			// $(`.widgets`).append($wa);
			//
			// mySisenseApp.dashboard.widgets.load(wArr[w].oid).then(function(widget){
			// 	//	Find the contianer to render the widget into
			// 	var widgetDiv = document.getElementById("W-" + widget.id);
			// 	widget.container = widgetDiv;
			// 	widget.refresh();
			// 	//	Set the title
			// 	$(`a.W-${widget.id}`).text(widget.title);
			// });
		}
	});

	// var $addWidget = $('<span>[ + ]</span>');
	// var $removeWidget = $('<span>[ - ]</span>');
	// $('#selectorDiv').append($widgetSelect);
	// $('#selectorDiv').append($addWidget);
	// $('#selectorDiv').append($removeWidget);
	var sdash = mySisenseApp.dashboard;
	// $addWidget.on('click', function() {
	// 	//add a div area
	// 	if(!sdash.widgets.get($widgetSelect.val()).container) {
	// 		//console.log('Container Not Assigned');
	// 		$wdiv = $(`<div id=${"card-W-"+$widgetSelect.val()}>
	// 										<div class="card border-left-warning shadow h-100 py-2">
	// 												<div class="card-body">
	// 														<div class="row no-gutters align-items-center">
	// 																<div class="col mr-2">
	// 																		<div class="text-xs font-weight-bold text-dark text-uppercase mb-1">
	// 																			W-${$widgetSelect.val()}
	// 																			<div id=${'W-'+$widgetSelect.val()} widgetid=${wArr[w].oid}>
	// 																				<div class="description widget"></div>
	// 																			</div>
	// 																</div>
	// 														</div>
	// 												</div>
	// 										</div>
	// 									</div>
	// 								</div>`);
	// 		//append the div area to the DOM
	// 		$('.grid_sisense').append($wdiv);
	// 		//assign the widget to the Div area
	// 		sdash.widgets.get($widgetSelect.val()).container = document.getElementById("W-" + $widgetSelect.val());
	// 		sdash.widgets.get($widgetSelect.val()).refresh();
	// 	}
	// 	else {
	// 		$('#card-W-' + $widgetSelect.val()).show();
	// 		sdash.widgets.get($widgetSelect.val()).refresh();
	// 	}
	// });
	// $removeWidget.on('click', function() {
	// 	//remove the div area
	// 	$('#card-W-' + $widgetSelect.val()).hide();
	// });
	//
	// //	Find any filters on our web page
	// var filters = $('.filter');
	// filters.each(initFilter);
}

function initFilter(index, element){
	//	Figure out the filter properties
	var type = $(element).attr('type'),
		dimension = $(element).attr('dim'),
		datatype = $(element).attr('datatype'),
		label = $(element).text() ? $(element).text().trim() : '',
		selection = $(element).attr('selection'),
		dims = $(element).attr('dims') ? $(element).attr('dims').split(',') : null;
	//	Get a reference to the $http service
	var $http = mySisenseApp.app.$$http;
	//	Determine the URL for data queries
	var queryUrl = mySisenseApp.settings.server + '/api/datasources/'
					+ mySisenseApp.settings.elasticube.title + '/jaql';

	//	Handle different filter types
	if (type == 'toggle') {
		/*	Simple toggle switch	*/
		//	Function to reset the UI for this filter
		function reset(){
			//	Remove the active class
			$(this.element).removeClass('active');
		}
		//	no UI setup, just save a reference to the filter
		mySisenseApp.filters[index] = {
			type: type,
			element: element,
			title: label,
			datatype: datatype,
			dimension: dimension,
			selection: false,
			selectionValue: selection,
			reset: reset
		};

		//	Save the index to the element, just in case
		$(element).attr('index',index);

		//	Add click handler
		$(element).on('click', function(){
			setFilter(mySisenseApp.filters[index], !mySisenseApp.filters[index].selection)
		});
	} else if (type == 'dropdown') {
		/*	Dropdown Menu	*/
		//	Function to reset the UI for this filter
		function reset(){
			//	Restore the default selections from when the page loaded
			jq(this.element).dropdown('restore defaults')
		}

		//	Save a reference to the filter
		mySisenseApp.filters[index] = {
			type: type,
			element: element,
			title: label,
			datatype: datatype,
			dimension: dimension,
			selection: null,
			selectionValue: selection,
			reset: reset
		}

		//	Save the index to the element, for later use
		$(element).attr('index',index);

		//	Build a query for the data
		var payload = {
			datasource: mySisenseApp.dashboard.datasource,
			metadata: [{
				jaql: {
					dim: dimension,
					datatype: datatype
				}
			}]
		}

		//	Make the API call
		$http.post(queryUrl,payload).then(function(response){

			//	Get the menu, which holds an array of list items
			var menu = $('.menu', element);

			//	Clear any existing content
			menu.empty();

			//	Loop through the responses, and add the HTML
			response.data.values.forEach(function(member){

				//	Create the list item
				var li = '<div class="item" data-value="' + member[0].text + '">' + member[0].text + '</div>';

				//	Add to the dropdown menu
				menu.append(li);
			})

			//	Init the menu
			jq(element).dropdown({
				on: 'hover',
				onChange: function(value, text, $selectedItem) {
					//	Update the sisense dashboard
					setFilter(mySisenseApp.filters[index], value)
				}
			});
		})
	} else if (type == 'cascading') {
		/*	Cascading/Dependant Dropdown Menu	*/
		//	Function to reset the UI for this filter
		function reset(){
			//	No UI change required for this filter

		}

		//	Save a reference to the filter
		mySisenseApp.filters[index] = {
			type: type,
			element: element,
			title: label,
			datatype: datatype,
			dimensions: dims,
			selection: null,
			selectionValue: selection,
			reset: reset
		}

		//	Save the index to the element, for later use
		$(element).attr('index',index);

		//	Build a query for the data
		var payload = {
			datasource: mySisenseApp.dashboard.datasource,
			metadata: []
		}

		//	Loop through the dimensions for this menu
		dims.forEach(function(dim){
			payload.metadata.push({
				jaql: {
					dim: dim,
					datatype: 'text'
				}
			})
		})

		//	Make the API call
		$http.post(queryUrl,payload).then(function(response){
			//	Get the menu, which holds an array of list items
			var menu = $('.menu', element);
			//	Clear any existing content
			menu.empty();
			//	Define some functions to combine the dimension name w/ the value
			var createKey = function(dim, value){
				return dim + '-@-' + value;
			}
			var splitKey = function(key){
				var split = key.split('-@-');
				return {
					'dim': split[0],
					'value': split[1]
				}
			}

			//	Function to create a nested hierarchy
			var createHierarchy = function( base, names ) {
			    for( var i = 0; i < names.length; i++ ) {
			        base = base[ names[i] ] = base[ names[i] ] || {};
			    }
			};

			//	Get an array of the dimensionality of this query
			var dims = [];
			response.data.metadata.forEach(function(item, index){
				dims[index] = item.jaql.dim;
			})

			//	Loop through the responses, and create a dictionary
			var hierarchy = {};
			response.data.values.forEach(function(row){

				//	Figure out the bottom level
				var bottom = row.length-1;
				var key = [];

				//	Loop through each level
				for (var i=0; i<row.length; i++){

					//	Get this value, dim, and the key so far
					var value = row[i].text,
						dim = dims[i],
						thisKey = createKey(dim, value);
					key.push(thisKey);

					//	Add to the hierarchy
					createHierarchy(hierarchy,key)
				}
			})

			//	Recursive function to convert the hierarchy to HTML structure
			var hierarchyToHtml = function(key, parent) {

				//	Evaluate the key
				var data = splitKey(key)

				//	Check the current object, to see if it's empty
				var children = Object.keys(parent);

				//	Check to see if there are no children (only for the non-root)
				if (children.length == 0) {
					//	No children, so it must be the bottom of the tree

					//	Return a normal menu item
					return $('<div class="item" dim="' + data.dim + '" data-value="' + data.value + '">'
								+ data.value + '</div>');

				} else {

					//	Not empty, so need to dig further

					//	Create a menu to hold the children
					var menuItems = $('<div class="menu"></div>');

					//	Loop through each child
					for (child in parent) {

						//	Double check that the child exists
						if (parent.hasOwnProperty(child)){

							//	Calculate the sub-menu (RECURSIVE)
							var submenu = hierarchyToHtml(child, parent[child]);

							//	Add to our menu
							menuItems.append(submenu)
						}
					}

					//	Create the full menu html
					var menu = $('<div class="item" dim="' + data.dim + '" data-value="' + data.value + '"></div>');
					menu.append('<i class="dropdown icon"></i>');
        			menu.append('<span class="text">' + data.value + '</span>');
        			menu.append(menuItems);
        			//	Return the full object
        			return menu;
				}
			}

			//	Loop through every entry in the top level
			for (base in hierarchy){
				if (hierarchy.hasOwnProperty(base)){
					//	Calculate the html for each submenu(s)
					var submenu = hierarchyToHtml(base,hierarchy[base]);
					//	Add to the hierarchy
					menu.append(submenu);
				}
			}

			//	Init the menu
			jq(element).dropdown({
				allowCategorySelection: true,
				onChange: function(value, text, $selectedItem) {
					//	Update the sisense dashboard
					setFilter(mySisenseApp.filters[index], $selectedItem)
				}
			});
		})
	} else if (type == 'calendar'){

		/*	Calendar Filter	*/
		//	Function to reset the UI for this filter
		function reset(){
			//	reset back to the entire date range
			jq(this.element).data('daterangepicker').setStartDate(this.resetValues.start);
			jq(this.element).data('daterangepicker').setEndDate(this.resetValues.end);
		}

		//	Get the input element
		var input = $('input[name="daterange"]', element);

		//	Save a reference to the filter
		mySisenseApp.filters[index] = {
			type: type,
			element: input,
			title: label,
			datatype: datatype,
			dimension: dimension,
			selection: null,
			selectionValue: selection,
			reset: reset,
			resetValues: {
				start: null,
				end: null
			}
		}

		//	Save the index to the element, for later use
		$(element).attr('index',index);

		//	Build a query for the data
		var payload = {
			datasource: mySisenseApp.dashboard.datasource,
			metadata: [{
				jaql: {
					dim: dimension,
					datatype: datatype,
					agg: "min"
				}
			},{
				jaql: {
					dim: dimension,
					datatype: datatype,
					agg: "max"
				}
			}]
		}

		//	Make the API call
		$http.post(queryUrl,payload).then(function(response){
			//	Figure out the min/max dates, and convert from string to date objects
			var minDate = new Date(response.data.values[0].data),
				maxDate = new Date(response.data.values[1].data);
			//	Save these values to the filter object
			mySisenseApp.filters[index].resetValues = {
				start: minDate,
				end: maxDate
			}
			//	Define a preset list of options
			var myRanges = {
				'Today': 		[moment(), moment()],
	           	'Yesterday': 	[moment().subtract(1, 'days'), moment().subtract(1, 'days')],
	           	'Last 7 Days': 	[moment().subtract(6, 'days'), moment()],
	           	'Last 30 Days': [moment().subtract(29, 'days'), moment()],
	           	'This Month': 	[moment().startOf('month'), moment().endOf('month')],
	           	'All Time': 	[minDate, maxDate]
			}

			//	Define the daterange picker's options
			var options = {
				"startDate": minDate,
				"endDate": maxDate,
				"minYear": minDate.getFullYear()-1,
				"maxYear": maxDate.getFullYear(),
				"opens": "center",
				"showDropdowns": true,
				"ranges": myRanges,
				"alwaysShowCalendars": true
			}

			//	Initialize the date range picker
			jq(input).daterangepicker(options);

			//	Add event handler for selection
			jq(input).on('apply.daterangepicker', function(event, picker){

				//	Figure out the selected date range
				var fromDate = picker.startDate,
					endDate = picker.endDate;

				//	Find the parent element
				var parent = $(picker.element).parent();

				//	Get the dimension for this filter
				var dim = parent.attr('dim');

				//	Create an object to pass to the filter selection function
				//	Need to convert the dates from moment objects to sisense-formatted strings
				var value = {
					'from': fromDate.format('YYYY-MM-DD'),
					'to': endDate.format('YYYY-MM-DD')
				}

				//	Set the filter selection
				setFilter(mySisenseApp.filters[index], value)
			})

		})
	} else if (type == 'clear') {
		//	Add click handler
		$(element).on('click', function(){
			//	Loop through each filter and clear any saved selection
			for (filter in mySisenseApp.filters){
				//	Make sure the reference exists
				if (mySisenseApp.filters.hasOwnProperty(filter)) {
					var myFilter = mySisenseApp.filters[filter];
					myFilter.reset();
				}
			}
			//	Clear all filters
			mySisenseApp.dashboard.$$model.filters.clear();

			//	Refresh the dashboard
			mySisenseApp.dashboard.refresh();
		})
	}
}


/********************************/
/*	Runtime Functions 			*/
/********************************/

//	Function to set a filter
function setFilter(settings, value) {

	//	Get a reference to the filter's container element
	var element = settings.element;

	//	Create the placeholder for the filter object
	var filter;

	//	Define the options for how to apply this filter
	var options = {
		save:true,
		refresh:true,
		unionIfSameDimensionAndSameType:false
	}

	//	Handle different filter types
	if (settings.type == 'toggle'){

		/*	Simple toggle switch	*/

		//	Define the structure of the filter's jaql
		filter = {
			disabled: false,
			jaql: {
				title: settings.title,
				dim: settings.dimension,
				datatype: settings.datatype,
			}
		};

		//	Figure out the filter selection
		if (settings.selection) {

			//	Set to "All Items"
			filter.jaql.filter = {
				all: true,
				multiSelection: true,
				explicit: false
			};

			//	Update the UI
			$(settings.element).removeClass('active');
		} else {

			// Set to a specific value
			filter.jaql.filter = {
				members: [settings.selectionValue],
				multiSelection: false,
				explicit: true
			};

			//	Update the UI
			$(settings.element).addClass('active');
		}

		//	Update the settings
		settings.selection = !settings.selection;
	} else if (settings.type == 'dropdown'){

		/*	Dropdown menu	*/

		//	Define the structure of the filter's jaql
		filter = {
			disabled: false,
			jaql: {
				title: settings.title,
				dim: settings.dimension,
				datatype: settings.datatype,
			}
		};

		//	Figure out the filter selection
		if (value.length == 0) {

			//	Set to "All Items"
			filter.jaql.filter = {
				all: true,
				multiSelection: true,
				explicit: false
			};

		} else {

			// Set to a specific value
			filter.jaql.filter = {
				members: value.split(','),
				multiSelection: true,
				explicit: true
			};
		}
		//	Update the settings
		settings.selection = value;
	} else if (settings.type == 'cascading'){

		//	Function to parse the selected tree, and piece together the filter selections
		var parseTree = function(element, levels){
			//	Create the metadata item for this level
			var level = {
				'dim': $(element).attr('dim'),
				'filter': {
					'explicit':false,
					'multiSelection': true,
					'members': [$(element).attr('data-value')]
				}
			}

			//	Add to the front of the array (since we start at the bottom of the menu)
			levels.unshift(level);

			//	Check for parent's parent
			var grandparent = $(element).parent().parent();

			//	Is the parent another level up in the hierarchy?
			var isBiologicalParent = (grandparent.attr('dim') && grandparent.attr('data-value'))
			if (isBiologicalParent) {

				//	Get the next level up
				levels = parseTree(grandparent, levels);
			}

			//	Return just this level
			return levels;
		}

		//	Start the parsing
		var levels = parseTree(value, []);

		//	Define the filter jaql
		filter = {
			'isCascading': true,
    		'levels': levels
		}
	} else if (settings.type == 'calendar'){

		/*	Calendar Date Range	*/

		//	Define the structure of the filter's jaql
		filter = {
			disabled: false,
			jaql: {
				title: settings.title,
				dim: settings.dimension,
				datatype: settings.datatype,
				level: 'days',
				filter: {
					from: value.from,
					to: value.to
				}
			}
		};
		//	Update the settings
		settings.selection = value;
	}
	//	Set the filter
	if (filter){
		mySisenseApp.dashboard.$$model.filters.update(filter,options)
	} else {
		console.log("Error: Could not set filter, invalid type defined in the HTML")
	}
}

//	Kick off the connection process
initScript();
