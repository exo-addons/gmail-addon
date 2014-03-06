var eXoHostName = "http://int.exoplatform.org";

/*
Update event binding after each http request.
*/
chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
  case "eXoUserInfo":
    bindEventToGmail();
    break;
  case "rightPanel":
    bindEventToGmail();
    break;
  }
});

/*
Bind mouse hover event to email labels to display eXo information.
*/
function bindEventToGmail() {
  // Check if opening an email then hide ad right panel.
  var currentRightPanel = $('.Bu.y3')[0];
  if (!currentRightPanel) {
    return;
  } else {
    $(currentRightPanel).hide();
  }

  // Show eXo customized right panel
  if (!document.getElementById('rightPanel')) {
    var rightPanel = createRightPanel();
    $(currentRightPanel).parent().children().last().after(rightPanel);
  }

  // Show eXo information when hover over eXo email (eg: dongpd@exoplatform)
  bindEmailMouseOverEvent();
}

/*
Bind mouse hover event to email label
*/
function bindEmailMouseOverEvent() {
  $("span[email]").bind("mouseenter", function (event) {
    event.preventDefault();
    $('#rightPanel').text("");

    // Get eXo userId
    var email = $(this).attr("email");
    var userid = email.substring(0, email.indexOf('@'));

    // Get eXo user information by RESTful Service and show on customized right panel.
    var url = eXoHostName + "/rest/social/people/getPeopleInfo/" + userid + ".json";
    $.ajax({
      url: url,
      dataType: "text"
    }).done(function (data) {
      var member = $.parseJSON(data);
        $('#rightPanel').html("<span>eXo user information</span>" + "</br></br>"
                          + "Full Name:" + checkNullInfo(member.fullName) + "</br>"
                          + "Position:" + checkNullInfo(member.position) + "</br>"
                          + "Last Activity: " + checkNullInfo(member.activityTitle) + "</br>"
                          + "<img src='" + eXoHostName + member.avatarURL + "'>");
    }).fail(function () {
      $('#rightPanel').text("Can not get information");
    });

    event.preventDefault();
  });
}

function checkNullInfo(value) {
  if (!value) {
    return "No Information";
  }
  return value;
}

/*
Create customized right panel.
*/
function createRightPanel() {
  var rightPanel = '<td  class="Bu"><div id ="rightPanel" style="width:200px;">';
  rightPanel += '</div></td>';
  return rightPanel;
}
