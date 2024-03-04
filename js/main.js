/**
 * Created by arjun010 on 10/18/16.
 */
(function () {
  main = {};

  let mmProjectImages = ["projectThumbnailImage-mm-1"]; //,"projectThumbnailImage-mm-2","projectThumbnailImage-mm-3","projectThumbnailImage-mm-4"];
  let miProjectImages = [
    "projectThumbnailImage-mi-1",
    "projectThumbnailImage-mi-2",
    "projectThumbnailImage-mi-3",
  ];
  let biProjectImages = [
    "projectThumbnailImage-bi-1",
    "projectThumbnailImage-bi-2",
  ];
  let otherProjectImages = [
    "projectThumbnailImage-others-1",
    /*  "projectThumbnailImage-others-2",
    "projectThumbnailImage-others-3",
    "projectThumbnailImage-others-4", */
  ];

  w3.includeHTML();

  $(document).ready(function () {
    // main.showContentDiv("about-content")
    let mmProjectImg =
      mmProjectImages[Math.floor(Math.random() * mmProjectImages.length)];
    let miProjectImg =
      miProjectImages[Math.floor(Math.random() * miProjectImages.length)];
    let biProjectImg =
      biProjectImages[Math.floor(Math.random() * biProjectImages.length)];
    let otherProjectImg =
      otherProjectImages[Math.floor(Math.random() * otherProjectImages.length)];

    setTimeout(function () {
      $(".projectThumbnailImage").css("display", "none");
      for (let imgId of [
        mmProjectImg,
        miProjectImg,
        biProjectImg,
        otherProjectImg,
      ]) {
        // console.log("#"+imgId, $("#"+imgId));
        // $("#"+imgId).removeClass("hidden");
        $("#" + imgId).css("display", "block");
      }
    }, 10);
  });

  $("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });

  $(".navigationLink").click(function (evt) {
    var linkId = $(this).attr("id");
    var section = linkId.split("-")[0];
    main.showContentDiv(section + "-content");
  });

  main.showContentDiv = function (divToShow) {
    // d3.selectAll(".content-div").each(function(d){
    //     var divId = d3.select(this).attr('id');
    //     if(divId != divToShow){
    //         if(!d3.select(this).classed('hide')){
    //             d3.select(this).classed('hide',true);
    //         }
    //     }else{
    //         if(d3.select(this).classed('hide')){
    //             d3.select(this).classed('hide',false);
    //         }
    //     }
    // })
  };

  // Add smooth scrolling to all links
  $("a").on("click", function (event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top,
        },
        800,
        function () {
          // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
        }
      );
    } // End if
  });

  $(".nav-link").click(function (evt) {
    $(".nav-item").removeClass("active");
    $(this).parent().addClass("active");
  });
})();
