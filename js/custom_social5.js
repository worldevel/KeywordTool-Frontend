$(document).ready(function (e) {
  var endpoint = "http://api.zeq.io/";
  $("input[type=text]").focus();
  $(document).keypress(function (e) {
    if (event.which == 13 || event.keyCode == 13) {
      var keyword = $(".keyword").val();
      var domain = $(".url").val();
      var current_step = parseInt($(".active .btn-next").data("step"));
      if (current_step) {
        var next_step = current_step + 1;
        var input_entry = $(".active input[type=text]").val();
        // if (input_entry) {
        $(".required").hide();
        $("input[type=text]").removeClass("error");

        if (current_step === 3) {
          window.location.reload();
        }

        if (input_entry.length >= 3) {
          $(".steps-list li").each(function () {
            var list_data = $(this).data("step");
            if (current_step == list_data) {
              $(this).addClass("completed");
              if (current_step === 2) {
                if (validateUrl()) {
                  $(this).addClass("completed");
                }
              }
              if (current_step === 3) {
                if (validateEmail()) {
                  $(this).addClass("completed");
                }
              }
              $(this).addClass("completed");
            }
          });
          if (current_step === 2) {
            if (validateUrl(input_entry)) {
              $("#btn_calculate").attr("disabled", true);
              $("#btn_calculate").html("Calculating ...");
              var search_volume, domain_age, domain_rating, instant_quote, competition;

              const doAjax = (data) => {
                return new Promise(function (resolve, reject) {
                  $.ajax(data)
                    .then((res) => resolve(res))
                    .fail((error) => reject(error));
                });
              };

              doAjax({
                type: "GET",
                contentType: "application/json",
                url: endpoint + "getsearchvolume?keyword=" + keyword,
              }).then((res) => {
                search_volume = res.search_volume;
                competition = res.competition;
                doAjax({
                  type: "GET",
                  contentType: "application/json",
                  url: endpoint + "getdomainage?domain=" + domain,
                }).then((res) => {
                  domain_age = res;
                  doAjax({
                    type: "GET",
                    contentType: "application/json",
                    url: endpoint + "getdomainrating?domain=" + domain,
                  }).then((res) => {
                    domain_rating = res;

                    doAjax({
                      type: "GET",
                      contentType: "application/json",
                      url: endpoint + "getinstantquote?search_volume=" + search_volume + "&competition=" + competition + "&domain_age=" + domain_age + "&domain_rating=" + domain_rating + "&search_keyword=" + keyword + "&search_domain=" + domain,
                    }).then((res) => {
                      instant_quote = res;
                      console.log("instant_quote:", instant_quote);

                      $("#btn_calculate").removeAttr("disabled");
                      $("#btn_calculate").html("Next");

                      $(".step-" + current_step).removeClass("active");
                      $(".step-" + current_step).hide();
                      $(".step-" + next_step)
                        .removeClass("fadeInRight animated")
                        .addClass("fadeInRight animated active")
                        .show();
                      $(".step-" + next_step)
                        .find("input[type=text]")
                        .focus();

                        if (Number(instant_quote) < 1000) {
                          $("#amt").append('<br><span> Yes. You are qualified.</span></span>');
                        }
                        else {
                          $("#amt").append('<br><span> You need to work with an agency.</span></span>');
                        }
                    });
                  });
                });
              });
            } else {
              $(this)
                .closest(".step")
                .find(".required")
                .text("invalid URL")
                .show();
              $(this)
                .closest(".step")
                .find("input[type=text]")
                .addClass("error");
              $(this).closest(".step").find("input[type=text]").focus();
            }
          } else {
            $(".step-" + current_step).removeClass("active");
            $(".step-" + current_step).hide();
            $(".step-" + next_step)
              .removeClass("fadeInRight animated")
              .addClass("fadeInRight animated active")
              .show();
            $(".step-" + next_step)
              .find("input[type=text]")
              .focus();
          }
        } else {
          $(".btn-next")
            .closest(".step")
            .find(".required")
            .text("min 3 character")
            .show();
          $(".btn-next")
            .closest(".step")
            .find("input[type=text]")
            .addClass("error");
          $(".btn-next").closest(".step").find("input[type=text]").focus();
        }
        // } else {
        //   $(this).closest(".step").find(".required").text("Required").show();
        //   $(this).closest(".step").find("input[type=text]").addClass("error");
        //   $(this).closest(".step").find("input[type=text]").focus();
        // }
        return false;
      } else {
        return false;
      }
    }
    return true;
  });
});
function validateEmail(email) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
function validatePhone(phone) {
  var re =
    /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
  return re.test(phone);
}

function validateUrl(url) {
  var re =
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  return re.test(url);
}
