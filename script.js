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
              var scripture = "<p class='h5 text-primary'><a href='"+createSharableLink(book, chapter, verse)+"' target='_blank'>"+reference+"</a></p><p>"+verse+". " + boldVerseText+"</p><hr>";
              $(".list").append(scripture)
            }
          }
        }
      }
      
      // POST BEHAVIOR
      var resultCount = $("p.h5").length;
      $(".list").prepend("<div class='results'>Showing "+resultCount+" results</div>");
      $('#loading').hide();
    });
  }
  if ($('#doctorineAndCovenants:checked').length) {
    $.getJSON("https://raw.githubusercontent.com/bcbooks/scriptures-json/master/doctrine-and-covenants.json", function(data) {
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
              var scripture = "<p class='h5 text-primary'><a href='"+createSharableLink(book, chapter, verse)+"' target='_blank'>"+reference+"</a></p><p>"+verse+". " + boldVerseText+"</p><hr>";
              $(".list").append(scripture)
            }
        }
      }
      
      // POST BEHAVIOR
      var resultCount = $("p.h5").length;
      $(".list").prepend("<div class='results'>Showing "+resultCount+" results</div>");
      $('#loading').hide();
    });
  }
})


// HELPER FUNCTIONS
var createSharableLink = function(book, chapter, verse) {
  return "https://www.churchofjesuschrist.org/study/scriptures/bofm/"+ abbreviations[book] +"/"+chapter+"?lang=eng&id=p"+verse+"#p"+verse
}

var abbreviations = {
  "1 Nephi" : "1-ne",
  "2 Nephi" : "1-ne",
  "Jacob" : "jacob",
  "Enos" : "enos",
  "Jarom" : "jarom",
  "Omni" : "omni",
  "Words of Mormon": "w-of-m",
  "Mosiah" : "mosiah",
  "Alma" : "alma",
  "Helaman" : "hel",
  "3 Nephi" : "3-ne",
  "4 Nephi" : "4-ne",
  "Mormon" : "morm",
  "Ether" : "ether",
  "Moroni" : "moro"
}
