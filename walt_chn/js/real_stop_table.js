

function realTime_error_table(error_data){
    $("#realTime_error_body").empty();
    let content_html = '';
    let new_error_data = error_data.filter(item=>item['StopCode']!=99992)
    if(new_error_data.length > 8){
        let playPromise = new Audio('alarm.mp3');
        playPromise.play().then(() => {
            console.log('Playing')
        })
            .catch(e => {
                console.log('Error Occured', e.message);
            })
    }
    let filter_error_data =[]
    for (let i in error_data){
        if(error_data[i]['StopCode']==99992){
            continue;
        }else{
            filter_error_data.push(error_data[i])
        }
    }

    for(let i = 0;i<filter_error_data.length;i++){
        let date = filter_error_data[i]['DateRec'].slice(10, filter_error_data[i]['DateRec'].length)
        let content ='<tr><td>'+'#'+filter_error_data[i]['MachCode']+'</td><td>' + filter_error_data[i]['StopCode'] + '</td><td>' + date+'</td><td>' + filter_error_data[i]['description']+'</td></tr>';
        content_html += content + '\n';
    }
    document.getElementById("realTime_error_body").innerHTML =content_html;
}


function realTime_error_bar(fixedData,errorData){

    let error_data_dict = {}
    for(let i in fixedData){
        let obj = fixedData[i];
        if(obj['StopCode'] in error_data_dict){
            error_data_dict[obj['StopCode']]['fixed']+=1;
        } else{
            error_data_dict[obj['StopCode']] = {'StopCode':obj['StopCode'],'Description':obj['description'],'fixed':1,'unfixed':0}
        }
    }
    for(let j in errorData){
        let e_obj = errorData[j];
        if(e_obj['StopCode'] in error_data_dict){
            error_data_dict[e_obj['StopCode']]['unfixed']+=1;
        } else{
            error_data_dict[e_obj['StopCode']] = {'StopCode':e_obj['StopCode'],'Description':e_obj['description'],'fixed':0,'unfixed':1}
        }

    }
    let new_error_data_dict={}
    let total_count = 0;
    for(let m in error_data_dict){
        total_count+=error_data_dict[m]['fixed'];
        total_count+=error_data_dict[m]['unfixed'];

        if(error_data_dict[m]['fixed']>5 || error_data_dict[m]['unfixed']>0){
            new_error_data_dict[m] = error_data_dict[m]
        }
    }

    let text = '实时错误总计发生：'+total_count;
    let res_counts = Object.keys(new_error_data_dict).sort(function(a,b){
        return new_error_data_dict[a]['fixed']-new_error_data_dict[b]['fixed'];
    });
    let x_fixed_data = [];
    let x_unfixed_data = [];
    res_counts.forEach(function(d){
        let item = new_error_data_dict[d]
        x_fixed_data.push(parseInt(item['fixed']));
        x_unfixed_data.push(parseInt(item['unfixed']))
    })

    if (document.getElementById('error_result_bar') != null) {
        echarts.dispose(document.getElementById('error_result_bar'))
    }
    let myChart = echarts.init(document.getElementById('error_result_bar'));


    let option = {
        title: {
            text: text,
            subtext:'仅展示已修复故障次数 > 5 或者正在发生故障',
            left: 'center',
            textStyle:{//标题内容的样式
                color:'dodgerblue',

            },
        },

        tooltip: {
            trigger: 'axis',
            showDelay: 20,
            hideDelay: 20,
            transitionDuration:0,
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
                return new_error_data_dict[params[0]['name']]['Description']
            }
        },
        legend: {
            data: ['已修复故障', '故障正在发生'],
             top:"14%",
            textStyle:{//图例文字的样式
                color:'dodgerblue',
                fontSize:12
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top:'25%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    color:['#22cab7']
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
            type: 'category',
            data: res_counts,
            axisLabel: {
            show: true, //默认为true，设为false后下面都没有意义了
            interval: 0, //此处关键， 设置文本标签全部显示
            },
            nameTextStyle:{
        color:['#be7012']
    },
            axisLine: {
            lineStyle:{
            color:'#ebf8ac',
                width:2
        },

    }
        },
        series: [
            {
                name: '已修复故障',
                type: 'bar',
                stack: '总量',
                label: {
                    show: true,
                    position: 'insideLeft'
                },
                data: x_fixed_data,
                itemStyle: {
                    normal: {
                        barBorderRadius: 5,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: "#00ffe3"
                        },
                            {
                                offset: 1,
                                color: "#7ab3ae"
                            }
                        ])
                    }
                },
                formatter: function(params) {
                    if (params.value > 0) {
                        return params.value;
                    } else {
                        return ' ';
                    }
                }

            },
            {
                name: '故障正在发生',
                type: 'bar',
                stack: '总量',
                label: {
                    show: true,
                    position: 'insideRight',
                    formatter: function(params) {
                        if (params.value > 0) {
                            return params.value;
                        } else {
                            return ' ';
                        }
                    },
                },
                data: x_unfixed_data,
                itemStyle: {
                    normal: {
                        barBorderRadius: 5,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: "red"
                        },
                            {
                                offset: 1,
                                color: "#c66265"
                            }
                        ])
                    }
                },

            }
        ]
    };
    myChart.clear();

    myChart.setOption(option)
    window.onresize = function(){
        myChart.resize();
    }


}
function realTime_error_machine(fixedData,errorData){

    let error_machine_dict = {}
    for(let i in fixedData){
        let obj = fixedData[i];
        if(obj['MachCode'] in error_machine_dict){
            error_machine_dict[obj['MachCode']]['fixed']+=1;
        } else{
            error_machine_dict[obj['MachCode']] = {'MachCode':obj['MachCode'],'Description':obj['description'],'fixed':1,'unfixed':0}
        }
    }
    for(let j in errorData){
        let e_obj = errorData[j];
        if(e_obj['MachCode'] in error_machine_dict){
            error_machine_dict[e_obj['MachCode']]['unfixed']+=1;
        } else{
            error_machine_dict[e_obj['MachCode']] = {'MachCode':e_obj['MachCode'],'Description':e_obj['description'],'fixed':0,'unfixed':1}
        }

    }
    let new_error_machine_dict={}
    let total_count = 0;
    for(let m in error_machine_dict){
        new_error_machine_dict[m] = error_machine_dict[m]
    }

    let res_counts = Object.keys(new_error_machine_dict).sort(function(a,b){
        return new_error_machine_dict[b]['fixed']-new_error_machine_dict[a]['fixed'];
    });
    let y_fixed_data = [];
    let y_unfixed_data = [];
    res_counts.forEach(function(d){
        let item = new_error_machine_dict[d]
        y_fixed_data.push(parseInt(item['fixed']));
        y_unfixed_data.push(parseInt(item['unfixed']))
    })


    //select top 20 machine
    res_counts = res_counts.slice(0, 20);
    y_fixed_data = y_fixed_data.slice(0, 20);
    y_unfixed_data = y_unfixed_data.slice(0, 20);

    res_counts=res_counts.map(item=>'#'+item.toString())
    if (document.getElementById('error_machine_bar') != null) {
        echarts.dispose(document.getElementById('error_machine_bar'))
    }
    let myChart = echarts.init(document.getElementById('error_machine_bar'));


    let option = {
        title: {
            left: 'center',
            text: '机器故障分布(前 20)',
            textStyle:{//标题内容的样式
                color:'dodgerblue',

            },
        },
        tooltip: {
            trigger: 'axis',
            showDelay: 20,
            hideDelay: 20,
            transitionDuration:0,
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['已修复故障', '故障正在发生'],
            top:"12%",
            textStyle:{//标题内容的样式
                color:'dodgerblue',

            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: res_counts,
                axisLabel: {
                    show: true, //默认为true，设为false后下面都没有意义了
                    interval: 0, //此处关键， 设置文本标签全部显示
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

                nameTextStyle:{
                    color:['#be7012']
                },
                axisLine: {
                    lineStyle:{
                        color:'#ebf8ac',
                        width:2
                    },

                }


            }
        ],
        series: [

            {
                name: '已修复故障',
                type: 'bar',
                stack: 'total',
                /*label: {
                    show: true,
                    position: 'insideBottom',
                    formatter: function(params) {
                        if (params.value > 0) {
                            return params.value;
                        } else {
                            return ' ';
                        }
                    },
                },*/
                data: y_fixed_data,
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

            },
            {
                name: '故障正在发生',
                type: 'bar',
                stack: 'total',
                label: {
                    show: false,
                    position: 'insideTop',
                    formatter: function(params) {
                        if (params.value > 0) {
                            return params.value;
                        } else {
                            return ' ';
                        }
                    },
                },
                data: y_unfixed_data,
                itemStyle: {color: 'red'}

            },


        ]
    };
    myChart.clear();

    myChart.setOption(option);
    myChart.on('click', function (params) {

        let select_data = fixedData.filter(item=>item['MachCode']==params['name'].slice(1))
        for(let i in errorData){
            if (errorData[i]['MachCode']==params['name'].slice(1)){
                select_data.push(errorData[i]);
            }
        }
        let select_error_data = {}
        for(let m in select_data){
            if (select_data[m]['StopCode'] in select_error_data){
                select_error_data[select_data[m]['StopCode']]['count']+=1;
            }else{
                select_error_data[select_data[m]['StopCode']] = {'stopCode':select_data[m]['StopCode'],'description':select_data[m]['description'],'count':1}
            }
        }
        let res="";
        let res_down = Object.keys(select_error_data).sort(function(a,b){
            return select_error_data[b]['count']-select_error_data[a]['count'];
        });
        for(let i in res_down){
            let obj = select_error_data[res_down[i]];
            res += '故障次数:'+obj['count']+"--"+obj['description']+'\n'
        }
        alert(res)
    })
    window.onresize = function(){
        myChart.resize();
    }


}