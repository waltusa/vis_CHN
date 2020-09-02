function machine_error_table(index,value){
    let time_start = new Date(Date.parse(sd+' '+st));
    let time_end = new Date(Date.parse(ed+' '+et));

    let select_data = new_data['error'];
    let time_array = []
    let result_data;
    let new_result_data = []

    if(parseInt(time_end-time_start)===43200000){
        if(st=='19:00:00'){
            time_array =TimeGenerate(1140);
            result_data = Generator(1140,select_data)

        }else{
            time_array =TimeGenerate(420);
            result_data = Generator(420,select_data)
        }

        for (let i in time_array ){
            for(let item in result_data[time_array[i]]){
                new_result_data.push(result_data[time_array[i]][item])
            }
        }

        //error table
        if(index=='上一页'){
            draw_table(new_result_data,0,value);
        }else{
            draw_table(new_result_data,5,value);
        }



    }else{
        new_result_data = select_data;
        if(index=='上一页'){
            draw_table(new_result_data,0,value);
        }else{
            draw_table(new_result_data,5,value);
        }
    }

    //onclick stop code
    let table = document.getElementById("error_body_result_shifts");
    if (table != null) {
        for (let i = 0; i < table.rows.length; i++) {
            table.rows[i].onclick = function () {
                let str = this.cells[0].innerHTML;
                let start = str.indexOf(':')+1
                let stopCode = str.slice(start,str.length)
                let machine_data = new_result_data.filter(item=>item['StopCode']==stopCode)
                draw_table_charts(machine_data);

                if(parseInt(time_end-time_start)===43200000){

                    let select_array = [];

                    for(let m in time_array){
                        let obj = result_data[time_array[m]];
                        let select_id_data = obj.filter(item=>item['StopCode']==stopCode)
                        select_array.push(select_id_data.length)
                    }
                    draw_table_charts_time(stopCode,time_array,select_array)
                }else{
                    let time_array = []
                    //
                    let time_start_2 = new Date(Date.parse(sd+' '+st));
                    let time_end_2 = new Date(Date.parse(ed+' '+et));

                    while(time_start_2 <= time_end_2){
                        let t = new_time_transfer(time_start_2);
                        time_array.push(t);
                        new Date(time_start_2.setHours( time_start_2.getHours() + 12))
                    }
                    let new_select_data = new_result_data.filter(item=>item['StopCode']==stopCode)
                    let select_y_array = []
                    for (let i = 0; i< time_array.length-1;i++){
                        let ti_start = new Date(Date.parse('2020-'+time_array[i]));
                        let ti_end = new Date(Date.parse('2020-'+time_array[i+1]));

                        let ini_select = new_select_data.filter(item=>item['DateRec']>=ti_start && item['DateRec']<ti_end)
                        select_y_array.push(ini_select.length)
                    }

                    draw_table_charts_time(stopCode,time_array,select_y_array)

                }
            };
        }
    }

}


function draw_table(resultData,start,value){
    $("#error_body_result_shifts").empty();
    let result_data = resultData;

    let total = 0;
    let stopCounts = {};

    for(let item in result_data){
        total +=1;
        let code = result_data[item]['StopCode']
        let s_time = result_data[item]['DateRec'];
        let e_time = result_data[item]['DateEndStop'];
        let duration = 0;
        if(s_time && e_time){
            duration = e_time.getTime()-s_time.getTime()
            duration=Math.floor(duration/(1000))
        }

        if (code in stopCounts){

            stopCounts[code]['downtime']+=duration
            stopCounts[code]['counts'] +=1;
        }else{
            stopCounts[code] ={'stopCode':code,'description':result_data[item]['description'],'counts':1,'proportion':0,'downtime':duration}
        }
    }

    for(let item in stopCounts){
        stopCounts[item]['proportion'] = (stopCounts[item]['counts']/total*100).toFixed(2)
    }
    let sorted_code = vSort(stopCounts);
    let errorCountTable = []
    let errorCountTime = []
    let end = start + 5;
    for (let i = start; i < end;i++){
        errorCountTable.push(stopCounts[sorted_code[0][i]])
        errorCountTime.push(stopCounts[sorted_code[1][i]])
    }
    if (parseInt(value)==1){
        create_counts_shifts(errorCountTable,start);
    }else{
        create_duration(errorCountTime,start);
    }
}

function create_counts_shifts(top_data,start){
    let content_html = '';
    for(let i = 0;i<top_data.length;i++){
        let index = i+1+start;
        let content ='<tr><td>'+'<strong>'+index+'</strong>'+':'+top_data[i]['stopCode']+'</td><td>' + top_data[i]['description'] + '</td><td>' + top_data[i]['counts']+'</td><td>' + top_data[i]['proportion']+'</td></tr>';
        content_html += content + '\n';
    }
    document.getElementById("table_diff_shifts").innerHTML ='%';
    document.getElementById("error_body_result_shifts").innerHTML =content_html;
}


function create_duration(top_data,start){
    let content_html = '';
    for(let i = 0;i<top_data.length;i++){
        let time = top_data[i]['downtime'];
        let h = Math.floor(time/3600);
        let m = Math.floor(time/60%60);
        let s = Math.floor(time % 60);
        if(h<10){
            h = "0"+h.toString();
        }
        if(m<10){
            m = "0"+m.toString();
        }
        if(s<10){
            s = "0"+s.toString();
        }
        time = h+":"+m+":"+s
        let index = i+1+start;
        let content = '<tr><td>'+'<strong>'+index+'</strong>'+':'+top_data[i]['stopCode']+'</td><td>' + top_data[i]['description']+ '</td><td>' + top_data[i]['counts'] + '</td><td>'  + time+'</td></tr>';
        content_html += content + '\n';
    }
    document.getElementById("table_diff_shifts").innerHTML ='时长';
    document.getElementById("error_body_result_shifts").innerHTML =content_html;
}

function draw_table_charts_time(stopCode,x_array,y_array){
        if (document.getElementById('table_chart_shifts_time') != null) {
            echarts.dispose(document.getElementById('table_chart_shifts_time'))
        }
        let count = 0
        y_array.forEach(function(d){
            count+=d;
        })

        let text = '故障:'+stopCode.toString()+' 时间段错误分布'+'(总计：'+count+')'
        let myChart = echarts.init(document.getElementById('table_chart_shifts_time'));
        let option = {
            title: {
                text: text,
                textStyle:{//标题内容的样式
                    color:'#c452b4',

                }
            },
            tooltip: {
                show:true,
                transitionDuration:0,
                trigger: 'axis'
            },

            xAxis: {
                type: 'category',
                data: x_array,
                axisLabel: {
                    rotate: 45, //标签旋转角度，对于长文本标签设置旋转可避免文本重叠
                    textStyle: {
                        fontSize : 10     //更改坐标轴文字大小
                    }
                },
                axisLine:{
                    lineStyle:{
                        color:'#22cab7',
                        width:2,
                    }
                }
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        color:['#be7012']
                    }
                },
                nameTextStyle:{
                    color:['#be7012']
                },
                axisLine: {
                    lineStyle:{
                        color:'#be7012',
                        width:2
                    },

                }
            },
            series: [{
                name:'停机次数：',
                data: y_array,
                type: 'line',
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                    ]
                },
                color: '#dbbf33',

            }]
        };
        myChart.clear();

        myChart.setOption(option);
        window.onresize = function(){
            myChart.resize();
        }

    }
function draw_table_charts(machineData) {

    let machine_errorCode = {}
    let stopCode = machineData[0]['StopCode']
    for (let item in machineData) {
        let machine = machineData[item];
        let s_time = machine['DateRec'];
        let e_time = machine['DateEndStop']
        let duration = e_time.getTime() - s_time.getTime()
        let duration_min = Math.floor(duration / 60000)
        duration = Math.floor(duration)

        if (machine['MachCode'] in machine_errorCode) {
            machine_errorCode[machine['MachCode']]['Count'] += 1
            machine_errorCode[machine['MachCode']]['Duration'] += duration_min
            machine_errorCode[machine['MachCode']]['start'].push(time_transfer(s_time))
            machine_errorCode[machine['MachCode']]['end'].push(time_transfer(e_time))
            machine_errorCode[machine['MachCode']]['single_dtime'].push(calculate_duration(duration))

        } else {
            machine_errorCode[machine['MachCode']] = {
                'MachCode': machine['MachCode'],
                'Count': 1,
                'Duration': duration_min,
                'start': [time_transfer(s_time)],
                'end': [time_transfer(e_time)],
                'single_dtime': [calculate_duration(duration)]
            }
        }

    }

    let res_counts = Object.keys(machine_errorCode).sort(function (a, b) {
        return machine_errorCode[a]['Count'] - machine_errorCode[b]['Count'];
    });
    let x_data;
    let y_data1 = [];
    let y_data2 = [];
    let text = '故障' + stopCode.toString() + ' 机器错误分布'
    x_data = res_counts;
    x_data.forEach(function (d, i) {
        y_data1.push(machine_errorCode[d]['Count']);
        y_data2.push(machine_errorCode[d]['Duration']);
    })
    x_data = x_data.map(item => 'No:' + item);


    if (document.getElementById('table_chart_shifts') != null) {
        echarts.dispose(document.getElementById('table_chart_shifts'))
    }

    let myChart = echarts.init(document.getElementById('table_chart_shifts'));
    let option = {
        title: {
            text: text,
            textStyle:{//标题内容的样式
                color:'#c452b4',

            }
        },
        tooltip: {
            show: true,
            transitionDuration: 0,
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['停机次数'],
            orient: 'vertical',
            right: '2%',
            textStyle:{//标题内容的样式
                color:'#F39C12',
                fontSize: '10px'

            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            splitLine: {
                show:false,
                lineStyle: {
                    color:['#be7012']
                }
            },
            nameTextStyle:{
                color:['#be7012']
            },
            axisLine: {
                lineStyle:{
                    color:'#22cab7',
                    width:2
                },

            }
        },
        yAxis: {
            type: 'category',
            data: x_data,
            axisLabel: { //xAxis，yAxis，axis都有axisLabel属性对象
                show: true, //默认为true，设为false后下面都没有意义了
                interval: 0, //此处关键， 设置文本标签全部显
            },
            axisLine:{
                lineStyle:{
                    color:'#be7012',
                    width:2,
                }
            }
        },
        series: [
            {
                name: '停机次数',
                type: 'bar',
                data: y_data1,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'right',
                            textStyle: {
                                color: '#F39C12'
                            }
                        },
                        barBorderRadius: 2,
                        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                            offset: 0,
                            color: "#be7012"
                        },
                            {
                                offset: 1,
                                color: "#d9b78f"
                            }
                        ])
                    }
                }

            },


        ]
    };
    myChart.clear();

    myChart.setOption(option);
    window.onresize = function () {
        myChart.resize();
    }
}
