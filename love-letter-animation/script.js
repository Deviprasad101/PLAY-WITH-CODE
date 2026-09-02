$(document).ready(function () {
  var envelope = $("#envelope");
  var btn_open = $("#open");
  var btn_reset = $("#reset");

  // Clicking the envelope opens it
  envelope.click(function () {
    open();
  });
  
  // Clicking the OPEN button opens it
  btn_open.click(function () {
    open();
  });
  
  // Clicking the CLOSE button resets it
  btn_reset.click(function () {
    close();
  });

  function open() {
    envelope.addClass("open").removeClass("close");
  }

  function close() {
    envelope.addClass("close").removeClass("open");
  }
});
