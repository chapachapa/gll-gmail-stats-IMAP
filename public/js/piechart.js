$(function () {

    var userData;

    function sendAJAX(verb, url, deferred){
        $.ajax({
            method: verb,
            url: url,
            dataType: 'json',
            // contentType: application/json'
            success: function(data, textStatus, jqXHR){
                console.log('successfully completed call');
                console.log(data);
                console.log(jqXHR.status);
                if(typeof deferred !== 'undefined')
                    deferred.resolve({status: jqXHR.status, data: data});
                return {status: jqXHR.status, data: data};
            },
            error: function(x,y,z){
                console.log('something went wrong');
                console.log([x,y,z]);
                if(typeof deferred !== 'undefined')
                    deferred.resolve('failed');
            },
            complete: function(tStatus, jqXHR) {
                console.log('call is complete');
                if(typeof deferred !== 'undefined')
                    deferred.resolve({status: jqXHR.status, data: ''});
                return {status: jqXHR.status, data: ''};
            }
        });
    }

    $('#requestDataDiv').click(function(){

        sendAJAX('get', '/imap');

        var sInt = setInterval(function(){
            var dAJAX = $.Deferred(); // create a deferred object

            dAJAX.then(function (data) {
                console.log('deferred action finished');
                if(data.status === 200){
                    console.log('I THINK I GOT DATA', data);
                    displayChart(data.data);
                    clearInterval(sInt);
                }
            });

            sendAJAX('get', '/imap/getData', dAJAX);

        }, 5000);
    });

    function displayChart(chartData){
        console.log(chartData.type);

        var typesArray = [];
        var types = Object.getOwnPropertyNames(chartData.type);
        var typesTotal = types.reduce(function(p, c) {
            return p+chartData.type[c];
        }, 0);
        console.log(typesTotal);
        types.forEach(function(elem, ind){
            typesArray.push({
                name: elem,
                y: chartData.type[elem]
            });
        });

        console.log(typesArray);

        $('#mailCount').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'read / unread mails'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: "# of mails",
                colorByPoint: true,
                data: [{
                    name: "Unread emails",
                    y: chartData.unread / chartData.total,
                    sliced: true,
                    selected: true
                }, {
                    name: "read emails",
                    y: 1 - (chartData.unread / chartData.total)
                }]
            }]
        });

        $('#mailAttach').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Emails with Attachment'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: "# of mails",
                colorByPoint: true,
                data: [{
                    name: "Emails with Attachment",
                    y: chartData.attach / chartData.total,
                    sliced: true,
                    selected: true
                }, {
                    name: "Emails with No Attachment",
                    y: 1 - (chartData.attach / chartData.total)
                }]
            }]
        });

        $('#mailAttachType').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Types of Attachment'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: "# of mails",
                colorByPoint: true,
                data: typesArray
            }]
        });
    }

});