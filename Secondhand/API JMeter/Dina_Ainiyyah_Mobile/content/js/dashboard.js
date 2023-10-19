/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.48233333333333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3975, 500, 1500, "POST Register buyer"], "isController": false}, {"data": [0.425, 500, 1500, "GET Seller Product ID"], "isController": false}, {"data": [0.4275, 500, 1500, "POST Register"], "isController": false}, {"data": [0.6525, 500, 1500, "GET Buyer Order by ID"], "isController": false}, {"data": [0.5675, 500, 1500, "DELETE Buyer Order"], "isController": false}, {"data": [0.165, 500, 1500, "POST Seller Product"], "isController": false}, {"data": [0.4625, 500, 1500, "PUT Buyer Order by ID"], "isController": false}, {"data": [0.3, 500, 1500, "DELETE Seller Product"], "isController": false}, {"data": [0.4925, 500, 1500, "GET Buyer Product"], "isController": false}, {"data": [0.255, 500, 1500, "POST Buyer Order"], "isController": false}, {"data": [0.5725, 500, 1500, "GET Buyer Order"], "isController": false}, {"data": [0.6375, 500, 1500, "POST Login buyer"], "isController": false}, {"data": [0.4275, 500, 1500, "GET Seller Product"], "isController": false}, {"data": [0.6575, 500, 1500, "POST Login seller"], "isController": false}, {"data": [0.795, 500, 1500, "GET Buyer Product by ID"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3000, 0, 0.0, 1063.1873333333335, 44, 6757, 891.5, 1885.0, 2316.5999999999985, 4182.789999999995, 18.544045198019496, 12.976002460176664, 69.13628115399594], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST Register buyer", 200, 0, 0.0, 1200.3950000000007, 204, 3197, 1070.5, 1829.0, 2730.299999999999, 3155.8100000000004, 1.3049208565500503, 0.7416640024532513, 1.9666457131718713], "isController": false}, {"data": ["GET Seller Product ID", 200, 0, 0.0, 1263.0300000000004, 185, 4300, 1103.5, 1740.9, 2961.699999999998, 4193.520000000002, 1.2994860532659334, 0.8946656909692217, 0.4530434775546271], "isController": false}, {"data": ["POST Register", 200, 0, 0.0, 1146.065, 426, 2870, 962.0, 2073.2000000000003, 2545.0, 2868.99, 1.270987175739397, 0.7310658657329148, 1.9273204849769314], "isController": false}, {"data": ["GET Buyer Order by ID", 200, 0, 0.0, 656.0849999999999, 61, 2971, 611.0, 976.0000000000002, 1020.8499999999999, 2749.1700000000137, 1.3529236680466488, 1.5933847106096273, 0.4677099399301891], "isController": false}, {"data": ["DELETE Buyer Order", 200, 0, 0.0, 824.735, 48, 3891, 718.5, 1229.9, 1439.2499999999998, 3879.8100000000086, 1.3612572572027524, 0.42539289287586013, 0.49983664912913567], "isController": false}, {"data": ["POST Seller Product", 200, 0, 0.0, 1930.5250000000005, 810, 5852, 1714.5, 2557.6000000000004, 4414.099999999992, 5621.780000000001, 1.2765604355624207, 0.8302629395357151, 62.57813946103619], "isController": false}, {"data": ["PUT Buyer Order by ID", 200, 0, 0.0, 1040.905, 69, 6242, 878.0, 1614.0000000000002, 1976.1999999999998, 5015.900000000003, 1.3567140385985144, 0.8810691754570431, 0.5312913373808635], "isController": false}, {"data": ["DELETE Seller Product", 200, 0, 0.0, 1468.0249999999996, 73, 6259, 1264.0, 2316.2, 2739.499999999999, 6248.750000000009, 1.3644519337695031, 0.41573144857039546, 0.5050071122057047], "isController": false}, {"data": ["GET Buyer Product", 200, 0, 0.0, 883.3700000000001, 271, 2765, 730.5, 1514.7, 1615.1499999999996, 2510.67, 1.3168897697418238, 1.5959572307125034, 0.3227923166066385], "isController": false}, {"data": ["POST Buyer Order", 200, 0, 0.0, 1607.3999999999994, 105, 6757, 1522.5, 2110.8, 3264.999999999998, 6328.68, 1.340554453321894, 0.8784297247841707, 0.5511459227036302], "isController": false}, {"data": ["GET Buyer Order", 200, 0, 0.0, 767.5099999999995, 54, 3174, 695.5, 1223.2000000000003, 1489.0499999999981, 2950.8800000000083, 1.3482994573094684, 1.5905720160447634, 0.45821114369501464], "isController": false}, {"data": ["POST Login buyer", 200, 0, 0.0, 729.3300000000004, 219, 2559, 618.0, 1266.3000000000002, 1574.5999999999995, 2453.3000000000015, 1.3167423793534796, 0.6403688524590164, 0.34590205082625586], "isController": false}, {"data": ["GET Seller Product", 200, 0, 0.0, 1268.0700000000006, 492, 4162, 1136.5, 1602.6000000000004, 2929.1499999999933, 4154.730000000006, 1.292457219666029, 0.8923508342811353, 0.4430200040066174], "isController": false}, {"data": ["POST Login seller", 200, 0, 0.0, 674.625, 212, 2507, 605.0, 1048.6000000000001, 1391.9999999999989, 2260.75, 1.278976818545164, 0.6257494004796164, 0.3359812150279776], "isController": false}, {"data": ["GET Buyer Product by ID", 200, 0, 0.0, 487.7400000000001, 44, 1952, 419.5, 787.5, 1116.3999999999996, 1737.5000000000005, 1.3309465026053278, 1.139882893344602, 0.254751479014301], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
