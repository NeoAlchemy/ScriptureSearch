// find and setup elements
var search = $("#search")
var $loading = $('#loading').hide();

// handle click and add class
search.on("click", () => {
  // PREPERATION
  // clean up list
  $(".list").empty();
  $('#loading').show();
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
              var boldVerseText = verseText.replaceAll(reggie, (match) => {
                return "<b>"+match+"</b>";
              });
              var scripture = "<p class='h5 text-primary'><a href='"+createSharableLink(scripture_slug, null, sectionNum + 1, verse)+"' target='_blank'>"+reference+"</a></p><p>"+verse+". " + boldVerseText+"</p><hr>";
              $(".list").append(scripture)
            }
        }
      }
      
      // POST BEHAVIOR
      var resultCount = $("p.h5").length;
      if ($('.results').length) {
        $('.results').html("Showing "+resultCount+" results")
      } else {
        $(".list").prepend("<div class='results'>Showing "+resultCount+" results</div>");
      }
      $('#loading').hide();
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
          var scripture = "<p class='h5 text-primary'>";
          scripture = scripture + "<a href='"+createSharableLink(scripture_slug, book_slug, chapter, verse)
          scripture = scripture + "' target='_blank'>"+reference+"</a>"
          scripture = scripture + "</p><p>"+verse+". " + boldVerseText+"</p><hr>";
          $(".list").append(scripture)
        }
      }
    }
  }

  // POST BEHAVIOR
  $('#'+scripture_slug+'Count').html("("+foundCount"+")")
  var resultCount = $("p.h5").length;
  if ($('.results').length) {
    $('.results').html("Showing "+resultCount+" results")
  } else {
    $(".list").prepend("<div class='results'>Showing "+resultCount+" results</div>");
  }
  $('#loading').hide();
}

// HELPER FUNCTIONS
var createSharableLink = function(scripture, book, chapter, verse) {
  if (scripture == "dc-testament/dc")
    return "https://www.churchofjesuschrist.org/study/scriptures/"+ scripture +"/"+ chapter+"?lang=eng&id=p"+verse+"#p"+verse
  else
    return "https://www.churchofjesuschrist.org/study/scriptures/"+ scripture + "/"+ book +"/"+chapter+"?lang=eng&id=p"+verse+"#p"+verse
}
