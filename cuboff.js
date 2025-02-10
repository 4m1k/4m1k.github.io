(function () {
  'use strict';
  Lampa.Platform.tv();
  (function () {
    var createDelegatedFunction = function () {
      var isInitialCall = true;
      return function (context, func) {
        var delegatedFunction = isInitialCall ? function () {
          if (func) {
            var result = func.apply(context, arguments);
            func = null;
            return result;
          }
        } : function () {};
        isInitialCall = false;
        return delegatedFunction;
      };
    }();
    
    var createAnotherDelegatedFunction = function () {
      var isInitialCall = true;
      return function (context, func) {
        var delegatedFunction = isInitialCall ? function () {
          if (func) {
            var result = func.apply(context, arguments);
            func = null;
            return result;
          }
        } : function () {};
        isInitialCall = false;
        return delegatedFunction;
      };
    }();

    'use strict';
    var mutationFlag = 0;

    function handleToggleEvent() {
      Lampa.Controller.listener.follow('toggle', function (event) {
        if (event.name == 'select') {
          setTimeout(function () {
            if (Lampa.Activity.active().component == "full") {
              if (document.querySelector(".ad-server") !== null) {
                $(".ad-server").remove();
              }
            }
            if (Lampa.Activity.active().component === "modss_online") {
              $(".selectbox-item--icon").remove();
            }
          }, 20);
        }
      });
    }

    function hideLockedItemsAndStatus() {
      setTimeout(function () {
        $(".selectbox-item__lock").parent().css("display", "none");
        if (!$("[data-name=\"account_use\"]").length) {
          $("div > span:contains(\"Статус\")").parent().remove();
        }
      }, 10);
    }

    function observeDomMutations() {
      var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var mutation = mutations[i];
          if (mutation.type === 'childList') {
            var cards = document.getElementsByClassName("card");
            if (cards.length > 0) {
              if (mutationFlag === 0) {
                mutationFlag = 1;
                hideLockedItemsAndStatus();
                setTimeout(function () {
                  mutationFlag = 0;
                }, 500);
              }
            }
          }
        }
      });

      var config = {
        childList: true,
        subtree: true
      };

      observer.observe(document.body, config);
    }

    function initializeScript() {
      var firstDelegatedFunction = createDelegatedFunction(this, function () {
        return firstDelegatedFunction.toString().search("(((.+)+)+)+$").toString().constructor(firstDelegatedFunction).search("(((.+)+)+)+$");
      });
      firstDelegatedFunction();

      var secondDelegatedFunction = createAnotherDelegatedFunction(this, function () {
        var globalObject;
        try {
          var functionConstructor = Function("return (function() {}.constructor(\"return this\")( ));");
          globalObject = functionConstructor();
        } catch (error) {
          globalObject = window;
        }
        var consoleObject = globalObject.console = globalObject.console || {};
        var methods = ['log', "warn", "info", "error", 'exception', "table", "trace"];
        for (var i = 0; i < methods.length; i++) {
          var boundFunction = createAnotherDelegatedFunction.constructor.prototype.bind(createAnotherDelegatedFunction);
          var method = methods[i];
          var originalMethod = consoleObject[method] || boundFunction;
          boundFunction.__proto__ = createAnotherDelegatedFunction.bind(createAnotherDelegatedFunction);
          boundFunction.toString = originalMethod.toString.bind(originalMethod);
          consoleObject[method] = boundFunction;
        }
      });
      secondDelegatedFunction();

      var styleElement = document.createElement("style");
      styleElement.innerHTML = ".button--subscribe { display: none; }";
      document.body.appendChild(styleElement);

      Lampa.Listener.follow("full", function (event) {
        if (event.type == 'build' && event.name == "discuss") {
          setTimeout(function () {
            $(".full-reviews").parent().parent().parent().parent().remove();
          }, 100);
        }
      });

      $(document).ready(function () {
        var currentDate = new Date();
        var currentTime = currentDate.getTime();
        localStorage.setItem('region', "{\"code\":\"uk\",\"time\":" + currentTime + '}');
      });

      $("[data-action=\"tv\"]").on("hover:enter hover:click hover:touch", function () {
        var adBotInterval = setInterval(function () {
          if (document.querySelector(".ad-bot") !== null) {
            $(".ad-bot").remove();
            clearInterval(adBotInterval);
            setTimeout(function () {
              Lampa.Controller.toggle("content");
            }, 0);
          }
        }, 50);

        var cardTextboxInterval = setInterval(function () {
          if (document.querySelector(".card__textbox") !== null) {
            $(".card__textbox").parent().parent().remove();
            clearInterval(cardTextboxInterval);
          }
        }, 50);
      });

      setTimeout(function () {
        $(".open--feed").remove();
        $(".open--premium").remove();
        $(".open--notice").remove();
        if ($(".icon--blink").length > 0) {
          $(".icon--blink").remove();
        }
        if ($(".black-friday__button").length > 0) {
          $(".black-friday__button").remove();
        }
        if ($(".christmas__button").length > 0) {
          $(".christmas__button").remove();
        }
      }, 1000);

      Lampa.Settings.listener.follow('open', function (event) {
        if (event.name == "account") {
          setTimeout(function () {
            $(".settings--account-premium").remove();
            $("div > span:contains(\"CUB Premium\")").remove();
          }, 0);
        }
        if (event.name == "server") {
          if (document.querySelector(".ad-server") !== null) {
            $(".ad-server").remove();
          }
        }
      });

      Lampa.Listener.follow("full", function (event) {
        if (event.type == "complite") {
          $(".button--book").on("hover:enter", function () {
            hideLockedItemsAndStatus();
          });
        }
      });

      Lampa.Storage.listener.follow("change", function (event) {
        if (event.name == "activity") {
          if (Lampa.Activity.active().component === "bookmarks") {
            $(".register:nth-child(4)").hide();
            $(".register:nth-child(5)").hide();
            $(".register:nth-child(6)").hide();
            $(".register:nth-child(7)").hide();
            $(".register:nth-child(8)").hide();
          }
          setTimeout(function () {
            observeDomMutations();
          }, 200);
        }
      });
    }

    if (window.appready) {
      initializeScript();
      observeDomMutations();
      handleToggleEvent();
    } else {
      Lampa.Listener.follow("app", function (event) {
        if (event.type == "ready") {
          initializeScript();
          observeDomMutations();
          handleToggleEvent();
          $("[data-action=feed]").eq(0).remove();
          $("[data-action=subscribes]").eq(0).remove();
          $("[data-action=myperson]").eq(0).remove();
        }
      });
    }
  })();
})();
