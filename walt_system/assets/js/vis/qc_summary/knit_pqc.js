$(function() {　　
    var todayNow = new Date();
    if (todayNow.getHours() < 8) {
        todayNow = new Date(todayNow.getTime() - 24 * 60 * 60 * 1000);
        $("#summary_k_time_shift").val("20:00:00");
    } else if (todayNow.getHours() > 19) {
        $("#summary_k_time_shift").val("20:00:00");
    }

    $("#summary_k_time").val((todayNow.getMonth() + 1) + "/" + todayNow.getDate() + "/" + todayNow.getFullYear());


    knit_pqc_enquire();

    var name = getCookie("name");
    if (name) {
        $("#machine_staff").val(name);
    }
});

function setCookie(name, value) {
    // var Days = 30;
    // var exp = new Date();
    // exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value); //+ ";expires=" + exp.toGMTString();
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}

function knitPQC_qc() {

    let k_id = $("#machine_staff option:selected").val();
    let k_name = $("#machine_staff option:selected").text();
    let k_machineId = $('#machine_id').val();
    let k_style = $('#machine_style').val();
    let k_color = $('#machine_color').val();
    let k_size = $('#machine_size').val();


    let k_Toe_hole = $('#machine_toeHoe').val() ? $('#machine_toeHoe').val() : 0
    let k_Broken_needle = $('#machine_brokenNDL').val() ? $('#machine_brokenNDL').val() : 0
    let k_Missing_yarn = $('#machine_Yarn').val() ? $('#machine_Yarn').val() : 0
    let k_fan_yarn = $('#machine_fan_Yarn').val() ? $('#machine_fan_Yarn').val() : 0
    let k_log_issue = $('#machine_logo').val() ? $('#machine_logo').val() : 0
    let k_dirty = $('#machine_dirty').val() ? $('#machine_dirty').val() : 0
    let k_other = $('#machine_other').val() ? $('#machine_other').val() : 0
    let k_marks = $('#remark').val();
    let current_day = getCurrDate();

    ///set knit day and shift
    let shift;
    let knitted_date;
    let myDate = new Date();
    let current_hour = myDate.getHours();
    if (current_hour >= 8 && current_hour <= 19) { // James:不是<=20,否则20:00-59都算白班了
        shift = '08:00:00';
        knitted_date = fix_date(0)
    } else {
        shift = '20:00:00'
        if (current_hour < 8) {
            knitted_date = fix_date(-1)
        } else {
            knitted_date = fix_date(0)
        }
    }

    var r = confirm("汇报人：" + k_name + "，\n检查完毕，确认提交？");
    if (r) {
        console.log(k_id);
        setCookie("name", k_id);
        $.ajax({
            url: '../assets/php/knit_pqc.php',
            type: 'POST',
            data: {
                k_name: k_name,
                knitted_time: knitted_date,
                k_machineId: k_machineId,
                k_Toe_hole: k_Toe_hole,
                k_Broken_needle: k_Broken_needle,
                k_Missing_yarn: k_Missing_yarn,
                k_fan_yarn: k_fan_yarn,
                k_log_issue: k_log_issue,
                k_dirty: k_dirty,
                k_other: k_other,
                k_knitted_shift: shift,
                current_day: current_day,
                k_style: k_style,
                k_size: k_size,
                k_color: k_color,
                k_marks: k_marks
            },
            success: function(data) {
                let new_data = JSON.parse(data);
                console.log(new_data)
                let data_list_1 = new_data.filter(d => parseInt(d['MachineId']) > 0 && parseInt(d['MachineId']) < 25)
                let data_list_2 = new_data.filter(d => parseInt(d['MachineId']) >= 25 && parseInt(d['MachineId']) < 50)
                let data_list_3 = new_data.filter(d => parseInt(d['MachineId']) >= 50 && parseInt(d['MachineId']) < 75)
                let data_list_4 = new_data.filter(d => parseInt(d['MachineId']) >= 75)
                draw_graph(data_list_1, 'list_1');
                draw_graph(data_list_2, 'list_2');
                draw_graph(data_list_3, 'list_3');
                draw_graph(data_list_4, 'list_4');
                //add record
                let content_html = "";
                for (let i = 0; i < new_data.length; i++) {
                    let content = '<tr><td>' + new_data[i]['DateRec'] + '</td><td>' + new_data[i]['Name'] + '</td><td>' + new_data[i]['MachineId'] + '</td><td>' + new_data[i]['ItemStyle'] + '</td><td>' + new_data[i]['Color'] + '</td><td>' + new_data[i]['Size'] + '</td><td>' +
                        new_data[i]['toeHole'] + '</td><td>' + new_data[i]['brokenNDL'] + '</td><td>' + new_data[i]['missYarn'] + '</td><td>' + new_data[i]['fanYarn'] + '</td><td>' + new_data[i]['logoIssue'] + '</td><td>' + new_data[i]['dirty'] + '</td><td>' + new_data[i]['other'] + '</td><td>' + new_data[i]['Comments'] + '</td><td>';
                    content_html += content + '\n';
                }
                document.getElementById("error_summary_table").innerHTML = content_html;
                updateMachineAndStyle()
            },
            error: function() {
                alert('Error loading XML document');
            }
        });
        //reset
        $('#machine_id').val("");
        $('#machine_style').val("");
        $('#machine_color').val("");
        $('#machine_size').val("");
        $('#machine_fan_Yarn').val("");
        $('#machine_toeHoe').val("");
        $('#machine_brokenNDL').val("");
        $('#machine_Yarn').val("");
        $('#machine_logo').val("");
        $('#machine_dirty').val("");
        $('#machine_other').val("");
        $('#remark').val("");
    }



};



function getCurrDate() {
    let date = new Date();
    let shift = '07:00:00';
    if (date.getHours() < 8) {
        date = new Date(date.getTime() - 24 * 60 * 60 * 1000);
        shift = '19:00:00';
    } else if (date.getHours() >= 20) {
        shift = '19:00:00';
    }

    let sep = "-";
    let year = date.getFullYear(); //获取完整的年份(4位)
    let month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    let day = date.getDate(); //获取当前日
    if (month <= 9) {
        month = "0" + month;
    }
    if (day <= 9) {
        day = "0" + day;
    }
    let currentdate = year + sep + month + sep + day + ' ' + shift;
    return currentdate;
};


function fix_date(lead) {
    let date = new Date();
    date.setDate(date.getDate() + lead)
    let sep = "-";
    let year = date.getFullYear(); //获取完整的年份(4位)
    let month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    let day = date.getDate(); //获取当前日
    if (month <= 9) {
        month = "0" + month;
    }
    if (day <= 9) {
        day = "0" + day;
    }
    let currentdate = year + sep + month + sep + day;
    return currentdate;
}

///draw graph

function draw_graph(data, list_id) {

    let l_data = ['破洞', '断针', '断纱', '返纱', '商标', '污渍', '其他', '检查次数'];
    let color_plate = ['#3e5dd7', '#13734e', '#d69114', '#3bd7c0', '#dd5721', '#99A3A4', '#bb3bd7', '#ea4559']
    let series_legend = []
    l_data.forEach(function(d, n) {
            series_legend.push({ name: d, type: 'bar', color: color_plate[n] })
        })
        ///draw legend
    if (document.getElementById('legend') != null) {
        echarts.dispose(document.getElementById('legend'))
    }
    let myChart_legend = echarts.init(document.getElementById('legend'));
    let option_legend = {

        legend: {
            data: l_data,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                fontSize: '14px',
                color: function(d, i) { return color_plate[i] }
            }
        },
        xAxis: {

        },
        yAxis: {},
        grid: {
            left: '1%',
            right: '1%',
            bottom: '3%',
            containLabel: true
        },
        series: series_legend,
    };

    myChart_legend.clear();
    myChart_legend.setOption(option_legend)



    let machine_number = [...new Set(data.map(d => d['MachineId']))]
    machine_number = machine_number.filter(function(el) {
        return parseInt(el) > 0;
    });
    machine_number.sort(function(a, b) { return parseInt(a) - parseInt(b) })
    machine_number = machine_number.map(d => d.trim())



    let seriers_data = []
    let l_data_scalar = ['toeHole', 'brokenNDL', 'missYarn', 'fanYarn', 'logoIssue', 'dirty', 'other']

    console.log(data)
    for (let i = 0; i < l_data.length - 1; i++) {
        let machine_data = [];
        for (let j = 0; j < machine_number.length; j++) {
            let init_data = data.filter(d => d['MachineId'].trim() == machine_number[j])
            let defects = 0
            init_data.forEach(function(d) {
                defects += parseFloat(d[l_data_scalar[i]])
            })
            machine_data.push(defects)
        }

        let obj = {
            name: l_data[i],
            type: 'bar',
            stack: '总量',
            color: color_plate[i],
            label: {
                show: true,
                position: 'insideTop',
                fontSize: '12px',
                formatter: function(params) {
                    if (params.value > 6) {
                        return params.value;
                    } else {
                        return ' ';
                    }
                }
            },
            data: machine_data
        }
        seriers_data.push(obj)
    }
    ///check times
    let check_times = []
    for (let j = 0; j < machine_number.length; j++) {
        let obj_check = parseInt(data.filter(d => d['MachineId'].trim() == machine_number[j]).length) * (-1)
        check_times.push(obj_check)
    }
    let obj2 = {
        name: '检查次数',
        type: 'bar',
        stack: '总量',
        color: '#ea4559',
        label: {
            show: true,
            position: 'insideTop',
            fontSize: '12px',
            formatter: function(params) {
                if (params.value < 0) {
                    return (params.value) * (-1);
                } else {
                    return ' ';
                }
            }
        },
        data: check_times
    }
    seriers_data.push(obj2)


    if (document.getElementById(list_id) != null) {
        echarts.dispose(document.getElementById(list_id))
    }
    let myChart = echarts.init(document.getElementById(list_id));


    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            show: false,
            data: l_data,
            textStyle: {
                fontSize: '12px',
                color: function(d, i) { return color_plate[i] }
            }
        },
        grid: {
            top: '8%',
            left: '1%',
            right: '10%',
            bottom: '1%',
            containLabel: true
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: false,
                lineStyle: {
                    color: ['#e07848', '#445aec'],
                    type: 'dashed',
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#36caca',
                    width: 1,
                    fontSize: '12px'
                },

            }
        },
        xAxis: {
            name: '机号',
            type: 'category',
            data: machine_number,
            axisLine: {
                show: true,
                interval: 0,
                lineStyle: {
                    color: '#36caca',
                    width: 1,
                    fontSize: '12px'
                },

            }

        },
        series: seriers_data
    };

    myChart.clear();
    myChart.setOption(option)
    window.addEventListener("resize", function() {
        myChart.resize();
    });
}


//summary data enquire
function knit_pqc_enquire() {
    let start_date = $('#summary_k_time').val();
    let start_time = $('#summary_k_time_shift').val();

    $.ajax({
        url: '../assets/php/knit_pqc_summary.php',
        type: 'POST',
        data: { start_date: start_date, start_time: start_time },
        success: function(data) {
            let new_data = JSON.parse(data);
            console.log(new_data)

            let data_list_1 = new_data.filter(d => parseInt(d['MachineId']) > 0 && parseInt(d['MachineId']) < 25)
            let data_list_2 = new_data.filter(d => parseInt(d['MachineId']) >= 25 && parseInt(d['MachineId']) < 50)
            let data_list_3 = new_data.filter(d => parseInt(d['MachineId']) >= 50 && parseInt(d['MachineId']) < 75)
            let data_list_4 = new_data.filter(d => parseInt(d['MachineId']) >= 75)
            draw_graph(data_list_1, 'list_1');
            draw_graph(data_list_2, 'list_2');
            draw_graph(data_list_3, 'list_3');
            draw_graph(data_list_4, 'list_4');
            //add record
            let content_html = "";
            for (let i = 0; i < new_data.length; i++) {
                let content = '<tr><td>' + new_data[i]['DateRec'] + '</td><td>' + new_data[i]['Name'] + '</td><td>' + new_data[i]['MachineId'] + '</td><td>' + new_data[i]['ItemStyle'] + '</td><td>' + new_data[i]['Color'] + '</td><td>' + new_data[i]['Size'] + '</td><td>' +
                    new_data[i]['toeHole'] + '</td><td>' + new_data[i]['brokenNDL'] + '</td><td>' + new_data[i]['missYarn'] + '</td><td>' + new_data[i]['fanYarn'] + '</td><td>' + new_data[i]['logoIssue'] + '</td><td>' + new_data[i]['dirty'] + '</td><td>' + new_data[i]['other'] + '</td><td>' + new_data[i]['Comments'] + '</td><td>';
                content_html += content + '\n';
            }
            document.getElementById("error_summary_table").innerHTML = content_html;
        },
        error: function() {
            alert('Error loading XML document');
        }
    });

}

function fontSize(res) {
    let docEl = document.documentElement,
        clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (!clientWidth) return;
    let fontSize = 100 * (clientWidth / 1920);
    return res * fontSize;
}