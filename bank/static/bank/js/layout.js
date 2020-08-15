
// get extra pages on click on the nav buttons
function mainNav(page) {
  getPage(page);
}

// get page function
function getPage(page) {

  fetch('/page/' + page, {
    method: 'POST',
    body: JSON.stringify({
      file_name: 'page'
    })
  })
    .then(response => response.json())
    .then(response => {
      // console.log(response);

      let style = `<link rel="stylesheet" href="././static/bank/css/mainNav.css">`;
      $('#customCss').html(style);
      // let style = `<link rel="stylesheet" href="././static/bank/css/${page}.css">`;
      // $('#customCss').html(style);

      let pdToggle = '<a href="/" style="color:white; padding: 0 .3rem; border:1px solid; font-size: 1rem;">';
      pdToggle += '<i class="fa fa-arrow-left"></i><span> Dashboard </span></a>';
      $('#pdToggle').html(pdToggle);

      document.querySelector('#main-body').innerHTML = response.page;
      // history.pushState({'page':page}, "title", "to be pushed to the url");
      history.pushState({
        'page': page
      }, "", `#${page}`);
    });
}

// get the same page even when the page is reloaded
window.addEventListener('DOMContentLoaded', function () {
  let page = (window.location.hash).slice(1);
  if (page != "main-body") {
    if (page.includes('category')) { } else {
      getPage(page);
    }
  }
})

// onpopstate
window.onpopstate = function (event) {
  getPage(event.state.page);
}

// show Notification
function notification() {
  getNotification();
  $('#notification').show();
}

// hide notification
$('.close').on('click', function () {
  $('#notification').hide()
})

// get notification every 2sec
setInterval(() => {
  getNotificationCount();
}, 5000);

// Notification count
function getNotificationCount() {
  fetch('getNotificationCount', {
    method:'POST',
    body:JSON.stringify({
      getNotificationCount:1
    })
  })
  .then(response => response.json())
  .then(response => {
    if(response.message == 'Not found!'){}else{
      console.log(response.result);
      $('#notification-count').html(response.result);
    }
  })
}

// get Notification
function getNotification() {
  fetch('/getNotification', {
    method: 'POST',
    body: JSON.stringify({
      getNotification: 1
    })
  })
    .then(response => response.json())
    .then(response => {
      if (response.message != '') { } else {
        let result = '';
        response.forEach(notification => {
          result +=  `<div class="row">`;
          result +=  `<div class="col-7">${notification.body}</div>`;
          result +=  `<div class="col-3">${notification.timestamp}</div>`;
          result +=  `<div class="col-2"> <a href="#"><i class="fa fa-check" aria-hidden="true"></i></a> </div>`;
          result +=  `</div>`;
        });
        $('#getNotification').html(result);
      }
    })
}

// profile js start

// get Expenses Category summary
function getExpSumr(catg) {
  fetch('/getExpSumr',
    {
      method: 'POST',
      body: JSON.stringify({
        expCatg: catg
      })
    })
    .then(response => response.json())
    .then(histories => {
      console.log(histories);
      if (histories.message != "No history for this category") {
        let result = '';
        histories.forEach(history => {
          let naration = history.naration;
          let date = history.timestamp;
          let amount = history.amount;

          result += '<tr><td>';
          result += naration;
          result += '<td><div>';
          result += date;
          result += '</div> <div> <b>NGN <span>';
          result += amount;
          result += '</span></b></div></td></tr>';
        });
        $('#' + catg).html(result);
      } else {
        $('#' + catg).text(histories.message);
      }
    })

  // let naration = 'Narationjndodno hs hs hsishd usgeie shsir sisis susisjeid eue sue eu cyduehr dud eucuri orjr'
  // let date = '02/08/2020 04:58 AM.'
  // let amount = '2, 000 .00'
}

// show Expenses Category summary
function expandCatg(catg) {
  getExpSumr(catg);
  $('.cr' + catg).css('display', 'none');
  $('.cd' + catg).css('display', 'block');
  $('#' + catg).css('display', 'block');
}

// hide Expenses Category summary
function compressCatg(catg) {
  $('.cd' + catg).css('display', 'none');
  $('.cr' + catg).css('display', 'block');
  $('#' + catg).css('display', 'none');
  $('#' + catg).html('');
}

// pie chart to illustrate customer's expenditure
function drawChart() {

  var data = google.visualization.arrayToDataTable([
    ['Task',
      'total expenditure'],
    ['Work',
      40],
    ['Nap',
      10],
    ['Eat',
      11],
    ['Eat',
      11],
    ['Watch TV',
      14],
    ['Watch TV',
      14],
    ['Sleep',
      15]
  ]);

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data,
    {
      title: 'My Weekly Expenditures',
      is3D: true,
    });
}
google.charts.load('current', {
  'packages': ['corechart']
});
google.charts.setOnLoadCallback(drawChart);

// profile js end

// transfer js start

// all this wiil only work if bank == 3nity bank for now

// Check Account Number
function checkAccNum() {
  let accNum = document.querySelector('#accountNum').value;
  if (accNum.length >= 10) {
    // send a fetch requsts
    fetch('/check',
      {
        method: 'POST',
        body: JSON.stringify({
          check: "accountNumber",
          accNum: accNum
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response.accName == 'error') {
          document.querySelector('#accountName').value = '';
          document.querySelector('#accNumError').innerHTML = "You cannot transfer money to yourself!";
        } else if (response.accName == 'None') {
          document.querySelector('#accountName').value = '';
          document.querySelector('#accNumError').innerHTML = "Account Number Not Found! (Hint: Account Number must be 10!)";
        } else {
          document.querySelector('#accNumError').innerHTML = '';
          document.querySelector('#accountName').value = response.accName;
        }
      })
  }
}

// check Transaction Pin
function checkTransPin() {
  let transPin = document.querySelector('#transPin').value;
  if (transPin.length >= 4) {
    // send a fetch requsts
    fetch('/check', {
      method: 'POST',
      body: JSON.stringify({
        check: "transPin",
        transPin: transPin
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.message == "ok") {
          document.querySelector('#transPinError').innerHTML = "";
          // ok
          setInterval(() => {
            stf();
          }, 500)
        } else {
          document.querySelector('#transPinError').innerHTML = "Incorrect Transaction Pin";
        }
      })
  }
}

// show/hide submit transfer form button
function stf() {
  let accNum = document.querySelector('#accountNum').value;
  let naration = document.querySelector('#naration').value;
  let transPin = document.querySelector('#transPin').value;
  let transPinError = document.querySelector('#transPinError').innerHTML;
  let accNumError = document.querySelector('#accNumError').innerHTML;

  if (accNum.length == 10) {
    if (transPin.length == 4) {
      if (naration != '') {
        if (accNumError == '') {
          if (transPinError == '') {
            $('#transferFormSubmit').show()
          } else {
            $('#transferFormSubmit').hide()
          }
        } else {
          $('#transferFormSubmit').hide()
        }
      } else {
        $('#transferFormSubmit').hide()
      }
    } else {
      $('#transferFormSubmit').hide()
    }
  } else {
    $('#transferFormSubmit').hide()
  }
}

// submit transfer form
function transferFormSubmit() {

  const bank = document.querySelector('#bank').value;
  const accNum = document.querySelector('#accountNum').value;
  const accName = document.querySelector('#accountName').value;
  const amount = document.querySelector('#amount').value;
  const catg = document.querySelector('#catg').value;
  const naration = document.querySelector('#naration').value;
  const transPin = document.querySelector('#transPin').value;

  fetch('/transfer', {
    method: 'POST',
    body: JSON.stringify({
      bank: bank,
      accNum: accNum,
      accName: accName,
      amount: amount,
      catg: catg,
      naration: naration,
      transPin: transPin,
    })
  })
    .then(response => response.json())
    .then(response => {
      if (response.message == 'ok') {
        $('#tsc-date').text(response.date);
        $('#transcId').text(response.transcId);
        $('#tsc-amount').text(amount);
        $('#tsc-accName').text(accName);
        $('#tsc-bank').text(bank);
        $('.tsc').show();
        document.querySelector('#accountNum').value = '';
        document.querySelector('#accountName').value = '';
        document.querySelector('#amount').value = '';
        document.querySelector('#naration').value = '';
        document.querySelector('#transPin').value = '';
      }
    })
}

// close transaction success
function closeTsc() {
  $('.tsc').hide();
}

// transfer js end

// Submit buy Airtime Form
function buyAirtimeFormSubmit() {
  const networkP = $('#networkP').val();
  const baTel = $('#ba-tel').val();
  const baAmount = $('#ba-amount').val();
  const baTransPin = $('#ba-transPin').val();

  if (networkP != '') {
    if (baTel != '' && baTel.length == 11) {
      $('#ba-phNum').text('')
      if (baTransPin != '') {
        $('#ba-transPinError').text('');

        fetch('/check', {
          method: 'POST',
          body: JSON.stringify({
            check: "transPin",
            transPin: baTransPin
          })
        })
          .then(response => response.json())
          .then(response => {
            if (response.message == 'ok') {
              $('#ba-transPinError').text('');
              $('#ba-transPinOk').html('<i class="fa fa-check-circle" aria-hidden="true"></i>');

              fetch('/airtime', {
                method: 'POST',
                body: JSON.stringify({
                  networkP: networkP,
                  baTel: baTel,
                  baAmount: baAmount,
                  baTransPin: baTransPin,
                })
              })
                .then(response => response.json())
                .then(response => {
                  if (response.message == 'ok') {
                    $('#networkP').val('');
                    $('#ba-tel').val('');
                    $('#ba-transPin').val('');

                    $('#transcId').text(response.transcId)
                    $('#tsc-amount').text(baAmount)
                    $('#tsc-tel').text(baTel)
                    $('#tsc-naration').text('Airtime')
                    $('#tsc-date').text(response.date)

                    $('#tsc').show();
                  } else {

                  }
                })
            } else {
              $('#ba-transPinError').text('Incorrect Transaction Pin!');
            }
          })
      } else { $('#ba-transPinError').text('You have not entered your Transaction Pin!') }
    } else { $('#ba-phNum').text('Please fill this field and must be 11') }
  } else { alert('Please select a Network provider') }
}
// airtime js end


function billFormSubmit() {
  let bill = $('#bill').val();
  let billId = $('#bill-id').val();
  let billAmount = $('#bill-amount').val();
  let billTransPin = $('#bill-transPin').val();

  if (billId == '') { $('#billIdError').text('Please fill this field!') } else { $('#billIdError').text('') }
  if (billAmount == '') { $('#billAmountError').text('Please fill this field!') } else { $('#billAmountError').text('') }
  if (billTransPin == '') { $('#billTpError').text('Please fill this field!') } else {
    fetch('/check', {
      method: 'POST',
      body: JSON.stringify({
        check: "transPin",
        transPin: billTransPin
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.message == 'ok') {
          $('#billTpError').text('');
        } else {
          $('#billTpError').text('Incorrect Transaction Pin!');
        }

        if ($('#billIdError').text() == '' && $('#billAmountError').text() == '' && $('#billTpError').text() == '') {

          fetch('/bill', {
            method: 'POST',
            body: JSON.stringify({
              bill: bill,
              billId: billId,
              billAmount: billAmount,
              billTransPin: billTransPin,
            })
          })
            .then(response => response.json())
            .then(response => {
              if (response.message == 'ok') {
                $('#bill-id').val('');
                $('#bill-amount').val('');
                $('#bill-transPin').val('');

                $('#transcId').text(response.transcId)
                $('#tsc-amount').text(billAmount)
                $('#tsc-bill').text(bill)
                $('#tsc-naration').text('Bill')
                $('#transctsc-dateId').text(response.date)

                $('#tsc').show();
              } else {
                alert('Error somthing went wrong, Please refresh and try again');
              }
            })
        }
      })
  }
}
// bill js end