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
        $('#mailCount').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Browser market shares January, 2015 to May, 2015'
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
                name: "Brands",
                colorByPoint: true,
                data: [{
                    name: "Microsoft Internet Explorer",
                    y: 56.33
                }, {
                    name: "Chrome",
                    y: 24.03,
                    sliced: true,
                    selected: true
                }, {
                    name: "Firefox",
                    y: 10.38
                }, {
                    name: "Safari",
                    y: 4.77
                }, {
                    name: "Opera",
                    y: 0.91
                }, {
                    name: "Proprietary or Undetectable",
                    y: 0.2
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
                text: 'Browser market shares January, 2015 to May, 2015'
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
                name: "Brands",
                colorByPoint: true,
                data: [{
                    name: "Microsoft Internet Explorer",
                    y: 56.33
                }, {
                    name: "Chrome",
                    y: 24.03,
                    sliced: true,
                    selected: true
                }, {
                    name: "Firefox",
                    y: 10.38
                }, {
                    name: "Safari",
                    y: 4.77
                }, {
                    name: "Opera",
                    y: 0.91
                }, {
                    name: "Proprietary or Undetectable",
                    y: 0.2
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
                text: 'Browser market shares January, 2015 to May, 2015'
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
                name: "Brands",
                colorByPoint: true,
                data: [{
                    name: "Microsoft Internet Explorer",
                    y: 56.33
                }, {
                    name: "Chrome",
                    y: 24.03,
                    sliced: true,
                    selected: true
                }, {
                    name: "Firefox",
                    y: 10.38
                }, {
                    name: "Safari",
                    y: 4.77
                }, {
                    name: "Opera",
                    y: 0.91
                }, {
                    name: "Proprietary or Undetectable",
                    y: 0.2
                }]
            }]
        });
    }

});