// find and setup elements
var search = $("#search")
var $loading = $('#loading').hide();

$('#reggie').on("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        search.click();
    }
});

var $grid = $('.list.row').masonry({
  percentPosition: true,
  itemSelector: '.col',
  columnWidth: '.grid-sizer'
});

// handle click and add class
search.on("click", () => {
  // PREPERATION
  // clean up list
  $(".list").empty();
  $('#loading').show();
  $('#bofmCount').empty();
  $('#dcCount').empty();
  $('#pgpCount').empty();
  $('#otCount').empty();
  $('#ntCount').empty();
  if ($('#bookOfMormon:checked').length) {
    $.getJSON("https://raw.githubusercontent.com/bcbooks/scriptures-json/master/book-of-mormon.json", function(data) {
      searchScriptures(data)
    });
  }
  if ($('#oldTestament:checked').length) {
    $.getJSON("https://raw.githubusercontent.com/bcbooks/scriptures-json/master/old-testament.json", function(data) {
      searchScriptures(data)
    });
  }
  if ($('#newTestament:checked').length) {
    $.getJSON("https://raw.githubusercontent.com/bcbooks/scriptures-json/master/new-testament.json", function(data) {
      searchScriptures(data)
    });
  }
  if ($('#doctorineAndCovenants:checked').length) {
    $.getJSON("https://raw.githubusercontent.com/bcbooks/scriptures-json/master/doctrine-and-covenants.json", function(data) {
      var foundCount = 0;
      var scripture_slug = data.lds_slug;
      var sectionCount = data.sections.length;
      for (var sectionNum=0; sectionNum<sectionCount; sectionNum++) {
        var section    = data.sections[sectionNum].section;
        var verseCount = data.sections[sectionNum].verses.length;
          for (var verseNum=0; verseNum<verseCount; verseNum++) {
            var found = false;
            // FOR EACH VERSE
            
            var verseText = data.sections[sectionNum].verses[verseNum].text;
            var reference = data.sections[sectionNum].verses[verseNum].reference;
            var verse     = data.sections[sectionNum].verses[verseNum].verse;
            
            var reggieStr = $("#reggie").val().trim();
            
            var reggie    = (reggieStr) ? new RegExp($("#reggie").val().trim(), 'ig') : new RegExp("blank", 'ig');
            
            let match;
            var boldVerseText = verseText;
            while ((match = reggie.exec(verseText)) !== null) {
              found = true;
            }
            
            if (found) {
              foundCount++
              var boldVerseText = verseText.replaceAll(reggie, (match) => {
                return "<b>"+match+"</b>";
              });
              var scripture = '<div class="col">'
              scripture = scripture + '<div class="card shadow p-2 mb-3 bg-white bg-body-tertiary rounded">'
              scripture = scripture + '<div class="card-body">'
              scripture = scripture + '<h5 class="card-title">'+reference+'</h5>'
              scripture = scripture + '<p class="card-text">'+verse+'. '+ boldVerseText+'</p>'
              scripture = scripture + '<a href="'+createSharableLink(scripture_slug, null, sectionNum + 1, verse)+'" class="card-link">Go to Scripture</a>'
              scripture = scripture + '</div>'
              scripture = scripture + '</div>'
              scripture = scripture + '</div>'
              $(".list").append(scripture).masonry( 'appended', $(scripture) );
            }
        }
      }
      
      // POST BEHAVIOR
      $('#dcCount').html("("+foundCount+")") 
      var resultCount = $(".card").length;
      if ($('.results').length) {
        $('.results').html("Showing "+resultCount+" results")
      } else {
        $("#heading").append("<div class='results'>Showing "+resultCount+" results</div>");
      }
      $('#loading').hide();

      $grid.masonry('layout');
      
    });
  }
  if ($('#pearlOfGreatPrice:checked').length) {
    $.getJSON("https://raw.githubusercontent.com/bcbooks/scriptures-json/master/pearl-of-great-price.json", function(data) {
      searchScriptures(data)
    });
  }
})

var searchScriptures = function(data) {
  var foundCount = 0;
  var scripture_slug = data.lds_slug;
  var bookCount = data.books.length;
  for (var bookNum=0; bookNum<bookCount; bookNum++) {
    var book    = data.books[bookNum].book;
    var chapterCount = data.books[bookNum].chapters.length;
    for (var chapterNum=0; chapterNum<chapterCount; chapterNum++) {
      var chapter    = data.books[bookNum].chapters[chapterNum].chapter;
      var verseCount = data.books[bookNum].chapters[chapterNum].verses.length;
      for (var verseNum=0; verseNum<verseCount; verseNum++) {
        var found = false;
        // FOR EACH VERSE

        var verseText = data.books[bookNum].chapters[chapterNum].verses[verseNum].text;
        var reference = data.books[bookNum].chapters[chapterNum].verses[verseNum].reference;
        var verse     = data.books[bookNum].chapters[chapterNum].verses[verseNum].verse;
        var book_slug = data.books[bookNum].lds_slug

        var reggieStr = $("#reggie").val().trim();
        var reggie    = (reggieStr) ? new RegExp($("#reggie").val().trim(), 'ig') : new RegExp("blank", 'ig');

        let match;
        var boldVerseText = verseText;
        while ((match = reggie.exec(verseText)) !== null) {
          found = true;
        }

        if (found) {
          foundCount++
          var boldVerseText = verseText.replaceAll(reggie, (match) => {
            return "<b>"+match+"</b>";
          });
          var scripture = '<div class="col">'
          scripture = scripture + '<div class="card shadow p-2 mb-3 bg-white bg-body-tertiary rounded">'
          scripture = scripture + '<div class="card-body">'
          scripture = scripture + '<h5 class="card-title">'+reference+'</h5>'
          scripture = scripture + '<p class="card-text">'+verse+'. '+ boldVerseText+'</p>'
          scripture = scripture + '<a href="'+createSharableLink(scripture_slug, book_slug, chapter, verse)+'" class="card-link">Go to Scripture</a>'
          scripture = scripture + '</div>'
          scripture = scripture + '</div>'
          scripture = scripture + '</div>'
          $(".list").append(scripture).masonry( 'appended', $(scripture) );
        }
      }
    }
  }

  // POST BEHAVIOR
  $('#'+scripture_slug+'Count').html("("+foundCount+")")
  var resultCount = $(".card").length;
  if ($('.results').length) {
    $('.results').html("Showing "+resultCount+" results")
  } else {
    $("#heading").append("<div class='results'>Showing "+resultCount+" results</div>");
  }
  $('#loading').hide();

  $grid.masonry('layout');
  
}

// HELPER FUNCTIONS
var createSharableLink = function(scripture, book, chapter, verse) {
  if (scripture == "dc-testament/dc")
    return "https://www.churchofjesuschrist.org/study/scriptures/"+ scripture +"/"+ chapter+"?lang=eng&id=p"+verse+"#p"+verse
  else
    return "https://www.churchofjesuschrist.org/study/scriptures/"+ scripture + "/"+ book +"/"+chapter+"?lang=eng&id=p"+verse+"#p"+verse
}
