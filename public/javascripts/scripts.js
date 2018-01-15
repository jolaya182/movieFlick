var previousResults = [];


// Defined our selectors and grabbed key elements from the page
var form = document.querySelector("#searchForm");
var result = document.querySelector("#result");
var sort = document.querySelector("#sort");
var previous = document.querySelector("#previousResults");

form.addEventListener("submit", function (event) {
  // Stop the page from performing the
  //  default behavior for form submission
  event.preventDefault();

  var title = form.querySelector("#searchTitle").value;

  createSearch(title)
    .then(updateResult) // Separated updating concern
    .then(updatePrevious); // Separated updating saved searches
});


sort.addEventListener("change", function () {
  event.preventDefault();
  var strategy = sort.value;
  var length = previousResults.length;

  var sorted = sortResults(
    previousResults.slice(1, length),
    strategy
  );

  renderPrevious(sorted);
});

function sortResults(results, strategy) {
  switch (strategy) {
    case 'default':
      return results;
    case 'title':
      return results.sort(sortByTitle);
    case 'rating':
      return results.sort(sortByRating);
  }
}

function sortByTitle(a, b) {
  //this will ensure a sorted array by names
  if (a.results[0].original_title < b.results[0].original_title) { return -1 }

  if (a.results[0].original_title > b.results[0].original_title) { return 1 }

  return 0;
}

function sortByRating(a, b) {

  return Math.floor((a.results[0].vote_average - b.results[0].vote_average) * 10);
}

// Create a search for title

function createSearch(title) {
  // does url encoding for us, i.e. for the title

  return $.get('http://api.themoviedb.org/3/search/movie?&api_key=8aa5496a879aacdb95070bbd5121ff40&query=' + title);
}

// Updating Current Result
function updateResult(newResult) {

  var resultHTML = buildResult(newResult);
  displayResult(resultHTML);

  return newResult;
}

function addResult(newResult) {
  previousResults.unshift(newResult);
}

function displayResult(resultHTML) {
  result.innerHTML = resultHTML;
}


// Updating List of Previous Results
function updatePrevious(newResult) {
  renderPrevious(previousResults);
  addResult(newResult);
}

function renderPrevious(prev) {
  previous.innerHTML = prev.map(buildResult).join("");
}


// BUILD A RESULT FOR DISPLAY
function buildResult(result) {

  return '<column class="result">' +
    '<img class=resultingImg src=http://image.tmdb.org/t/p/w500' + result.results[0].poster_path + ' />' +
    buildTitle(result.results[0].original_title) +
    buildPlot(result.results[0].overview) +
    buildRating(result.results[0].vote_average) +
    '</column>';
}



// How could we clean up these build functions?
// Don't they all kind of look the same?
// Could you use that to improve your buildResult?
function buildTitle(title) {
  return ('<h2 class="title">' + title + '</h2>');
}

function buildPlot(plot) {
  return ('<p class="description">' + plot + '</p>');
}

function buildRating(rating) {
  return ('<p class="rating">' + rating + '</p>');
}
