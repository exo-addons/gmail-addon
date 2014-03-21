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
  // Check if there is opening email then hide ad right panel.
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
  $("span[email]").hover(function () {
      var obj = $(this);
      $('#rightPanel').text("Loading eXo User information...");

      // Get eXo userId
      var email = $(this).attr("email");
      var userid = email.substring(0, email.indexOf('@'));

      // Get eXo user information by RESTful Service and show on customized right panel.
      var url = eXoHostName + "/rest/social/people/getPeopleInfo/" + userid + ".json";
      
      obj.addClass('active');
      setTimeout(function () { // Only process hover handler if mouse over email 2 seconds. This avoid crazy mouse moving
        if (obj.hasClass('active')) {
          $.ajax({
            url: url,
            dataType: "text"
          }).done(function (data) {
            var member = $.parseJSON(data);
            $('#rightPanel').html("<table><tr><td align='left'><span>eXo user information</span>" + "</br></br></td></tr>" 
                                       + "<tr><td>Email:" + email + "</br></td></tr>" 
                                       + "<tr><td>Full Name:" + checkNullInfo(member.fullName) + "</br></td></tr>"
                                       + "<tr><td>Position:" + checkNullInfo(member.position) + "</br></td></tr>"
                                       + "<tr><td>Activity Title: " + checkNullInfo(member.activityTitle) + "</br></td></tr>" 
                                       + "<tr><td><img src='" + eXoHostName + member.avatarURL + "'></td></tr>");
          }).fail(function () {
            $('#rightPanel').text("Can not get information");
          });
        }
      }, 2000);
    },
    function () {
      $(this).removeClass('active');
      $('#rightPanel').text("");
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
