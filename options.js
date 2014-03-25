// Saves options to localStorage.
function save_options() {
  var hostValue = $('#host-field').val();

  
			chrome.storage.local.set({
				'exo_host': hostValue
			}, function () {
				$('#status').text('Config saved!');

				$('#status').fadeIn(800, function () {
				  setTimeout(function () {
				    $('#status').fadeOut(400);
				  }, 2000);
				});
			});

}

// Restores select box state to saved value from localStorage.
function restore_options() {
  chrome.storage.local.get("exo_host", function (fetchedData) {
    var hostValue = fetchedData.exo_host;
    if (!hostValue) {
      return;
    } else {
      chrome.storage.local.set({'exo_host': 'int.exoplatform.org'});
    }

    $('#host-field').val(hostValue);
  });
}

$(document).ready(function () {
  document.querySelector('#save').addEventListener('click', save_options);
  restore_options();
})
