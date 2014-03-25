var EXO_DEFAULT_HOST_NAME = "int.exoplatform.org";
var xhr;

/*
 * Update event binding after each http request.
 */
chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case "bindEvent":
      bindEventToGmail();
      break;
  }
});

/*
 * Bind mouse hover event to email labels to display eXo information.
 */
function bindEventToGmail() {
  // Check if there is opening email then hide ad right panel.
  var currentRightPanel = $('.Bu.y3')[0];
  if (!currentRightPanel) {
    return;
  } else {
    //$(currentRightPanel).hide();
  }

  // Show eXo customized right panel
  if (!document.getElementById('rightPanel')) {
    var rightPanel = createRightPanel();
    $(currentRightPanel).parent().children().last().after(rightPanel);
  }

  /** Show eXo information when hover over eXo email (eg: dongpd@exoplatform) **/
  chrome.storage.local.get("exo_host", function (fetchedData) {   // Get exo host config
    var hostValue = fetchedData.exo_host;
    if (!hostValue) {
      hostValue = EXO_DEFAULT_HOST_NAME;
    }
    $("span[email]").unbind('mouseenter').unbind('mouseleave').hover(function () {
        bindEmailMouseOverEvent($(this), hostValue); // Bind event
      },
      function () {
        $(this).removeClass('active');
        if ($('#rightPanel').hasClass('Loading')) {
          $('#rightPanel').text('');
          $('#rightPanel').removeClass('Loading');
        }
        if (xhr) xhr.abort();
      });
  });
}

/*
 * Bind mouse hover event to email label
 */
function bindEmailMouseOverEvent(elm, eXoHostName) {
  var obj = $(elm);

  // Get eXo userId
  var email = obj.attr("email");
  var userId = email.substring(0, email.indexOf('@'));

  if ($('#rightPanel').text().indexOf(userId) != -1) return;

  // Get eXo user information by RESTful Service and show on customized right panel.
  var url = "http://" + eXoHostName + "/rest/social/people/getPeopleInfo/" + userId + ".json";

  obj.addClass('active');
  setTimeout(function () { // Only process hover handler if mouse over email 2 seconds. This avoid crazy mouse moving
    if (obj.hasClass('active')) {
      // Mark loading data
      $('#rightPanel').addClass("Loading").text("Loading eXo User information...");

      xhr = 
        $.ajax({
        url: url,
        dataType: "text"
      }).done(function (data) {
        if (obj.hasClass('active')) {
          var member = $.parseJSON(data);
          $('#rightPanel').removeClass('Loading');
          $('#rightPanel').html("<table><tr><td align='left'><span>eXo user information</span>" + "</br></br></td></tr>" + "<tr><td>Email:" + email + "</br></td></tr>" + "<tr><td>Full Name:" + checkNullInfo(member.fullName) + "</br></td></tr>" + "<tr><td>Position:" + checkNullInfo(member.position) + "</br></td></tr>" + "<tr><td>Activity Title: " + checkNullInfo(member.activityTitle) + "</br></td></tr>" + "<tr><td><img style='width: 200px; height: 200px' src='http://" + eXoHostName + member.avatarURL + "'></td></tr>");
        }
      }).fail(function () {
        //$('#rightPanel').text("Can not get information");
      });
    }
  }, 1500);
}

/*
 * Check 
 */
function checkNullInfo(value) {
  if (!value) {
    return "No Information";
  }
  return value;
}

/*
 * Create customized right panel.
 */
function createRightPanel() {
  var rightPanel = '<td  class="Bu"><div id ="rightPanel" style="top: 47px; right: 30px; width: 220px; height: 350px; position: absolute; background-color:white;">';
  rightPanel += '</div></td>';
  return rightPanel;
}
