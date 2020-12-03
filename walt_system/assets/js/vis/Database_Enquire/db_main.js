function machine_summary(data) {
    let summary_data = machine_efficiency(data['product'])
    if (document.getElementById('machine_summary') != null) {
        echarts.dispose(document.getElementById('machine_summary'))
    }

    let myChart = echarts.init(document.getElementById('machine_summary'));

    let colorPalette = ['#00b04f', '#3b8ade', '#f1aa1d', '#DF3B45'];
    let powerOFF = []
    let machine_num = 0;
    let Total = 0;
    let pie_data = [0, 0, 0, 0]
    for (let i in summary_data) {
        if (summary_data[i] != "0.00") {
            machine_num += 1
            let obj = parseFloat(summary_data[i]);
            Total += obj
            if (obj < 80 && obj > 0) {
                pie_data[3] += 1;
            } else if (obj >= 80 && obj < 90) {
                pie_data[2] += 1;
            } else if (obj >= 90 && obj < 95) {
                pie_data[1] += 1;
            } else if (obj >= 95) {
                pie_data[0] += 1;
            }
        } else {
            powerOFF.push(i)
        }
    }

    let option = {

        tooltip: {
            trigger: 'item',
            transitionDuration: 0,
            position: ['40%', '70%'],
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            itemWidth: 8,
            itemHeight: 8,
            left: 'left',
            top: "1%",
            data: ['95%~100%', '90%~95%', '80%~90%', '<80%'],
            textStyle: {
                fontSize: fontSize(0.12),
                color: function(d, i) {
                    return colorPalette[i]
                }
            }
        },
        series: [{
            name: 'work efficiency',
            type: 'pie',
            radius: ['25%', '45%'],
            center: ['50%', '52%'],
            roseType: 'area',
            data: [
                { value: pie_data[0], name: '95%~100%' },
                { value: pie_data[1], name: '90%~95%' },
                { value: pie_data[2], name: '80%~90%' },
                { value: pie_data[3], name: '<80%' }
            ],
            label: { //饼图图形上的文本标签
                normal: {
                    show: true,
                    position: 'outside', //标签的位置
                    textStyle: {
                        fontSize: fontSize(0.13) //文字的字体大小
                    },
                    formatter: '{c} \n ({d}%)'


                }
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            color: colorPalette,
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            labelLine: { //引导线设置
                normal: {
                    show: true, //引导线显示
                    length: 0.001
                }
            },
        }]
    };
    myChart.clear();
    myChart.setOption(option);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
    let total_pieces = 0;
    let machines = 0;
    let workE = parseFloat(0.0);
    let timeE = 0;
    for (let i in summary_data) {
        if (summary_data[i]['openTime'] > 0) {
            total_pieces += summary_data[i]['pieces']
            machines += 1;
            if (summary_data[i]['workE']) {
                console.log(summary_data[i]['workE'])
                workE += parseFloat(summary_data[i]['workE'])
            } else {
                machines -= 1
            }

            timeE += parseFloat(summary_data[i]['timeE'])
        }
    }


    document.getElementById('sum_ae').innerText = '(平均效率 ' + (Total / machine_num).toFixed(2) + '%)';
    /////db machine detals
    document.getElementById('dbm_we').innerText = (Total / machine_num).toFixed(2) + '%';
    /////
    //document.getElementById('sum_ate').innerText = '平均生产效率(开机时间>0): ' + (Total / (machine_num + powerOFF.length)).toFixed(2) + '%';
    document.getElementById('sum_mn').innerText = '开机台数(生产效率>0.0%): ' + machine_num.toString();
    document.getElementById('sum_po').innerText = '开机机器 (生产效率 = 0.0%): ' + powerOFF.toString();
}

//calculate machine efficiency
function machine_efficiency(data) {

    let usedTime = 43200; //12 hr
    let machine_id = [...new Set(data.map(item => item['MachCode']))];
    let machine_id_efficiency = {}
    for (let i in machine_id) {
        let obj = data.filter(item => item['MachCode'] == machine_id[i])
        let totalCount = 0;
        let cycle = {}
        for (let j in obj) {
            let data_item = obj[j]
            if (data_item['Cycle'] in cycle) {
                cycle[data_item['Cycle']]['pieces'] += data_item['Pieces']
            } else {
                cycle[data_item['Cycle']] = { 'pieces': data_item['Pieces'] }
            }
        }
        let cycleFlag = 0;
        let maxNumPiece = 0;
        for (let m in cycle) {
            let pieces = parseInt(cycle[m]['pieces'])
            totalCount += pieces;
            if (pieces > maxNumPiece) {
                cycleFlag = parseInt(m);
                maxNumPiece = pieces;
            }
        }

        machine_id_efficiency[machine_id[i]] = ((totalCount / (usedTime / cycleFlag)) * 100).toFixed(2)
    }
    return machine_id_efficiency
}

/// machine production
function db_machine_production(machine_data) {
    console.log('test')
    console.log(machine_data)

    let data = machine_data.filter(d => (d['Pieces'] > 0));
    let machine_set = [...new Set(data.map(d => d['MachCode']))];
    machine_set = machine_set.sort(function(a, b) { return parseInt(a) - parseInt(b) })
    let style_list = [...new Set(data.map(d => d['StyleCode']))];


    //style table recorde
    let content_html = "";
    for (let i in style_list) {
        let style = style_list[i];
        let machine_product = machine_data.filter(d => d['StyleCode'] == style)
        let machine_nums = [...new Set(machine_product.map(d => d['MachCode']))]
        let pieces = 0;
        machine_product.forEach(function(d) {
            pieces += parseInt(d['Pieces'])
        })
        let content = '<tr><td>' + style + '</td><td>' + pieces + '</td><td>' + (machine_nums.length).toString();
        content_html += content + '\n';
    }


    document.getElementById("db_style_table_body").innerHTML = content_html;

    let seriesList = [];
    let total = 0;
    for (let i = 0; i < style_list.length; i++) {
        if (style_list[i]) {
            let init_data = []
            for (let j in machine_set) {
                let machine_pieces = 0;
                let obj = data.filter(d => d['MachCode'] == machine_set[j] && d['StyleCode'] == style_list[i]);
                obj.forEach(function(d) {
                    total += d['Pieces']
                    machine_pieces += d['Pieces'];
                })
                init_data.push(machine_pieces)

            }
            seriesList.push({
                name: style_list[i],
                type: 'bar',
                stack: 'area',
                label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                        color: '#ded0a9',
                        fontSize: fontSize(0.10)
                    },
                    formatter: function(params) {
                        if (params.value > 0) {
                            return params.value;
                        } else {
                            return ' ';
                        }
                    },
                },
                symbol: 'none',
                data: init_data
            }); //end-push
        }

    } //end-for-loop

    document.getElementById('product_title').innerText += " : " + total + ' (只)'
        /////db machine detals
    document.getElementById('dbm_p').innerText = +total + ' (只)';
    /////

    if (document.getElementById('production_summary') != null) {
        echarts.dispose(document.getElementById('production_summary'))
    }
    let myChart = echarts.init(document.getElementById('production_summary'));
    let option = {

        legend: {
            data: style_list,
            top: "-2%",
            bottom: '10%',
            textStyle: { //标题内容的样式
                color: 'dodgerblue',
                fontSize: fontSize(0.1)

            },

            icon: "circle", //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow，none

            itemWidth: fontSize(0.1), // 设置宽度

            itemHeight: fontSize(0.1), // 设置高度

            itemGap: fontSize(0.1) // 设置间距

        },
        grid: {
            top: '28%',
            left: '3%',
            right: '7%',
            bottom: '15%'
        },

        tooltip: {
            trigger: 'axis',
            position: ['60%', '60%'],
            showDelay: 20,
            hideDelay: 20,
            transitionDuration: 0,
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            name: '[#]',
            data: machine_set,
            axisLabel: {
                show: true, //默认为true，设为false后下面都没有意义了
                interval: 0, //此处关键， 设置文本标签全部显示
                textStyle: {
                    fontSize: fontSize(0.12)
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#22cab7',
                    width: 2,
                }
            }
        },
        yAxis: [{
            show: false,
            type: 'value',
            nameTextStyle: {
                show: false,
                color: ['#ebf8ac']
            },
            axisLabel: {
                show: true, //默认为true，设为false后下面都没有意义了
                interval: 0, //此处关键， 设置文本标签全部显示
                textStyle: {
                    fontSize: fontSize(0.12)
                }
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#ebf8ac',
                    width: 2
                }
            },
            splitLine: {
                show: false
            }
        }],
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: seriesList
    };

    myChart.clear();
    myChart.setOption(option);
    window.addEventListener("resize", function() {

        myChart.resize();

    });

}

////machine error
function error_summary(error_data, start_date, start_time) {
    //add option to select box
    let error_list = [...new Set(error_data.map(d => d['StopCode']))]
    let error_dict = {}
    for (let i in error_list) {
        let obj = error_data.filter(d => d['StopCode'] == error_list[i])
        error_dict[error_list[i]] = { count: obj.length, Code: error_list[i], description: obj[0]['description'], percent: ((obj.length / error_data.length) * 100).toFixed(2) }
    }
    let rank_stopCode = Object.keys(error_dict).sort(function(a, b) {
        return error_dict[b]['count'] - error_dict[a]['count'];
    });
    let content_html = ""
    for (let j in rank_stopCode) {
        let content = '<tr><td>' + '#' + (parseInt(j) + 1) + '</td><td>' + rank_stopCode[j] + '</td><td>' + error_dict[rank_stopCode[j]]['description'] + '</td><td>' +
            error_dict[rank_stopCode[j]]['count'] + '</td><td>' + error_dict[rank_stopCode[j]]['percent'] + '%' + '\n';
        content_html += content
    }
    document.getElementById("error_summary_table").innerHTML = content_html;
    let table = document.getElementById('error_table');

    $(document).ready(function() {
        $('#error_summary_table tr').click(function() {

            let Something = $(this).children("td:nth-child(2)").text();
            let select_data = error_data.filter(d => d['StopCode'] == Something)
            top_10errors_machine(select_data)
        });

    });
}


///machine_error to machnies top 10
function top_10errors_machine(data) {

    let x_array = [];
    let y_array = [];

    let machine_set = [...new Set(data.map(d => d['MachCode']))];
    let machine_dict = {}
    for (let j in machine_set) {
        let obj = data.filter(d => d['MachCode'] == machine_set[j])
        machine_dict[machine_set[j]] = obj.length;
    }

    let res_counts = Object.keys(machine_dict).sort(function(a, b) {
        return machine_dict[b] - machine_dict[a];
    });

    if (document.getElementById('error_machine') != null) {
        echarts.dispose(document.getElementById('error_machine'))
    }
    for (let j = 0; j < 10; j++) {
        x_array.push(res_counts[j])
        y_array.push(machine_dict[res_counts[j]])
    }

    let myChart = echarts.init(document.getElementById('error_machine'));

    let option = {
        color: ['#3398DB'],
        title: {
            left: 'center',
            text: '前10故障率机器',
            textStyle: { //标题内容的样式
                color: '#8e80e0',
                fontSize: fontSize(0.14)

            },
        },
        tooltip: {
            trigger: 'axis',
            showDelay: 20,
            hideDelay: 20,
            transitionDuration: 0,
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },

        grid: {
            top: '23%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: x_array,
            axisLabel: {
                show: true, //默认为true，设为false后下面都没有意义了
                interval: 0, //此处关键， 设置文本标签全部显示
            },

            axisLine: {
                lineStyle: {
                    color: '#22cab7',
                    width: 1,
                }
            }
        }],
        yAxis: [{
            type: 'value',

            nameTextStyle: {
                color: ['#be7012']
            },
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#ebf8ac',
                    width: 2
                },

            }


        }],
        series: [

            {
                type: 'bar',
                stack: 'total',
                label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                        color: "white"
                    }
                },
                data: y_array,

            }


        ]
    };



    myChart.clear();
    myChart.setOption(option);
    window.addEventListener("resize", function() {
        myChart.resize();
    });


}

//// machine errors time line
function machine_error_time_line(select_data) {
    for (let i = 0; i < select_data.length; i++) {
        let temp_start = select_data[i]['DateRec'];
        temp_start = temp_start.replace("-", "/");
        temp_start = new Date(Date.parse(temp_start));
        select_data[i]['DateRec'] = temp_start;
        let temp_end = select_data[i]['DateEndStop'];
        temp_end = temp_end.replace("-", "/");
        temp_end = new Date(Date.parse(temp_end));
        select_data[i]['DateEndStop'] = temp_end;
    }


    let time_array = []
    let result_data;
    let valueData = [];
    let total_counts = 0;
    let start_time = $('#db_shift').val();
    if (start_time == '20:00:00') {
        time_array = TimeGenerate(1200);
        result_data = Generator(1200, select_data)
    } else {
        time_array = TimeGenerate(480);
        result_data = Generator(480, select_data)
    }

    for (let i = 0; i < 25; i++) {
        total_counts += result_data[time_array[i]].length
        valueData.push(result_data[time_array[i]].length);
    }
    shift_chart(time_array, valueData);
}

function shift_chart(time_array, valueData) {
    if (document.getElementById('error_time') != null) {
        echarts.dispose(document.getElementById('error_time'))
    }
    let myChart = echarts.init(document.getElementById('error_time'));
    let count = 0;
    valueData.forEach(function(d) {
        count += d;
    })
    let text = '故障时间线' + '(总计：' + count + ')'

    /////db machine detals
    document.getElementById('dbm_e').innerText = count + ' (次)';
    /////

    let option = {
        title: {
            text: text,
            x: 'left',
            textStyle: { //标题内容的样式
                color: '#FF5733',
                fontSize: fontSize(0.14)

            }
        },
        grid: {
            top: '23%',
            left: '3%',
            right: '0%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            show: true,
            transitionDuration: 0,
            trigger: 'axis'
        },

        xAxis: {
            type: 'category',
            data: time_array,
            axisLine: {
                lineStyle: {
                    color: '#22cab7',
                    width: 2,
                }
            }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    color: ['#dda587']
                }
            },
            nameTextStyle: {
                color: ['#de843f']
            },
            axisLine: {
                lineStyle: {
                    color: '#de843f',
                    width: 2
                },

            }
        },
        series: [{
            name: 'occur times：',
            data: valueData,
            top: '10%',
            type: 'line',
            areaStyle: {},
            itemStyle: {
                normal: {
                    barBorderRadius: 2,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: "#e92278"
                        },
                        {
                            offset: 1,
                            color: "#ec92b7"
                        }
                    ])
                }
            }
        }]
    };
    myChart.clear();
    myChart.setOption(option);
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}


function fontSize(res) {
    let docEl = document.documentElement,
        clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (!clientWidth) return;
    let fontSize = 100 * (clientWidth / 1920);
    return res * fontSize;
}

function TimeGenerate(start_time) {

    let x = 30; //minutes interval
    let times = []; // time array
    let tt = start_time; // start time
    let limit = Math.floor(tt / 60) + 12;
    //loop to increment the time and push results in array
    for (let i = 0; tt <= limit * 60; i++) {
        let hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
        let mm = (tt % 60); // getting minutes of the hour in 0-55 format
        times[i] = ("0" + (hh % 24)).slice(-2) + ':' + ("0" + mm).slice(-2); // pushing data in array in [00:00 - 12:00 AM/PM format]
        tt = tt + x;
    }
    return times
}


///Generator
function Generator(start_time, data) {
    let result = []
    let time_line = TimeGenerate(start_time);
    let new_line = []

    let date1 = data[0]['DateRec'].toLocaleDateString();
    let date2 = data[data.length - 1]['DateRec'].toLocaleDateString();


    let standard_time;
    if (start_time == 1200) {

    } else {
        standard_time = date2 + ' ' + '08:00';
        standard_time = new Date(Date.parse(standard_time));
        date1 = date2;

    }
    time_line.forEach(function(d, i) {
        result[d] = [];
        if (i >= 10) {
            d = date2 + " " + d;
        } else {
            d = date1 + " " + d;
        }

        d = new Date(Date.parse(d));
        new_line.push(d);
    })

    let data_array = [];
    for (let m = 0; m < new_line.length - 1; m++) {
        let test_data = data.filter(item => item['DateRec'] >= new_line[m] && item['DateRec'] < new_line[m + 1])
        test_data.forEach(function(d) {
            result[time_line[m]].push(d)
        })

    }

    return result;
}

/// main efficiency
function machine_efficiency_distribute(raw_data) {

    let data = raw_data['product']
    let machine_efficiency = [];
    let time_efficiency = [];
    let color_bar_1 = '#2fb3db';
    let color_bar_2 = '#bee576';
    let x_array = [];

    let machine_data = machine_efficiency_help(data);
    let machine_id = [...new Set(data.map(d => d['MachCode']))]
    machine_id = machine_id.sort(function(a, b) { return parseInt(a) - parseInt(b) })

    for (let i in machine_id) {

        let efficiency_data = data.filter(d => d['MachCode'] == machine_id[i]);
        let timeOff = 0
        let timeOn = 0;
        efficiency_data.forEach(function(d) {
            timeOn += parseInt(d['TimeOn']);
            timeOff += parseInt(d['TimeOff'])
        })
        if (machine_data[machine_id[i]] != '0.00') {
            x_array.push('#' + machine_id[i])
            time_efficiency.push(((timeOn / (timeOn + timeOff)) * 100).toFixed(2))
            machine_efficiency.push(machine_data[machine_id[i]])
        }

    }

    if (document.getElementById('efficiency_distribute') != null) {
        echarts.dispose(document.getElementById('efficiency_distribute'))
    }

    let myChart = echarts.init(document.getElementById('efficiency_distribute'));
    let text = '机器生产效率&开机效率分布'
    let option = {
        title: {
            text: text,
            x: 'left',
            textStyle: { //标题内容的样式
                color: '#39be7e',
                fontSize: fontSize(0.14)

            }
        },

        legend: {
            data: ['生产效率 (%)', '开机效率 (%)'],
            top: "10%",
            right: '10%',
            textStyle: { //图例文字的样式
                color: 'white',
                fontSize: fontSize(0.12)
            }
        },
        grid: {
            top: '28%',
            left: '3%',
            right: '7%',
            bottom: '15%'
        },
        tooltip: {
            show: true,
            transitionDuration: 0,
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },

        calculable: true,
        xAxis: [{
            type: 'category',
            data: x_array,
            axisLabel: {
                show: true, //默认为true，设为false后下面都没有意义了
                interval: 0 //此处关键， 设置文本标签全部显示
            },
            axisLine: {
                lineStyle: {
                    color: '#22cab7',
                    width: 2,
                }
            }
        }],
        yAxis: [{
            type: 'value',
            splitLine: {
                lineStyle: {
                    color: ['#de9e7a']
                }
            },
            nameTextStyle: {
                color: ['#e3763b']
            },
            axisLine: {
                lineStyle: {
                    color: '#e3763b',
                    width: 2
                },

            }
        }],
        series: [{
                name: '生产效率 (%)',
                type: 'bar',
                data: machine_efficiency,

                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                },

                color: color_bar_1,
            },
            {
                name: '开机效率 (%)',
                type: 'bar',
                data: time_efficiency,

                color: color_bar_2,
            }
        ]
    };
    myChart.clear();
    myChart.setOption(option);
    window.addEventListener("resize", function() {

        myChart.resize();
    })
    myChart.on('click', function(params) {

        let error = raw_data['error']
        let select_data = error.filter(item => item['MachCode'] == params.name.substr(1));
        select_error_machines(select_data, params.name)

        ////machine info details
        document.getElementById('dbm_id').innerText = params.name;
        document.getElementById('dbm_we').innerText = machine_efficiency[params.dataIndex] + ' %'
        document.getElementById('dbm_te').innerText = time_efficiency[params.dataIndex] + ' %'
        document.getElementById('dbm_e').innerText = select_data.length;
        document.getElementById('dbm_s').innerText = select_data[0]['StyleCode'];

        let product = raw_data['product'].filter(d => d['MachCode'] == params.name.substr(1));
        let product_amount = 0;
        product.forEach(function(d) {
            product_amount += parseInt(d['Pieces'])
        })
        document.getElementById('dbm_p').innerText = product_amount
        let pqc_data = raw_data['knit_pqc'].filter(d => d['MachineId'].trim() == params.name.substr(1))
        let paring_data = raw_data['paring'].filter(d => d['MachineId'].substr(2) == params.name.substr(1))
        machine_details_summary(pqc_data, paring_data)
    })
}


//machine efficiency Cal
function machine_efficiency_help(data) {

    let usedTime = 43200;
    console.log(usedTime)
    let machine_id = [...new Set(data.map(item => item['MachCode']))];
    let machine_id_efficiency = {}
    for (let i in machine_id) {
        let obj = data.filter(item => item['MachCode'] == machine_id[i])
        let totalCount = 0;
        let cycle = {}
        for (let j in obj) {
            let data_item = obj[j]
            if (data_item['Cycle'] in cycle) {
                cycle[data_item['Cycle']]['pieces'] += data_item['Pieces']
            } else {
                cycle[data_item['Cycle']] = { 'pieces': data_item['Pieces'] }
            }
        }
        let cycleFlag = 0;
        let maxNumPiece = 0;
        for (let m in cycle) {
            let pieces = parseInt(cycle[m]['pieces'])
            totalCount += pieces;
            if (pieces > maxNumPiece) {
                cycleFlag = parseInt(m);
                maxNumPiece = pieces;
            }
        }

        machine_id_efficiency[machine_id[i]] = ((totalCount / (usedTime / cycleFlag)) * 100).toFixed(2)
    }
    return machine_id_efficiency
}

//select machine errors
function select_error_machines(error_data, id) {
    let colorPlate = ['#3b8ade', '#f1aa1d', '#DF3B45', '#3db005', '#9B59B6', '#2471A3', '#138D75', '#D68910', '#34495E', '#FF5733', '#00b04f'];
    let error_code = [...new Set(error_data.map(d => d['StopCode']))];
    let data_value = []
    let error_dict = {}
    for (let i in error_code) {
        let error_sublist = error_data.filter(d => d['StopCode'] == error_code[i])
        error_dict[error_code[i]] = { count: error_sublist.length, description: error_sublist[0]['description'], code: error_code[i] }
    }

    let top_10_error = Object.keys(error_dict).sort(function(a, b) {
        return error_dict[b]['count'] - error_dict[a]['count'];
    });
    top_10_error = top_10_error.slice(0, 10)
    top_10_error.forEach(function(d) {
        data_value.push({ value: error_dict[d]['count'], name: error_dict[d]['code'] })
    })


    if (document.getElementById('select_error_chart') != null) {
        echarts.dispose(document.getElementById('select_error_chart'))
    }
    let myChart = echarts.init(document.getElementById('select_error_chart'));
    let option = {

        title: {
            left: 'center',
            text: '机器 ' + id + ' 前10故障分布',
            textStyle: {
                fontSize: fontSize(0.13),
                color: '#b2d2f3'
            }
        },
        tooltip: {
            trigger: 'item',
            showDelay: 20,
            hideDelay: 20,
            transitionDuration: 0,
            position: ['20%', '10%'],
            formatter: function(data) {
                return error_dict[data['name']]['description'] + '<br/>' + 'Counts：' + data.value + ' (' + data.percent + '%)'
            }
        },
        legend: {
            show: false,
        },
        grid: {
            top: '2%',
            left: '0%',
            right: '14%',
            bottom: '3%'
        },

        label: {
            textStyle: {
                fontWeight: 'normal',
                fontSize: fontSize(0.12)
            }

        },
        series: [{
            type: 'pie',
            radius: '45%',
            center: ['50%', '60%'],
            data: data_value,
            color: colorPlate,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    myChart.clear();
    myChart.setOption(option);
    window.addEventListener("resize", function() {
        myChart.resize();

    });

    let machine_error_top = [...new Set(error_data.map(d => d['MachCode']))];
    let machine_error_top_dict = {}
    for (let i in machine_error_top) {
        machine_error_top_dict[machine_error_top[i]] = (error_data.filter(d => d['MachCode'] == machine_error_top[i])).length
    }
    let machine_error_top_5 = Object.keys(machine_error_top_dict).sort(function(a, b) {
        return machine_error_top_dict[b] - machine_error_top_dict[a];
    });

}


////////////////the third row for machine detalis summary
function machine_details_summary(pqc_data, paring_data) {
    document.getElementById('dbpqc_count').innerText = pqc_data.length;
    let defects_count = 0;
    let pqc_dirty = 0;
    pqc_data.forEach(function(d, i) {
        defects_count += (parseInt(d['brokenNDL']) + parseInt(d['logoIssue']) + parseInt(d['missYarn']) + parseInt(d['other']) + parseInt(d['toeHole']));
        pqc_dirty += parseInt(d['dirty'])
    })
    document.getElementById('dbpqc_defects_counts').innerText = defects_count + '(pieces)';
    document.getElementById('dbpqc_dirty_defects_counts').innerText = pqc_dirty + '(pieces)';

    let paring_qualified = 0;
    let paring_defects = 0;
    let paring_dirty = 0;
    paring_data.forEach(function(d) {
        paring_defects += (parseFloat(d['brokenNeedle']) + parseFloat(d['logoIssue']) + parseFloat(d['missingYarn']) + parseFloat(d['other']) + parseFloat(d['toeHole']));
        paring_qualified += parseFloat(d['products']);
        paring_dirty += parseFloat(d['dirty'])
    })

    // document.getElementById('dbpqc_paring_qualified_counts').innerText = paring_qualified*2 +'(pieces)';
    // document.getElementById('dbpqc_paring_dirty').innerText = paring_dirty*2 +'(pieces)'
    //  document.getElementById('dbpqc_paring_defects_counts').innerText =(paring_defects*2)+' ('+ (paring_defects/(paring_qualified+paring_defects+paring_dirty)*100).toFixed(2)+"%)"

    //////knit_pqc data summart
    let defects_list = ['破洞', '断针', '断纱', '返纱', '商标', '其他']
    let toeHole = 0;
    let brokenNDL = 0;
    let missYarn = 0;
    let logoIssue = 0;
    let other = 0;
    let fanYarn = 0;

    pqc_data.forEach(function(d) {
        toeHole += parseInt(d['toeHole'])
        brokenNDL += parseInt(d['brokenNDL'])
        missYarn += parseInt(d['missYarn'])
        logoIssue += parseInt(d['logoIssue'])
        other += parseInt(d['other'])
        fanYarn += parseInt(d['fanYarn'])
    })
    if (document.getElementById('dbpqc_defects') != null) {
        echarts.dispose(document.getElementById('dbpqc_defects'))
    }
    let myChart = echarts.init(document.getElementById('dbpqc_defects'));

    let option = {

        tooltip: {
            trigger: 'item',
            position: ['50%', '20%'],
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            show: false,
            data: defects_list
        },
        series: [{
            name: 'Defects',
            type: 'pie',
            radius: '30%',
            center: ['50%', '30%'],
            color: ['#3e5dd7', '#13734e', '#d69114', '#42cdb1', '#dd5721', '#bb3bd7'],
            data: [
                { value: toeHole, name: '破洞' },
                { value: brokenNDL, name: '断针' },
                { value: missYarn, name: '断纱' },
                { value: fanYarn, name: '返纱' },
                { value: logoIssue, name: '商标' },
                { value: other, name: '其他' }
            ],
            label: { //饼图图形上的文本标签
                normal: {

                    show: true,
                    position: 'outside', //标签的位置
                    textStyle: {
                        fontSize: fontSize(0.13) //文字的字体大小
                    },
                    formatter: function(params) {
                        if (params.value > 0) {
                            return params.name + ': ' + params.value;
                        } else {
                            return ' ';
                        }
                    },


                },
            },
            labelLine: {
                show: false
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    myChart.clear();
    myChart.setOption(option);

    //////paring_QC data summart
    let paring_defects_list = ['ToeHole', 'BrokenNDL', 'MissYarn', 'LogoIssue', 'Other']
    let paring_toeHole = 0;
    let paring_brokenNDL = 0;
    let paring_missYarn = 0;
    let paring_logoIssue = 0;
    let paring_other = 0;

    paring_data.forEach(function(d) {
        paring_toeHole += parseInt(d['toeHole'])
        paring_brokenNDL += parseInt(d['brokenNeedle'])
        paring_missYarn += parseInt(d['missingYarn'])
        paring_logoIssue += parseInt(d['logoIssue'])
        paring_other += parseInt(d['other'])
    })
    if (document.getElementById('dbpqc_paring_defects') != null) {
        echarts.dispose(document.getElementById('dbpqc_paring_defects'))
    }
    let myChart2 = echarts.init(document.getElementById('dbpqc_paring_defects'));

    let option2 = {

        tooltip: {
            trigger: 'item',
            position: ['50%', '20%'],
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            show: false,
            data: defects_list
        },
        series: [{
            name: 'Defects',
            type: 'pie',
            radius: '30%',
            center: ['50%', '30%'],
            color: ['#3e5dd7', '#13734e', '#d69114', '#dd5721', '#bb3bd7'],
            data: [
                { value: paring_toeHole * 2, name: 'ToeHole' },
                { value: paring_brokenNDL * 2, name: 'BrokenNDL' },
                { value: paring_missYarn * 2, name: 'MissYarn' },
                { value: paring_logoIssue * 2, name: 'LogoIssue' },
                { value: paring_other * 2, name: 'Other' }
            ],
            label: { //饼图图形上的文本标签
                normal: {

                    show: true,
                    position: 'outside', //标签的位置
                    textStyle: {
                        fontSize: fontSize(0.13) //文字的字体大小
                    },
                    formatter: function(params) {
                        if (params.value > 0) {
                            return params.name + ': ' + params.value;
                        } else {
                            return ' ';
                        }
                    },


                },
            },
            labelLine: {
                show: false
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    myChart2.clear();
    myChart2.setOption(option2);


    window.addEventListener("resize", function() {
        myChart.resize();
        myChart2.resize();
    });


}