function realTime_machine_d3(raw_data) {

    let machine_data = raw_data['machine']
    let w_efficiency = [];
    let t_efficiency = [];
    let real_piece = [];
    let style = []
    let machine_id = [];

    let page_width = document.getElementById("machine_d3").offsetWidth;

    let margin = { top: 0, right: 0, bottom: 0, left: 0 },
        width = page_width - margin.left - margin.right,
        height = 320 - margin.top - margin.bottom;


    let data = machine_data;

    d3.select("svg").remove();
    let svg_container = d3.select("#machine_d3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    let images = svg_container.selectAll("image")
        .data(data)
        .enter()
        .append('g')

    images.append('image')
        .attr('xlink:href', function(d) {
            if (d['State'] == 1) {
                return '../assets/img/off2.png'
            } else if (d['State'] == 0) {

                return '../assets/img/run_n.png'
            } else if (d['State'] == 56) {
                return '../assets/img/offline.jpg'
            } else if (d['State'] == 65535) {
                return '../assets/img/not_sync.png'
            } else {
                return '../assets/img/stop.PNG'
            }
        })
        .attr("x", function(d, i) { return fontSize(((i % 12) * 46 + 10) / 100) })
        .attr("y", function(d, i) {
            if (i < 12) {
                return 20
            } else if (i >= 12 && i < 24) {
                return 100
            } else if (i >= 24 && i < 36) {
                return 180
            } else {
                return 260
            }
        })
        .attr('width', fontSize(0.35))
        .attr('height', fontSize(0.3))
        .on("mouseover", function(d, i) {
            d3.select(this)
                .attr('width', fontSize(0.45))
                .attr('height', fontSize(0.4))
                .style("cursor", "pointer");
        })
        .on("mouseout", function(d, i) {
            d3.select(this)
                .attr('width', fontSize(0.35))
                .attr('height', fontSize(0.3))
                .style("cursor", "default");
        })
        .on('click', function(d, i) {
            document.getElementById('real_machine_id').innerText = d['MachCode']
            let state = ''
            if (d['State'] == '0') {
                state = '正常运行'
            } else if (d['State'] == '1') {
                state = '关机状态'
            } else if (d['State'] == '56') {
                state = '离线'
            } else if (d['State'] == '65535') {
                state = '状态不同步'
            } else {
                state = '故障中'
            }
            let error_total = raw_data['error'].filter(item => item['MachCode'] == d['MachCode'])
            real_machine_error_chart(error_total)

            let defects_total = raw_data['defects'].filter(item => item['MachineId'].trim() == d['MachCode'])
            document.getElementById('real_machine_status').innerText = state;
            document.getElementById('real_machine_workE').innerText = '    ' + d['WorkEfficiency'] + '%';
            document.getElementById('real_machine_timeE').innerText = '    ' + d['TimeEfficiency'] + '%';
            document.getElementById('real_machine_style').innerText = '    ' + d['StyleCode'];
            document.getElementById('real_machine_pieces').innerText = '    ' + d['ShiftPieces'];
            document.getElementById('real_machine_errors').innerText = '    ' + error_total.length;
            document.getElementById('real_machine_pqc').innerText = '    ' + defects_total.length;


            //defects report
            let toeH = 0;
            let brkNdl = 0;
            let missY = 0;
            let lI = 0;
            let dirty = 0;
            let other = 0;
            let summary = 0;
            let fanYarn = 0;
            defects_total.forEach(function(d) {
                toeH += parseInt(d['toeHole']);
                brkNdl += parseInt(d['brokenNDL']);
                missY += parseInt(d['missYarn']);
                lI += parseInt(d['logoIssue']);
                dirty += parseInt(d['dirty']);
                other += parseInt(d['other']);
                fanYarn += parseInt(d['fanYarn'])
            })
            summary = parseInt(toeH) + parseInt(brkNdl) + parseInt(missY) + parseInt(lI) + parseInt(dirty) + parseInt(other);
            document.getElementById('defects_total').innerText = ' ' + summary;
            document.getElementById('real_machine_toeHole').innerText = ' ' + toeH;
            document.getElementById('real_machine_toeHole').innerText = ' ' + toeH;
            document.getElementById('real_machine_brok').innerText = ' ' + brkNdl;
            document.getElementById('real_machine_yarn').innerText = ' ' + missY;
            document.getElementById('real_machine_fanYarn').innerText = ' ' + fanYarn;
            document.getElementById('real_machine_issue').innerText = ' ' + lI;
            document.getElementById('real_machine_dirty').innerText = ' ' + dirty;
            document.getElementById('real_machine_other').innerText = ' ' + other;

        })

    images.append('text')
        .text(function(d) {
            return d['MachCode']
        })
        .attr("x", function(d, i) { return fontSize(((i % 12) * 46 + 18) / 100) })
        .attr("y", function(d, i) {
            if (i < 12) {
                return 20 + 50
            } else if (i >= 12 && i < 24) {
                return 100 + 50
            } else if (i >= 24 && i < 36) {
                return 180 + 50
            } else {
                return 260 + 50
            }
        })
        .attr('font-size', fontSize(0.16))
        .style('fill', '#22cab7')


}

///efficiency
function realTime_machine_efficiency(machine_data) {
    let machine_set = [...new Set(machine_data.map(d => d['MachCode']))]
    let x_array = []
    let y_array = []
    let y_array_time_effciency = []

    for (let i in machine_set) {
        let obj = machine_data.filter(d => d['MachCode'] == machine_set[i])

        let time_efficiency = parseInt(obj[0]['TimeOn']) / ((parseInt(obj[0]['TimeOn']) + parseInt(obj[0]['TimeOff'])))
        if (obj[0]['WorkEfficiency'] > 0 || time_efficiency) {
            x_array.push(machine_set[i]);
            y_array.push(obj[0]['WorkEfficiency'])
            y_array_time_effciency.push((time_efficiency.toFixed(2)) * 100)
        }

    }

    if (document.getElementById('efficiency') != null) {
        echarts.dispose(document.getElementById('efficiency'))
    }

    let myChart = echarts.init(document.getElementById('efficiency'));

    let option = {
        legend: {
            data: ['生产效率(%)', '时间效率(%)'],
            left: 'center',
            selected: {
                '时间效率(%)': false
            },
            textStyle: { //图例文字的样式
                color: 'dodgerblue',
                fontSize: fontSize(0.16)
            }
        },

        grid: {
            top: '16%',
            left: '5%',
            right: '6%',
            bottom: '12%'
        },
        tooltip: {
            trigger: 'axis',
            showDelay: 20,
            hideDelay: 20,
            position: ['70%', '30%'],

            transitionDuration: 0,
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
        },
        xAxis: {
            type: 'category',
            name: '[#]',
            data: x_array.map(d => d),
            axisLabel: {
                interval: 0,
                show: true, //默认为true，设为false后下面都没有意义了
                textStyle: {
                    color: '#22cab7', //更改坐标轴文字颜色
                    fontSize: fontSize(0.12) //更改坐标轴文字大小
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#22cab7',

                    width: 1,
                }
            }
        },
        yAxis: [{
                type: 'value',
                name: '%',
                axisLabel: {
                    interval: 0,
                    show: true, //默认为true，设为false后下面都没有意义了
                    textStyle: {
                        color: '#be7012', //更改坐标轴文字颜色
                        fontSize: fontSize(0.16) //更改坐标轴文字大小
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#be7012']
                    }
                },
                nameTextStyle: {
                    color: ['#be7012']
                },
                axisLine: {
                    lineStyle: {
                        color: '#e55816',
                        fontSize: fontSize(0.16),
                        width: 1
                    },

                }
            },

        ],
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{
                name: '生产效率(%)',
                type: 'bar',
                data: y_array,
                markLine: {
                    data: [{
                            type: 'average',
                            name: '平均值',
                        },

                    ],
                    itemStyle: {
                        color: 'orange'
                    }
                },
                itemStyle: {
                    normal: {
                        barBorderRadius: 2,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: "#52d919"
                            },
                            {
                                offset: 1,
                                color: "#bcf5ad"
                            }
                        ])
                    }
                },
            },
            {
                name: '时间效率(%)',
                type: 'bar',
                data: y_array_time_effciency,
                itemStyle: {
                    normal: {
                        barBorderRadius: 2,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: "#da3fe5"
                            },
                            {
                                offset: 1,
                                color: "#d6b0ee"
                            }
                        ])
                    }
                },
            }
        ]
    };
    myChart.clear();
    myChart.setOption(option);
    window.addEventListener("resize", function() {

        myChart.resize();

    });
}

//production
function realTime_machine_production(machine_data) {

    let data = machine_data.filter(d => (d['State'] != 1 || d['State'] != 56 || d['State'] != 65535) && d['ShiftPieces'] >= 0.5)
    let machine_set = [...new Set(data.map(d => d['MachCode']))];
    let style_list = [...new Set(data.map(d => d['StyleCode']))];


    //style table recorde
    let content_html = "";
    for (let i in style_list) {
        let style = style_list[i];
        let machine_product = machine_data.filter(d => d['StyleCode'] == style)
        let pieces = 0;
        machine_product.forEach(function(d) {
            pieces += parseInt(d['ShiftPieces'])
        })
        let content = '<tr><td>' + style + '</td><td>' + pieces + '</td><td>' + (machine_product.map(d => d['MachCode']).length).toString();
        content_html += content + '\n';
    }


    document.getElementById("real_style_table_body").innerHTML = content_html;

    //style code dropdown menu
    /*$("#real_style_menu").empty()
    let real_style_list = style_list.map(item=>item.toUpperCase())
    real_style_list = [...new Set(real_style_list)];
    $("#real_style_menu").append('<li class="dropdown-item" ><a href="#">All Styles</a></li>');
    for(let m in real_style_list){
        if(real_style_list[m]){
            $("#real_style_menu").append('<li class="dropdown-item"><a href="#">'+real_style_list[m]+'</a></li>');
        }
    }*/


    let seriesList = [];
    let total = 0;
    for (let i = 0; i < style_list.length; i++) {
        if (style_list[i]) {
            let init_data = []
            for (let j in machine_set) {
                let obj = data.filter(d => d['MachCode'] == machine_set[j]);
                if (obj[0]['StyleCode'] == style_list[i]) {
                    total += obj[0]['ShiftPieces']
                    init_data.push(obj[0]['ShiftPieces'])
                } else {
                    init_data.push(0)
                }
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


    document.getElementById('total_pieces').innerText = '总产量（只）: ' + total;
    if (document.getElementById('production') != null) {
        echarts.dispose(document.getElementById('production'))
    }
    let myChart = echarts.init(document.getElementById('production'));
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
            top: '25%',
            left: '3%',
            right: '7%',
            bottom: '15%'
        },

        tooltip: {
            trigger: 'axis',
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

function production_error(machine_data, flag) {
    let title_flag = "All Styles"
    if (flag != 0) {
        title_flag = flag;
    }
    let colorPalette = ['#3db005', '#9B59B6', '#2471A3', '#138D75', '#D68910', '#22cab7', '#FF5733'];

    let stop_code = [];
    let error_data = [];
    let error_dict = {}
    let stop_list = [...new Set(machine_data.map(d => d['StopCode']))]
    for (let i in stop_list) {
        error_dict[stop_list[i]] = machine_data.filter(d => d['StopCode'] == stop_list[i]).length;
    }
    let error_top_7 = Object.keys(error_dict).sort(function(a, b) {
        return error_dict[b] - error_dict[a];
    });
    error_top_7 = error_top_7.slice(0, 7)
    error_top_7.forEach(function(d) {
        error_data.push({ value: error_dict[d], name: d })
    })

    if (document.getElementById('realTime_machine_error') != null) {
        echarts.dispose(document.getElementById('realTime_machine_error'))
    }
    let myChart2 = echarts.init(document.getElementById('realTime_machine_error'));
    let option2 = {
        title: {
            text: 'Top 7 Error--' + title_flag,
            textStyle: {
                color: '#e97f24'
            }
        },
        legend: {
            orient: 'vertical',
            top: '10%',
            left: "1%",
            textStyle: {
                color: 'white'
            },
            data: error_top_7
        },
        tooltip: {
            trigger: 'axis',
            transitionDuration: 0,

        },

        series: [{
            name: 'Products',
            type: 'pie',
            center: ['70%', '55%'],
            radius: ['45%', '55%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '14',
                    formatter: '{b}' + '\n' + ' {c} ({d}%)'
                },

            },
            labelLine: {
                show: false
            },
            data: error_data,
            color: colorPalette,
        }]
    };


    myChart2.clear();
    myChart2.setOption(option2);
    window.addEventListener("resize", function() {

        myChart2.resize();

    });
}

function fontSize(res) {
    let docEl = document.documentElement,
        clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (!clientWidth) return;
    let fontSize = 100 * (clientWidth / 1920);
    return res * fontSize;
}

////
function real_machine_error_chart(error_data) {

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


    if (document.getElementById('machine_stop') != null) {
        echarts.dispose(document.getElementById('machine_stop'))
    }
    let myChart = echarts.init(document.getElementById('machine_stop'));
    let option = {
        title: {
            left: 'center',
            text: '故障次数: ' + error_data.length,
            textStyle: {
                fontSize: fontSize(0.12),
                color: '#f1aa1d'
            }
        },
        tooltip: {
            trigger: 'item',
            showDelay: 20,
            hideDelay: 20,
            transitionDuration: 0,

            formatter: function(data) {
                return error_dict[data['name']]['description'] + '<br/>' + 'Counts：' + data.value + ' (' + data.percent + '%)'
            }
        },
        legend: {
            show: false,
        },
        grid: {
            top: '7%',
            left: '2%',
            right: '2%',
            bottom: '5%'
        },

        label: {
            textStyle: {
                fontWeight: 'normal',
                fontSize: fontSize(0.12)
            }

        },
        series: [{
            type: 'pie',
            radius: '35%',
            center: ['50%', '52%'],
            data: data_value,
            color: colorPlate,
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        fontSize: fontSize(0.12), //文字的字体大小
                    },
                }
            },

            labelLine: {
                show: true,
                normal: {
                    length: 10
                }

            },
        }]
    };
    myChart.clear();
    myChart.setOption(option);
    window.addEventListener("resize", function() {

        myChart.resize();

    });

}

////machine summary average workE
////Average efficiency chart
function machine_status(data) {

    let avg_efficiency = 0;
    let running = data.filter(d => d['State'] == '0').length;
    let powerOff = data.filter(d => d['State'] == '1').length;
    let offLine = data.filter(d => d['State'] == '56');
    let notSycn = data.filter(d => d['State'] == '65535');
    let stop = data.filter(d => d['State'] != '1' && d['State'] != '56' && d['State'] != '65535' && d['State'] != '0').length;

    if (document.getElementById('machine_summary') != null) {
        echarts.dispose(document.getElementById('machine_summary'))
    }
    let myChart = echarts.init(document.getElementById('machine_summary'));

    //pie data
    let filterdata = data.filter(d => parseInt(d['WorkEfficiency']) > 0 || d['TimeEfficiency'])
    let y_1 = filterdata.map(d => parseFloat(d['WorkEfficiency']))
    let average = (array) => array.reduce((a, b) => a + b) / array.length;
    avg_efficiency = average(y_1).toFixed(2)

    let colorPalette = ['#14ca75', '#4a8df6', '#dea33d', '#f36069'];
    let pie_data = [0, 0, 0, 0]
    for (let i in y_1) {
        if (y_1[i] < 80) {
            pie_data[3] += 1;
        } else if (y_1[i] >= 80 && y_1[i] < 90) {
            pie_data[2] += 1;
        } else if (y_1[i] >= 90 && y_1[i] < 95) {
            pie_data[1] += 1;
        } else {
            pie_data[0] += 1;
        }
    }

    let option = {

        tooltip: {
            trigger: 'item',
            transitionDuration: 0,
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        grid: {
            top: '16%',
            left: '15%',
            right: '6%',
            bottom: '8%'
        },
        legend: {
            itemWidth: fontSize(0.08),
            itemHeight: fontSize(0.08),
            left: 'center',
            top: "1%",
            data: ['95%~100%', '90%~95%', '80%~90%', '<80%'],
            textStyle: {
                color: function(d, i) { return colorPalette[i] },
                fontSize: fontSize(0.12)
            }
        },
        series: [{
            name: 'work efficiency',
            type: 'pie',
            radius: ['30%', '45%'],
            center: ['57%', '57%'],
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
                    formatter: '{c}' + '\n' + '({d}%) '


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
    document.getElementById('ms_avg').innerText = ' ' + avg_efficiency + '%';
    document.getElementById('ms_run').innerText = running;
    document.getElementById('ms_stop').innerText = stop;
    document.getElementById('ms_off').innerText = powerOff;
    offLine = offLine.map(d => '#' + d['MachCode'])
    document.getElementById('ms_line').innerText = offLine.length + ' (' + offLine.toString() + ')';
    notSycn = notSycn.map(d => '#' + d['MachCode'])
    document.getElementById('ms_ns').innerText = notSycn.length + ' (' + notSycn.toString() + ')';

}

///summary_realtime_error_chart
function realtime_error_chart(error_data) {
    let colorPlate = ['#3b8ade', '#f1aa1d', '#DF3B45', '#3db005', '#9B59B6', '#2471A3', '#138D75', '#D68910', '#34495E', '#FF5733', '#00b04f'];
    let error_code = [...new Set(error_data.map(d => d['StopCode']))];
    let data_value = []
    let x_value = []
    let error_dict = {}
    for (let i in error_code) {
        let error_sublist = error_data.filter(d => d['StopCode'] == error_code[i])
        error_dict[error_code[i]] = { count: error_sublist.length, description: error_sublist[0]['description'], code: error_code[i] }
    }

    console.log(error_dict)
    let top_10_error = Object.keys(error_dict).sort(function(a, b) {
        return error_dict[b]['count'] - error_dict[a]['count'];
    });
    top_10_error = top_10_error.slice(0, 9)
    top_10_error.forEach(function(d) {
        x_value.push(error_dict[d]['code'])
        data_value.push( error_dict[d]['count'])
    })


    if (document.getElementById('error_summary') != null) {
        echarts.dispose(document.getElementById('error_summary'))
    }
    let myChart = echarts.init(document.getElementById('error_summary'));
    let option = {

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        tooltip: {
            trigger: 'item',
            showDelay: 20,
            hideDelay: 20,
            position:['50%','50'],
            transitionDuration: 0,
            formatter: function(data) {
                return error_dict[data['name']]['description'] + '<br/>' + 'Counts：' + data.value
            }
        },
        grid: {
            top:'3%',
            left: '3%',
            right: '7%',
            bottom: '0%',
            containLabel: true
        },
        xAxis: {
            show:false,
            type: 'value',
            boundaryGap: [0, 0.01],
            splitLine: {
                show: false
            },
            axisLabel: {
                interval: 0,
                show: true, //默认为true，设为false后下面都没有意义了
                textStyle: {
                    color: '#22cab7', //更改坐标轴文字颜色
                    fontSize: fontSize(0.12) //更改坐标轴文字大小
                }
            },

        },
        yAxis: {
            type: 'category',
            data: x_value,
            axisLabel: {
                interval: 0,
                show: true, //默认为true，设为false后下面都没有意义了
                textStyle: {
                    color: '#22cab7', //更改坐标轴文字颜色
                    fontSize: fontSize(0.12) //更改坐标轴文字大小
                }
            },
            axisLine: {
                show:false
            }
        },
        series: [
            {
                type: 'bar',
                data: data_value,
                color:'#ee68a3',
                label: {
                    show: true,
                    position: 'right',
                    textStyle: {
                        fontSize:fontSize(0.10),
                        color: "white"
                    }
                }
            }
        ]
    };


    myChart.clear();
    myChart.setOption(option);
    window.addEventListener("resize", function() {

        myChart.resize();

    });

    document.getElementById('error_happening').innerText = "";
    document.getElementById('error_happened').innerText = error_data.length;
    let machine_error_top = [...new Set(error_data.map(d => d['MachCode']))];
    let machine_error_top_dict = {}
    for (let i in machine_error_top) {
        machine_error_top_dict[machine_error_top[i]] = (error_data.filter(d => d['MachCode'] == machine_error_top[i])).length
    }
    let machine_error_top_5 = Object.keys(machine_error_top_dict).sort(function(a, b) {
        return machine_error_top_dict[b] - machine_error_top_dict[a];
    });
    document.getElementById('error_id').innerText = '\n' + ((machine_error_top_5.slice(0, 5)).map(d => '#' + d + ' ')).toString()
}

////realTime defects chart
function realTime_defects(data) {
    data = data.filter(d => parseInt(d['MachineId']) > 0);
    let machine_list = [...new Set(data.map(d => d['MachineId']))];
    let machine_dict = {}
    for (let m in machine_list) {
        let mach = machine_list[m];
        let obj_list = data.filter(d => d['MachineId'] == mach);
        let count = 0;
        obj_list.forEach(function(d) {
            count += (parseInt(d['dirty']) + parseInt(d['other']) + parseInt(d['toeHole']) + parseInt(d['brokenNDL']) + parseInt(d['missYarn']) + parseInt(d['logoIssue']))
        })
        machine_dict[mach] = count
    }
    let res_counts = Object.keys(machine_dict).sort(function(a, b) {
        return machine_dict[b] - machine_dict[a];
    });
    document.getElementById('top_5_defects_machine').innerText = res_counts.map(d => '#' + d + ' ').slice(0, 5).toString();

    let defects_label = ['污渍', '其他', '破洞', '断针', '漏纱', 'Logo问题']
    let dirty = 0;
    let other = 0;
    let toe_hole = 0;
    let broken_needle = 0;
    let missing_yarn = 0;
    let logo_issue = 0;
    for (let i in data) {

        dirty += parseInt(data[i]['dirty'])
        other += parseInt(data[i]['other'])
        toe_hole += parseInt(data[i]['toeHole'])
        broken_needle += parseInt(data[i]['brokenNDL'])
        missing_yarn += parseInt(data[i]['missYarn'])
        logo_issue += parseInt(data[i]['logoIssue'])
    }


    let defects_data_pie = [{ value: dirty, name: '污渍' }, { value: other, name: '其他' }, { value: toe_hole, name: '破洞' }, { value: broken_needle, name: '断针' },
        { value: missing_yarn, name: '漏纱' }, { value: logo_issue, name: 'Logo问题' }
    ]

    let colorPalette2 = ['#3db005', '#9B59B6', '#2471A3', '#138D75', '#D68910', '#FF5733'];
    if (document.getElementById('defects_summary') != null) {
        echarts.dispose(document.getElementById('defects_summary'))
    }
    let myChart2 = echarts.init(document.getElementById('defects_summary'));
    let option2 = {

        tooltip: {
            formatter: '{b}<br/> {c} ({d}%)',

            transitionDuration: 0,

        },
        grid: {
            top: '25%',
            left: '5%',
            right: '6%',
            bottom: '2%'
        },
        legend: {
            show: true,
            orient: 'horizontal',
            top: '3%',
            left: "2%",
            data: ['污渍', '其他', '破洞', '断针', '漏纱', 'Logo问题'],
            selected: {
                'Qualified': false
            },
            textStyle: {
                fontSize: fontSize(0.12),
                color: function(d, i) {
                    return colorPalette2[i]
                }
            },
            icon: "circle", //  字段控制形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow，none

            itemWidth: fontSize(0.1), // 设置宽度

            itemHeight: fontSize(0.1), // 设置高度

            itemGap: fontSize(0.1) // 设置间距
        },
        series: [{
            name: 'Products',
            type: 'pie',
            center: ['45%', '65%'],
            radius: ['35%', '45%'],
            avoidLabelOverlap: true,
            label: {
                avoidLabelOverlap: true,
                normal: {
                    show: true,
                    textStyle: {
                        fontSize: fontSize(0.12), //文字的字体大小
                    },
                    formatter: function(params) {
                        if (params.value > 0) {
                            return params.value;
                        } else {
                            return 0;
                        }
                    },
                }
            },

            labelLine: {
                show: false,
                normal:{
                    length:0.1
                }



            },
            data: defects_data_pie,
            color: colorPalette2,
        }]
    };

    myChart2.clear();
    myChart2.setOption(option2);
    window.addEventListener("resize", function() {
        myChart2.resize();
    });
}

///unfixed data list
function unfixed_error(error_data) {
    let fixed = [];
    let unfixed = [];
    for (let i in error_data) {
        if (error_data[i]['DateEndStop']) {
            fixed.push(error_data[i])
        } else {
            if (error_data[i]['StopCode'] != 99992) {
                unfixed.push(error_data[i])
            }
        }
    }

    $("#unfixed_body").empty();
    let content_html = '';
    let new_error_data = unfixed.filter(item => item['StopCode'] != 99992)
    let filter_error_data = []
    for (let i in unfixed) {
        if (unfixed[i]['StopCode'] == 99992) {
            continue;
        } else {
            filter_error_data.push(unfixed[i])
        }
    }
    document.getElementById('error_happening').innerText = unfixed.length;

    for (let i = 0; i < filter_error_data.length; i++) {
        let date = filter_error_data[i]['DateRec'].slice(10, filter_error_data[i]['DateRec'].length)
        let content = '<tr><td>' + '#' + filter_error_data[i]['MachCode'] + '</td><td>' + filter_error_data[i]['StopCode'] + '</td><td>' + date + '</td><td>' + filter_error_data[i]['description'] + '</td></tr>';
        content_html += content + '\n';
    }
    document.getElementById("unfixed_body").innerHTML = content_html;

}

/////top 10 stops machine
function error_summary_machine(error_data) {

    let machine = [...new Set(error_data.map(d => d['MachCode']))]
    let machine_dict = {}
    for (let i in machine) {
        machine_dict[machine[i]] = error_data.filter(d => d['MachCode'] == machine[i]).length;
    }
    let machine_top_10 = Object.keys(machine_dict).sort(function(a, b) {
        return machine_dict[b] - machine_dict[a];
    });
    machine_top_10 = machine_top_10.slice(0, 10)
    let y_array = []
    machine_top_10.forEach(function(d) {
        y_array.push(machine_dict[d]);
        return '#' + d
    })

    if (document.getElementById('error_summary_machines') != null) {
        echarts.dispose(document.getElementById('error_summary_machines'))
    }
    let myChart = echarts.init(document.getElementById('error_summary_machines'));


    let option = {
        title: {
            left: 'center',
            text: '前10故障率机器分布',
            textStyle: { //标题内容的样式
                color: '#8e80e0',
                fontSize: fontSize(0.16)

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
            top: '21%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            name:'#',
            type: 'category',
            data: machine_top_10,
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
                itemStyle: {
                    normal: {
                        barBorderRadius: 5,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: "#8ac47d"
                            },
                            {
                                offset: 1,
                                color: "#bdd7ac"
                            }
                        ])
                    }
                },

            }


        ]
    };
    myChart.clear();

    myChart.setOption(option);
    window.addEventListener("resize", function() {

        myChart.resize();

    });

}


/////reset
function reset() {

    document.getElementById('real_machine_status').innerText = "";
    document.getElementById('real_machine_workE').innerText = "";
    document.getElementById('real_machine_timeE').innerText = "";
    document.getElementById('real_machine_style').innerText = "";
    document.getElementById('real_machine_pieces').innerText = "";
    document.getElementById('real_machine_errors').innerText = "";
    document.getElementById('real_machine_pqc').innerText = "";

    if (document.getElementById('efficiency') != null) {
        echarts.dispose(document.getElementById('efficiency'))
    }
    if (document.getElementById('production') != null) {
        echarts.dispose(document.getElementById('production'))
    }
    document.getElementById("real_style_table_body").innerHTML = '';
    document.getElementById('total_pieces').innerText = "";
    if (document.getElementById('production') != null) {
        echarts.dispose(document.getElementById('production'))
    }

    if (document.getElementById('realTime_machine_error') != null) {
        echarts.dispose(document.getElementById('realTime_machine_error'))
    }
    if (document.getElementById('real_machine_error_chart') != null) {
        echarts.dispose(document.getElementById('real_machine_error_chart'))
    }
    if (document.getElementById('machine_stop') != null) {
        echarts.dispose(document.getElementById('machine_stop'))
    }
    if (document.getElementById('machine_summary') != null) {
        echarts.dispose(document.getElementById('machine_summary'))
    }

    document.getElementById('ms_avg').innerText = "";
    document.getElementById('ms_run').innerText = "";
    document.getElementById('ms_stop').innerText = "";
    document.getElementById('ms_off').innerText = "";
    document.getElementById('ms_line').innerText = "";
    document.getElementById('ms_ns').innerText = "";

    if (document.getElementById('error_summary') != null) {
        echarts.dispose(document.getElementById('error_summary'))
    }
    document.getElementById('error_happening').innerText = "";
    document.getElementById('error_happened').innerText = "";
    document.getElementById('error_id').innerText = "";
    document.getElementById('top_5_defects_machine').innerText = "";
    if (document.getElementById('defects_summary') != null) {
        echarts.dispose(document.getElementById('defects_summary'))
    }
    document.getElementById('error_happening').innerText = "";
    document.getElementById("unfixed_body").innerHTML = "";
    if (document.getElementById('error_summary_machines') != null) {
        echarts.dispose(document.getElementById('error_summary_machines'))
    }

    document.getElementById('real_machine_id').innerText = "";
    document.getElementById('defects_total').innerText = "";
    document.getElementById('real_machine_toeHole').innerText = "";
    document.getElementById('real_machine_toeHole').innerText = "";
    document.getElementById('real_machine_brok').innerText = "";
    document.getElementById('real_machine_yarn').innerText = "";
    document.getElementById('real_machine_issue').innerText = "";
    document.getElementById('real_machine_dirty').innerText = "";
    document.getElementById('real_machine_other').innerText = "";

}