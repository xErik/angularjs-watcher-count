function getWatchers(root) {
  root = angular.element(root || document.documentElement);
  var watcherCount = 0;

  function getElemWatchers(element) {
    var isolateWatchers = getWatchersFromScope(element.data().$isolateScope);
    var scopeWatchers = getWatchersFromScope(element.data().$scope);
    var watchers = scopeWatchers.concat(isolateWatchers);
    angular.forEach(element.children(), function (childElement) {
      watchers = watchers.concat(getElemWatchers(angular.element(childElement)));
    });
    return watchers;
  }

  function getWatchersFromScope(scope) {
    if (scope) {
      return scope.$$watchers || [];
    } else {
      return [];
    }
  }

  function getWatcherExpressions (element) {
    var watchers = getElemWatchers(element);
    var watchlist = {
      '_total': watchers.length
    };
    angular.forEach(watchers, function (watcher) {
      watchlist[watcher.exp] = watchlist[watcher.exp] || [];
      watchlist[watcher.exp].push(watcher);
    });
    return watchlist;
  }

  return getWatcherExpressions(root);
}

var id = 'refreshWatcherInfo_123asdaiu9';
var minHeight = "30px";
var minWidth = "130px";
var maxHeight = "400px";
var maxWidth = "600px";

function toggle(doShow) {
	var container = document.getElementById(id);
	// var height= container.style.height;
	// var width = container.style.width;

	if(doShow === true) {
		container.style.height = maxHeight;
		container.style.width = maxWidth;
	} else {
		container.style.height = minHeight;
		container.style.width = minWidth;
	}
	refreshWatcherInfo();
}

function refreshWatcherInfo() {

	var arr = [];

	html = '<style>#wtccnt th, #wtccnt td{font-size:14px; color:yellow;text-align:left;border:1px gray solid;padding:2px;} button {width:125px;background-color:#00FF00;color:black;border:0px solid yellow;}</style>';
	html += '<table id="wtccnt">';


	var container = document.getElementById(id);
	if (!container) {
		container = document.createElement('div');
		container.setAttribute("id", id);
		container.setAttribute("style", "position:fixed; left:0px; bottom: 0px; padding:0px; z-index:99999;background:rgba(0,0,0,0.8);overflow: auto;");
		container.setAttribute("class", "hidden-print");

		container.style.height = minHeight;
		container.style.width = minWidth;

		container.style.maxHeight = maxHeight;
		container.style.maxWidth = maxWidth;

		document.body.insertBefore(container, document.body.firstChild);
	}

	var watchers = getWatchers();
	var keys = Object.keys(watchers);
	for(var i = 0; i< keys.length; i++) {
		var key = keys[i];
		var val = watchers[key];
		if(Object.prototype.toString.call( val ) === '[object Array]') {
			val = val.length;
		}
		arr.push([val, key]);
	}

	arr.sort(function(a, b){return b[0]-a[0]});



    html += ['<tr><th colspan="2"><b>Watchers: ',arr[0][0],'</b></th></tr>'].join('');
    html += '<tr><td>Count</td><td>Element</td></tr>';
	for(var k =0; k < arr.length; k++) {
		var row = arr[k];
		html += ['<tr><th><b>',row[0],'</b></th><td>', row[1].substring(0,200), '...</td></tr>'].join('');
	}
	html += '</table>';

	container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function(event) {
	refreshWatcherInfo();
    document.getElementById(id).addEventListener('mouseover', function() { refreshWatcherInfo();  toggle(true); }, false);
    document.getElementById(id).addEventListener('mouseout', function() { toggle(false); } , false);
    window.addEventListener("hashchange", function() { setTimeout(function() {refreshWatcherInfo();}, 2500) }, false)
});
