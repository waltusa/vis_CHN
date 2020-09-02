
function efficiency_bars(sd,st,ed,et,efficiency){
    let time_start = new Date(Date.parse(sd+' '+st));
    let time_end = new Date(Date.parse(ed+' '+et));

    if(time_start >= time_end){
        alert('Start Time or End Time is incorrect! Please re-select')
    }

    let product_efficiency = efficiency;
    let machine_id = []

    let str_check = product_efficiency[0]['DateRec'].toString()
    //if string has '(' means the time already been transferred
    if(str_check.includes('(')) {
    }else{
        for (let i = 0; i < product_efficiency.length; i++) {
            let temp_start = product_efficiency[i]['DateRec'];
            temp_start = temp_start.replace("-", "/");
            temp_start = new Date(Date.parse(temp_start));
            product_efficiency[i]['DateRec'] = temp_start;
            let temp_end = product_efficiency[i]['DateStartShift'];
            temp_end = temp_end.replace("-", "/");
            temp_end = new Date(Date.parse(temp_end));
            product_efficiency[i]['DateStartShift'] = temp_end;
            machine_id.push(product_efficiency[i]['MachCode'])

        }
    }

    machine_id = Array.from(new Set(machine_id))
    machine_id.sort((a, b) => parseInt(a) - parseInt(b));
    let id_time_efficiency = []
    let id_work_efficiency = []
    let id = [];


    machine_id.forEach(function (d) {
        let machine_id = d;
        let id_select_data = product_efficiency.filter(item=>item['MachCode']==d)
        let onTime = 0;
        let offTime = 0;
        let style_code = [];
        let actual_product = 0;
        let max_cycle = 0;
        let work_efficiency;
        let time_efficiency;
        id_select_data.forEach(function (d) {

            onTime+=parseFloat(d['TimeOn'])
            offTime+=parseFloat(d['TimeOff'])
            actual_product+=parseInt(d['Pieces'])
            if(parseInt(d['Cycle'])>max_cycle){
                max_cycle = parseInt(d['Cycle'])
            };

            if(style_code.indexOf(d['StyleCode']) !== -1){
            } else{
                style_code.push(d['StyleCode']);
            }

        })

        let total_time = parseFloat(onTime)+parseFloat(offTime)

        if(total_time && max_cycle && actual_product){
            let idea_products = parseInt(total_time/max_cycle)
            work_efficiency = parseFloat((actual_product/idea_products)*100).toFixed(2)
            id_work_efficiency.push(work_efficiency)
        }
        //time efficiency
        let total_time_percent = (onTime/(onTime+offTime)).toFixed(2);
        if(!(total_time_percent.toString()=='0.00')){

            id.push(d);
            time_efficiency = parseFloat(total_time_percent)*100;
            id_time_efficiency.push(time_efficiency);

        }
        machine_product_info[machine_id] = {'id':machine_id,'openTime':onTime,'offTime':offTime,'maxCycle':max_cycle,'pieces':actual_product,'timeE':time_efficiency,'workE':work_efficiency,'styleCode':style_code}
    })

    efficiency_id(machine_product_info,product_efficiency);

}





function stop_bars(sd,st,ed,et,error){


    let time_start = new Date(Date.parse(sd+' '+st));
    let time_end = new Date(Date.parse(ed+' '+et));

    let stop_data = error;
    //two cases-1:in one shift; 2: more than one shift
    let time_array = [];
    let result_data;


    let str_check = stop_data[0]['DateRec'].toString()
    console.log(str_check)
    if(str_check.includes('(')) {
    }else{
        for (let i = 0; i < stop_data.length; i++) {
            let temp_start = stop_data[i]['DateRec'];
            temp_start = temp_start.replace("-", "/");
            temp_start = new Date(Date.parse(temp_start));
            stop_data[i]['DateRec'] = temp_start;
            let temp_end = stop_data[i]['DateEndStop'];
            temp_end = temp_end.replace("-", "/");
            temp_end = new Date(Date.parse(temp_end));
            stop_data[i]['DateEndStop'] = temp_end;
        }
    }
    //determine if the data in one shift or more shifts
    if(parseInt(time_end-time_start)===43200000){
        if(st=='19:00:00'){
            time_array =TimeGenerate(1140);
            result_data = Generator(1140,stop_data)
            tag = 1140;

        }else{
            time_array =TimeGenerate(420);
            result_data = Generator(420,stop_data)
            tag=420;
        }
        //chart function (machine_error_data is a global variable)
        machine_error_data = clean_load_data(time_array,result_data);
        stop_machine_chart(machine_error_data);

    }else{
        tag=1000;
        machine_error_data = shifts_machine_data(stop_data);
        stop_machine_chart(machine_error_data);

    }
}


function stop_machine_chart(machine_data){
    let x_data=[];
    let y1_data=[];
    let y2_data=[];


    let color_bar_1 = '#3398DB'
    for (let item in machine_data){
        x_data.push(machine_data[item]['MachCode']);
    }
    for(let n = 0; n< x_data.length;n++){
        y1_data.push(machine_data[x_data[n]]['count'])
    }


    let color_bar_2 = '#AC8AF1';
    for(let n = 0; n< x_data.length;n++){
        y2_data.push((machine_data[x_data[n]]['duration']/60000).toFixed(2));
    }


    if (document.getElementById('efficiency_error_chart') != null) {
        echarts.dispose(document.getElementById('efficiency_error_chart'))
    }

    let myChart = echarts.init(document.getElementById('efficiency_error_chart'));

    let option = {

        legend: {
            data: ['故障次数', '故障时长'],
            top:"10%",
            right:'10%',
            textStyle:{//图例文字的样式
                color:'dodgerblue',
                fontSize:14
            }
        },
        tooltip: {
            show:true,
            transitionDuration:0,
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },

        toolbox: {
            show:true,
            transitionDuration:0,
            feature: {
                dataView: {show: true, readOnly: false},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: x_data,
                axisLabel: {
                    show: true, //默认为true，设为false后下面都没有意义了
                    interval: 0 //此处关键， 设置文本标签全部显示
                },
                axisLine:{
                    lineStyle:{
                        color:'#22cab7',
                        width:2,
                    }
                }
            }
        ],
        yAxis: [
            {
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
            }
        ],
        series: [
            {
                name: '故障次数',
                type: 'bar',
                data:y1_data,

                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                },

                color: color_bar_1,
            },
            {
                name: '故障时长',
                type: 'bar',
                data:y2_data,

                color: color_bar_2,
            }
        ]
    };
    myChart.clear();
    myChart.setOption(option);
    window.onresize = function(){
        myChart.resize();
    }
    myChart.on('click', function (params) {
        let no_machine = new_data['error'].filter(item=>item['MachCode']==params.name)

        machine_error_distribution(no_machine);
        if(tag==420){
            let t_array =TimeGenerate(tag);
            let id = params.name;
            let id_information = Generator(420,no_machine);
            let valueData = [];
            for(let i = 0; i < 25;i++){
                valueData.push(id_information[t_array[i]].length);
            }

            machine_error_information(id,t_array,valueData);
        }else if(tag==1140){
            let t_array =TimeGenerate(1140);
            let id = params.name;

            /////////
            let id_information = Generator(1140,no_machine);
            let valueData = [];
            for(let i = 0; i < 25;i++){
                valueData.push(id_information[t_array[i]].length);
            }
            machine_error_information(id,t_array,valueData);
        }else{
            let time_start = new Date(Date.parse(sd+' '+st));
            let time_end = new Date(Date.parse(ed+' '+et));
            machine_error_information_shifts(params.name,no_machine,time_start,time_end)

        }

    });
}


function efficiency_id(machine_product_info,select_data){
    console.log(machine_product_info)
    console.log(select_data)
    if (document.getElementById('efficiency_error_chart') != null) {
        echarts.dispose(document.getElementById('efficiency_error_chart'))
    }
    let myChart = echarts.init(document.getElementById('efficiency_error_chart'));



    let x_array = [];
    let y1_array = [];
    let y2_array = [];

    for(let item in machine_product_info){
        let d = machine_product_info[item];
        if(d['workE'] || d['timeE'])
        {   x_array.push(d['id'])
            y1_array.push(d['workE'])
            y2_array.push(d['timeE'])


        }

    }



    let color_bar_1 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        offset: 0,
        color: "#8ac47d"
    },
        {
            offset: 1,
            color: "#bdd7ac"
        }
    ])
    let color_bar_2 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        offset: 0,
        color: "#d00f84"
    },
        {
            offset: 1,
            color: "#db89d9"
        }
    ])


    let option = {
        legend: {
            data: ['生产效率(%)', '开机效率(%)'],
            top:"10%",
            right:'10%',
            textStyle:{//图例文字的样式
                color:'dodgerblue',
                fontSize:14
            }
        },
        tooltip: {
            show:true,
            transitionDuration:0,
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },

        toolbox: {
            show:true,
            transitionDuration:0,
            feature: {
                dataView: {show: true, readOnly: false},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: x_array,
                axisLabel: {
                    show: true, //默认为true，设为false后下面都没有意义了
                    interval: 0 //此处关键， 设置文本标签全部显示
                },
                axisLine:{
                    lineStyle:{
                        color:'#22cab7',
                        width:2,
                    }
                }
            }
        ],
        yAxis: [
            {
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
            }
        ],
        series: [
            {
                name: '生产效率(%)',
                type: 'bar',
                data:y1_array,

                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                },

                color: color_bar_1,
            },
            {
                name: '开机效率(%)',
                type: 'bar',
                data:y2_array,
                color: color_bar_2,
            }
        ]
    };


    myChart.clear();
    myChart.setOption(option);
    window.onresize = function(){
        myChart.resize();
    }
    myChart.on('click', function (params) {
        let data = machine_product_info[params.name]

        document.getElementById("text_id").innerHTML = '机器编码：'+data.id;
        document.getElementById("text_open").innerHTML = '开机时间：'+calculate_duration(data.openTime*1000);
        document.getElementById("text_stop").innerHTML = '关机时间：'+calculate_duration(data.offTime*1000);
        document.getElementById("text_timeE").innerHTML = '开机效率：'+parseInt(data.timeE)+'%';
        document.getElementById("text_cycle").innerHTML = '最大周期：'+data.maxCycle;
        document.getElementById("text_pieces").innerHTML = '生产数量：'+data.pieces;
        document.getElementById("text_workE").innerHTML = '生产效率：'+parseInt(data.workE)+'%';
        let style = "";
        for(let m in data.styleCode){
            style=style+data.styleCode[m]+";"
        }
        document.getElementById("style_code").innerHTML = 'Style Code：'+style;

        let period_data = select_data.filter(item=>item['MachCode']==params.name);

        let period_info_new = {}

        for(let i in period_data){
            if(period_data[i]['DateStartShift'] in period_info_new){

                period_info_new[period_data[i]['DateStartShift']]['pieces'].push(period_data[i]['Pieces']);
                period_info_new[period_data[i]['DateStartShift']]['onTime'].push(period_data[i]['TimeOn'])
                period_info_new[period_data[i]['DateStartShift']]['offTime'].push(period_data[i]['TimeOff'])
                period_info_new[period_data[i]['DateStartShift']]['cycle'].push(period_data[i]['Cycle'])
            }else{
                let pieces = parseInt(period_data[i]['Pieces']);
                let onTime =parseFloat(period_data[i]['TimeOn']);
                let offTime = parseFloat(period_data[i]['TimeOff']);
                let cycle = parseInt(period_data[i]['Cycle']);
                period_info_new[period_data[i]['DateStartShift']]={'time':new Date(period_data[i]['DateStartShift']),'pieces':[pieces],'onTime':[onTime],'offTime':[offTime],'cycle':[cycle],'timeE':0,"workE":0};

            }


        }

        let average = (array) => array.reduce((a, b) => parseFloat(a)+parseFloat(b)) / array.length;
        for (let j in period_info_new){
            let max_cycle = Math.max(...period_info_new[j]['cycle']);
            let off_time = period_info_new[j]['offTime'].reduce((a, b) => a + b, 0)
            let on_time = period_info_new[j]['onTime'].reduce((a, b) => a + b, 0)
            let d_pieces = period_info_new[j]['pieces'].reduce((a, b) => a + b, 0)
            period_info_new[j]['pieces'] = d_pieces;
            period_info_new[j]['timeE'] = (on_time/(on_time+off_time)).toFixed(2);
            period_info_new[j]['workE'] = (d_pieces/((on_time+off_time)/max_cycle)).toFixed(2);
        }

        machine_product(period_info_new);

    })
}


function machine_product(period_info){
    let res_counts = Object.keys(period_info).sort(function(a,b){
        return period_info[a]['time']-period_info[b]['time'];
    });
    let x_array = [];
    let y1_array = [];
    let y2_array = [];
    let y3_array = [];

    for(let item in res_counts){
        let obj = period_info[res_counts[item]];
        let month = parseInt(obj['time'].getMonth())+1
        x_array.push(month+"-"+obj['time'].getDate()+" "+obj['time'].getHours()+":00:00");
        y1_array.push(obj['pieces'])
        y2_array.push(parseInt(parseFloat(obj['timeE'])*100))
        y3_array.push(parseInt(parseFloat(obj['workE'])*100))
    }

    if (document.getElementById('machine_product') != null) {
        echarts.dispose(document.getElementById('machine_product'))
    }
    let myChart = echarts.init(document.getElementById('machine_product'));
    let option = {

        tooltip: {
            transitionDuration:0,

            trigger: 'axis'
        },
        legend: {
            data: ['生产数量', '开机效率','生产效率'],
            textStyle:{
                color:'#2ca021'
            },
            top:'10%'
        },
        grid: {
            left: '3%',
            right: '8%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: x_array,
            axisLabel: {
                rotate: 45, //标签旋转角度，对于长文本标签设置旋转可避免文本重叠
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
                    color:'#be7012',
                    width:2
                },

            }
        },
        series: [
            {
                name: '生产数量',
                type: 'line',
                data:y1_array,
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                },
                color:'red'
            },
            {
                name: '开机效率',
                type: 'line',
                data: y2_array,
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                },
                color:'#E67E22'
            },
            {
                name: '生产效率',
                type: 'line',
                data: y3_array,
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                },
                color:'#F1948A'
            }
        ]
    };

    myChart.clear();
    myChart.setOption(option);
    window.onresize = function(){
        myChart.resize();
    }

}
