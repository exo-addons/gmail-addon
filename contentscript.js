var EXO_DEFAULT_HOST_NAME = "int.exoplatform.org";
var PEOPLE_RET = "/rest/private/social/people/getPeopleInfo/{userId}.json";
var POST_ACTIVITY_RET = "/rest/private/api/social/v1-alpha3/portal/activity.json";

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
  }

  // Show eXo customized right panel
  if (!document.getElementById('rightPanel')) {
    var rightPanel = createRightPanel();
    $(currentRightPanel).parent().children().last().after(rightPanel);
  }

  /** Show eXo information when hover over eXo email (eg: dongpd@exoplatform) **/
  chrome.storage.local.get("exo_host", function (fetchedData) { // Get exo host config
    var hostValue = fetchedData.exo_host;
    if (!hostValue) {
      hostValue = EXO_DEFAULT_HOST_NAME;
    }

    bindEmailMouseOverEvent(hostValue);

    bindPostActivity(hostValue);
  });
}

/*
 * Bind mouse hover event to email label
 */
function bindEmailMouseOverEvent(eXoHostName) {
  var xhr;
  $("span[email]").unbind('mouseenter').unbind('mouseleave').hover(function () {
    var obj = $(this);

    // Get eXo userId
    var email = obj.attr("email");
    var userId = email.substring(0, email.indexOf('@'));

    if ($('#rightPanel').text().indexOf(userId) != -1) return;

    // Get eXo user information by RESTful Service and show on customized right panel.
    var url = "http://" + eXoHostName + PEOPLE_RET;
    url = url.replace('{userId}', userId);

    obj.addClass('active');
    setTimeout(function () { // Only process hover handler if mouse over email 2 seconds. This avoid crazy mouse moving
      if (obj.hasClass('active')) {
        // Mark loading data
        $('#rightPanel').show().addClass("Loading").html("<div style='width:200px;color: #333;border: 1PX SOLID #D8D8D8; margin: 10PX 0 4PX 0; padding: 4px 6px 8px 10px; background: rgba(0, 0, 0, 0.06);'>Loading eXo User information...</div>");

        xhr =
          $.ajax({
            url: url,
            dataType: "text"
          }).done(function (data) {
            if (obj.hasClass('active')) {
              var member = $.parseJSON(data);
              $('#rightPanel').removeClass('Loading');
              $('#rightPanel').html("<table style='border: 1PX SOLID #D8D8D8; margin: 10PX 0 4PX 0; padding: 4px 6px 8px 10px; background: rgba(0, 0, 0, 0.06);'><tr><td align='center' style='padding-bottom:5px;'><a onclick='document.getElementById(\"rightPanel\").style.display=\"none\";' style='float: right; color: #999; cursor: pointer;'>x</a><style width='div:180px;font-size: 14px;overflow: hidden;text-overflow: ellipsis;' title='" + email + "'>" + email + "</div>" + "</br></td></tr>" 
                                    + "<tr><td><div style='float:left; width: 80px; color: #333;'>Full Name:</div><div style='float: left; width: 122px; word-wrap: break-word;'>" + checkNullInfo(member.fullName) + "</div></br></td></tr>" 
                                    + "<tr><td><div style='float:left; width: 80px; color: #333;'>Position:</div><div style='float: left; width: 122px; word-wrap: break-word;'>" + checkNullInfo(member.position) + "</div></br></td></tr>"
                                    + "<tr><td><div style='float:left; width: 80px; color: #333;'>Activity Title: </div><div style='float: left; width: 122px; word-wrap: break-word;'>" + checkNullInfo(member.activityTitle) + "</div></br></td></tr>"
                                    + "<tr><td style='padding: 8px 0 0 ;'><img style='width: 200px; height: 200px' src='http://" + eXoHostName + member.avatarURL + "'></td></tr>");
              $('#rightPanel').append("<table style='border: 1PX SOLID #D8D8D8; margin: 10PX 0 4PX 0; padding: 4px 6px 8px 10px; background: rgba(0, 0, 0, 0.06);'><tr><td><div style='float:left; width: 202px; color: #333;'>Post something to activity stream</div></td></tr>"
                                      + "<tr><td><div ><input id='postActivityId' style='width: 200px' type='text'></div></td></tr></table>");
            }
          }).fail(function () {
            //$('#rightPanel').text("Can not get information");
          });
      }
    }, 1500);
  },
  function () {
    $(this).removeClass('active');
    if ($('#rightPanel').hasClass('Loading')) {
      $('#rightPanel').text('');
      $('#rightPanel').removeClass('Loading');
      $('#rightPanel').hide();
    }
    if (xhr) {
      xhr.abort();
      xhr = null;
    }
  });
}

function bindPostActivity(eXoHostName) {
  $("#postActivityId").unbind('keypress').keypress(function (event) {
    if (event.which == 13) {
      event.preventDefault();

      // Get activity Title
      var activity = new Object();
      activity.title = $('#postActivityId').val();

      // Make post activity RET
      var url = "http://" + eXoHostName + POST_ACTIVITY_RET;
      $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(activity),
        contentType: 'application/json',
        mimeType: 'application/json',

        success: function (data) {
          var parent = $('#postActivityId').parent();
          var inputActivityHtml = parent.html();
          parent.html(' Activity was posted successfully');
            setTimeout(function () {
              parent.html(inputActivityHtml);
            }, 3000);
        },
        error: function (data, status, er) {
          alert("error: " + data + " status: " + status + " er:" + er);
        }
      });
    }
  });
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
  var rightPanel = '<td  class="Bu"><div id ="rightPanel" style="z-index:10; display:none; top: 47px; right: 30px; width: 240px; height: 350px; position: absolute; background-color:white;">';
  rightPanel += '</div></td>';
  return rightPanel;
}
