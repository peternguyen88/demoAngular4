$(document).ready(function() {
  $('#summaryButton').click(function () {
    let errorSummary = processSummary();
    copyTextToClipBoard(errorSummary);
  });

  let processSummary = function() {
    let errorSummary = $('#error-summary').val();
    errorSummary = errorSummary.replace(/ (\(.{2,}?\))/g, ' <i>$1</i>');
    errorSummary = errorSummary.replace(/(.*CORRECT)/,'<b>$1</b>').replace(/\n/g,'<br>\n\t');
    errorSummary = '<div class="round-box">\n\t<div><b>Error Summary</b></div>\n\t' +errorSummary+'\n</div>';
    console.log(errorSummary);
    return errorSummary;
  };

  $('#glanceButton').click(function () {
    let firstGlance = processGlance();
    copyTextToClipBoard(firstGlance);
  });

  let processGlance = function() {
    let firstGlance = $('#first-glance').val();
    firstGlance = firstGlance.replace(/([^.])\n/g,'$1 ');
    firstGlance = '<div class="round-box">\n\t<div><b>First Glance</b></div>\n\t' +firstGlance+'\n</div>';
    console.log(firstGlance);
    return firstGlance;
  };

  $('#issueButton').click(function () {
    let pre = '<div class="round-box">\n' + '\t<b>Issues</b><br>\n' +  '\t<ol>\n\t\t<li>\n\t\t\t';

    let post = '\n\t\t</li>\n\t</ol>\n' + '</div>';

    let issue1Body = $('#issue-1-body').val().trim() + "\n";
    issue1Body = issue1Body.replace(/(<pre.*<\/pre>)\n|(.*?)\n/gs,'\t\t\t<p>$2</p>$1\n').replace('<p></p>','').trim();

    let issue = pre + issue1Body + post;

    console.log(issue);
    copyTextToClipBoard(issue);
  });

  $('#issueButton2').click(function () {
    let pre = '<li>\n\t\t\t';
    let post = '\n\t\t</li>';

    let issue2Body = $('#issue-2-body').val().trim() + "\n";

    issue2Body = issue2Body.replace(/(<pre.*<\/pre>)\n|(.*?)\n/gs,'\t\t\t<p>$2</p>$1\n').replace('<p></p>','').trim();

    let issue2 = pre + issue2Body + post;
    console.log(issue2);
    copyTextToClipBoard(issue2);
  });

  let processSecondaryIssue = function(buttonID){
    let issueBody = $(buttonID).val().trim();
    if(issueBody){
      let pre = '\t\t<li>\n\t\t\t';
      let post = '\n\t\t</li>\n';

      issueBody = issueBody.replace(/(.*?)\n/,'<b>$1</b>\n') + "\n";

      issueBody = issueBody.replace(/(<pre.*<\/pre>)\n|(.*?)\n/gs,'\t\t\t<p>$2</p>$1\n').replace('<p></p>','').trim();

      return pre + issueBody + post;
    }else{
      return '';
    }
  };

  let processAllIssues = function(){
    let pre = '<div class="round-box">\n' + '\t<b>Issues</b><br>\n' +  '\t<ol>\n\t\t<li>\n\t\t\t';

    let post = '\t</ol>\n' + '</div>';

    let issue1Body = $('#issue-1-body').val().trim() + "\n";
    issue1Body = issue1Body.replace(/(.*?)\n/,'<b>$1</b>\n');
    issue1Body = issue1Body.replace(/(<pre.*<\/pre>)\n|(.*?)\n/gs,'\t\t\t<p>$2</p>$1\n').replace('<p></p>','').trim() + '\n\t\t</li>\n';
    issue1Body += processSecondaryIssue('#issue-2-body');
    issue1Body += processSecondaryIssue('#issue-3-body');
    issue1Body += processSecondaryIssue('#issue-4-body');

    let issue = pre + issue1Body + post;

    return issue;
  };

  $('#correctButton').click(function () {
    let correctText = processCorrect();
    copyTextToClipBoard(correctText);
  });

  let processCorrect = function(){
    let correctText = $('#correct-answer').val();
    correctText = correctText.replace(/([^.])\n/g,'$1 ');
    correctText = '<div class="round-box">\n\t<div><b>The Correct Answer</b></div>\n\t' +correctText+'\n</div>';
    console.log(correctText);

    return correctText;
  };


  let focusedInput;

  $('input, textarea').blur(function () {
    focusedInput = $(this)[0];
  });

  $('#processAll').click(function () {
    let result = processSummary() + '\n' + processGlance() + '\n' + processAllIssues() + '\n' + processCorrect();
    console.log(result);
    copyTextToClipBoard(result);
  });

  $('#clearIssueButton').click(function () {
    $('textarea').val('');
  });

  $('textarea').dblclick(function (event) {
    checkDblClick(event);
  });

  $(document).keydown(function(e) {
    if(e.ctrlKey && e.keyCode === 81) { // Ctrl + Q
      let focused = $(':focus')[0];
      italicText(focused);
    }

    if(e.ctrlKey && e.keyCode === 66) { // Ctrl + B
      let focused = $(':focus')[0];
      wrapWithParagraph(focused);
    }

    if(e.ctrlKey && e.keyCode === 89) { // Ctrl + Y
      let focused = $(':focus')[0];
      focused.value = focused.value.replace(/([^.>?:])\n/g,'$1 ').replace(/^ +/gm,'').replace(/ +(?= )/g,'');
    }

    if(e.ctrlKey && e.keyCode === 77) { // Ctrl + M -- Break first line and add <b>
      let focused = $(':focus')[0];
      let value = focused.value;
      value = value.replace(/(.*?)\n/,'<b>$1</b>\n');
      focused.value = value;
    }

    if(e.altKey && e.keyCode === 83) { // Alt + S -- Remove <i>
      let focused = $(':focus')[0];
      let start = focused.selectionStart;
      let finish = focused.selectionEnd;

      let pre = focused.value.substring(0, start);
      let post = focused.value.substring(finish);
      let sel = focused.value.substring(start, finish);
      console.log(sel);
      focused.value = pre + sel.replace(/<i>(.*?)<\/i>/g,'$1') + post;
    }

    if(e.altKey && e.keyCode === 81) { // Alt + Q -- format color green to highlight
      let focused = $(':focus')[0];
      greenText(focused);
    }

    if(e.altKey && e.keyCode === 87) { // Alt + W -- format color red to highlight
      let focused = $(':focus')[0];
      redText(focused);
    }

    if(e.altKey && e.keyCode === 65) { // Alt + A -- format color blue to highlight
      let focused = $(':focus')[0];
      blueText(focused);
    }

    if(e.altKey && e.keyCode === 73) { // Alt + I -- format color green and italic to highlight
      let focused = $(':focus')[0];
      italicText(focused);
      greenText(focused);
    }

    if(e.altKey && e.keyCode === 85) { // Alt + U -- format color red and italic to highlight
      let focused = $(':focus')[0];
      italicText(focused);
      redText(focused);
    }

    if(e.altKey && e.keyCode === 79) { // Alt + O -- format color blue and italic to highlight
      let focused = $(':focus')[0];
      italicText(focused);
      blueText(focused);
    }

    if(e.altKey && e.keyCode === 66) { // Alt + B -- Wrap to <pre></pre>
      let focused = $(':focus')[0];
      wrapWithPreTag(focused);
    }
  });
});

const italicText = function (element) {
  let start = element.selectionStart;
  let finish = element.selectionEnd;

  let pre = element.value.substring(0, start);
  let post = element.value.substring(finish);
  let sel = element.value.substring(start, finish);

  let text = pre + '<i>'+sel+'</i>'+post;

  element.value = text;

  element.selectionStart = start;
  element.selectionEnd = finish + 7;
};

const greenText = function (element) {
  colorText(element, 'green');
};

const redText = function (element) {
  colorText(element, 'red');
};

const blueText = function (element) {
  colorText(element, 'blue');
};

const colorText = function (element, color) {
  let start = element.selectionStart;
  let finish = element.selectionEnd;

  let pre = element.value.substring(0, start);
  let post = element.value.substring(finish);
  let sel = element.value.substring(start, finish);

  let text;

  if(sel.indexOf('<i>') > -1){
    text = pre + sel.replace('<i>','<i style="color: '+ color +';">') + post;
  }
  else{
    text = pre + '<span style="color: ' + color +';">'+sel+'</span>'+post;
  }

  element.value = text;
};

const wrapWithPreTag = function (element) {
  let start = element.selectionStart;
  let finish = element.selectionEnd;

  let pre = element.value.substring(0, start);
  let post = element.value.substring(finish);
  let sel = element.value.substring(start, finish);

  sel = sel + '\n';
  sel = sel.replace(/(.*?)\n/g, '\t$1\n').trim();

  let text = pre + '<pre class="compare-group">\n\t' + sel+ '\n\t\t\t</pre>' +post;

  element.value = text;
};

const wrapWithParagraph = function (element) {
  let value = element.value.trim()+"\n";
  element.value = value.replace(/(.*?)\n/g,'<p>$1</p>\n');
};

const copyTextToClipBoard = function (text) {
  // Create a dummy input to copy the string array inside it
  var dummy = document.createElement("textarea");

  // Add it to the document
  document.body.appendChild(dummy);

  // Set its ID
  dummy.setAttribute("id", "dummy_id");

  // Output the array into it
  document.getElementById("dummy_id").value = text;

  // Select it
  dummy.select();

  // Copy its contents
  document.execCommand("copy");

  // Remove it as its not needed anymore
  document.body.removeChild(dummy);
};


function checkDblClickDelayed(target) {

  while (target.value.substr(target.selectionEnd -1, 1) === " ")  {
    target.selectionEnd = target.selectionEnd - 1;
  }
}

function checkDblClick(e) {
//we make a delay of 0ms to wait until the selection is in the final position
  target = e.target;
  setTimeout(function()
    {
      checkDblClickDelayed(target);
    }
    , 0);
}
