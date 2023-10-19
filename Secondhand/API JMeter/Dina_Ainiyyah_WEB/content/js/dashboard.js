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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.40517857142857144, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6425, 500, 1500, "DELETE Product"], "isController": false}, {"data": [0.11, 500, 1500, "POST Registration seller"], "isController": false}, {"data": [0.6725, 500, 1500, "GET Categories"], "isController": false}, {"data": [0.5725, 500, 1500, "GET Users Offers"], "isController": false}, {"data": [0.5, 500, 1500, "GET Products ID"], "isController": false}, {"data": [0.4275, 500, 1500, "POST Offers"], "isController": false}, {"data": [0.1175, 500, 1500, "PUT Products ID"], "isController": false}, {"data": [0.34, 500, 1500, "GET Profile seller"], "isController": false}, {"data": [0.355, 500, 1500, "POST Products"], "isController": false}, {"data": [0.78, 500, 1500, "GET Category ID"], "isController": false}, {"data": [0.0075, 500, 1500, "PUT Profile seller"], "isController": false}, {"data": [0.4, 500, 1500, "GET Products"], "isController": false}, {"data": [0.055, 500, 1500, "POST Sign in seller"], "isController": false}, {"data": [0.6925, 500, 1500, "PUT Offers ID"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2800, 0, 0.0, 1429.2746428571406, 38, 7159, 1120.0, 2954.7000000000003, 3749.0, 4724.969999999999, 13.758875703299674, 23.852991941229945, 419.21940550447164], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["DELETE Product", 200, 0, 0.0, 791.5299999999997, 41, 4239, 540.0, 1907.9, 2442.849999999999, 3942.3900000000076, 1.0945948904310516, 0.9396626800608594, 0.4831610258543313], "isController": false}, {"data": ["POST Registration seller", 200, 0, 0.0, 2144.769999999999, 662, 4749, 2045.5, 3387.9, 3851.599999999999, 4307.92, 1.0045203415369162, 1.7165084677925666, 0.30214088397790057], "isController": false}, {"data": ["GET Categories", 200, 0, 0.0, 697.1900000000004, 72, 2493, 546.5, 1499.1000000000001, 1688.55, 2360.0800000000017, 1.0542017847636216, 1.10155850556355, 0.4385644143645535], "isController": false}, {"data": ["GET Users Offers", 200, 0, 0.0, 843.1699999999998, 50, 3299, 639.0, 1887.8000000000002, 2164.6499999999996, 3196.84, 1.087689529900585, 1.1985616325675998, 0.46099341403989647], "isController": false}, {"data": ["GET Products ID", 200, 0, 0.0, 1024.23, 38, 4260, 773.0, 2106.7000000000003, 2523.549999999999, 3660.3400000000006, 1.081279802774564, 2.1871787838710897, 0.45405304218072506], "isController": false}, {"data": ["POST Offers", 200, 0, 0.0, 1176.065000000001, 120, 4039, 959.0, 2145.9, 2465.5499999999993, 3824.630000000002, 1.084857558202608, 3.26913985373408, 0.5710334217492243], "isController": false}, {"data": ["PUT Products ID", 200, 0, 0.0, 1820.9200000000003, 419, 6498, 1894.5, 2328.8, 2504.75, 4065.900000000003, 1.0636770251080963, 2.2162552203273997, 103.06662656825883], "isController": false}, {"data": ["GET Profile seller", 200, 0, 0.0, 1577.925, 197, 4591, 1397.5, 3156.0, 3688.9499999999994, 4126.920000000001, 1.0343186942760805, 1.4525006108944787, 0.42827258434868953], "isController": false}, {"data": ["POST Products", 200, 0, 0.0, 1287.5349999999994, 458, 4068, 1220.0, 1838.4, 1947.5999999999995, 3615.8700000000053, 1.0630438133507671, 2.2142091834361826, 52.24768987291311], "isController": false}, {"data": ["GET Category ID", 200, 0, 0.0, 556.2100000000002, 89, 2520, 409.0, 1230.3, 1547.7499999999998, 2179.510000000001, 1.063637427273791, 0.7634506924279651, 0.4445672059308423], "isController": false}, {"data": ["PUT Profile seller", 200, 0, 0.0, 3534.144999999999, 1303, 7159, 3485.0, 4863.400000000001, 5104.75, 6819.61000000001, 1.0087407384990947, 1.4161971293760434, 278.3563276966792], "isController": false}, {"data": ["GET Products", 200, 0, 0.0, 1206.2899999999995, 47, 2670, 1218.5, 1986.0000000000002, 2256.4499999999994, 2580.4000000000005, 1.0724665658548094, 2.263710898539301, 0.48072475949937266], "isController": false}, {"data": ["POST Sign in seller", 200, 0, 0.0, 2641.0150000000003, 596, 4671, 2694.5, 3955.4, 4417.0, 4658.530000000001, 1.0035273988068059, 1.7150518447342409, 0.2832220881398114], "isController": false}, {"data": ["PUT Offers ID", 200, 0, 0.0, 708.8500000000006, 108, 3230, 505.0, 1566.1000000000001, 2235.599999999999, 2817.1000000000026, 1.0915958039057299, 3.2840297316584617, 0.5298077290440896], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2800, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
