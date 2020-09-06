function real_machine_status(machine_data) {


    let w_efficiency = [];
    let t_efficiency = [];
    let real_piece = [];
    let style = []
    let machine_id = [];
    let margin = {top: 0, right: -0, bottom: 0, left: 100},
        width = 800 - margin.left - margin.right,
        height = 340 - margin.top - margin.bottom;


    let data = machine_data['machine'];
    let running_total = 0;
    let stop_total = 0;
    let wait_total = 0;
    console.log(data)




    d3.select("svg").remove();
    let svg_container = d3.select("#machine")
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
            .attr('xlink:href', function (d) {
                if (d['TimeOn'] ==0 ){
                        stop_total+=1;
                        return 'image/off2.png'
                }else if(d['State']==0){
                    w_efficiency.push(d['WorkEfficiency']);
                    t_efficiency.push(d['TimeEfficiency']);
                    machine_id.push(d['MachCode']);
                    real_piece.push(d['ShiftPieces'])
                    style.push(d['StyleCode'])
                    running_total+=1;
                    return 'image/run_n.png'
                }else{
                    w_efficiency.push(d['WorkEfficiency']);
                    t_efficiency.push(d['TimeEfficiency']);
                    machine_id.push(d['MachCode']);
                    real_piece.push(d['ShiftPieces'])
                    style.push(d['StyleCode'])
                    wait_total+=1;
                    return 'image/stop.PNG'
                }
            })
            .attr("x", function (d,i) { return (i%11)*50 })
            .attr("y", function(d,i){
                if(i<11){
                    return 20
                }else if(i>=11 && i<22){
                    return 100
                }else if(i>=22 && i<33){
                    return 180
                }else{
                    return 260
                }
            })
            .attr('width',40)
            .attr('height',35)
            .on("mouseover", function(d,i) {
                d3.select(this)
                    .attr('width',50)
                    .attr('height',45)
            })
            .on("mouseout", function(d,i) {
                d3.select(this)
                    .attr('width',40)
                    .attr('height',35)
            })
            .on('click',function(d,i){
                document.getElementById('machID').innerText='机器编码: ' +d['MachCode'];
                document.getElementById('t_e').innerText ='开机效率: '+d['TimeEfficiency']+'%' ;
                document.getElementById('w_e').innerText ='生产效率: '+d['WorkEfficiency']+'%';
                document.getElementById('t_off').innerText = '停机时间: '+secondsToHms(d['TimeOff']);
                document.getElementById('t_on').innerText ='开机时间: '+secondsToHms(d['TimeOn']);
                document.getElementById('l_c').innerText = '最近周期: '+d['LastCycle'];
                document.getElementById('l_s').innerText ='最近停机: '+d['LastStopCode'];
                document.getElementById('s_c').innerText = '产品型号: '+d['StyleCode'].replace(" ", "");
                document.getElementById('pieces').innerText ='生产数量: '+d['ShiftPieces'];

            })

    images.append('text')
        .text(function(d){
            return d['MachCode']
        })
        .attr("x", function (d,i) { return (i%11)*50+12 })
        .attr("y", function(d,i){
            if(i<11){
                return 20+50
            }else if(i>=11 && i<22){
                return 100+50
            }else if(i>=22 && i<33){
                return 180+50
            }else{
                return 260+50
            }
        })
        .attr('font-size',18)
        .style('fill','#22cab7')
    document.getElementById('run').innerText= '运行中: '+running_total
    document.getElementById('fix').innerText= '停机中: '+wait_total
    document.getElementById('off').innerText= '关机状态: '+ stop_total
    real_machine_bar(machine_id,w_efficiency,t_efficiency);
    realTime_machine_product(machine_id,real_piece,style);



}

function real_machine_bar(x_data,y_1,y_2){

    if (document.getElementById('machine_efficiency') != null) {
        echarts.dispose(document.getElementById('machine_efficiency'))
    }
    //pie data
    let colorPalette = ['#00b04f', '#33FFDA', '#ffbf00','#DF3B45'];
    let pie_data = [0,0,0,0]
    for(let i in y_1){
        if(y_1[i]<80){
            pie_data[3]+=1;
        }else if(y_1[i]>=80 && y_1[i]<90){
            pie_data[2]+=1;
        }else if(y_1[i]>=90 && y_1[i]<95){
            pie_data[1]+=1;
        }else{
            pie_data[0]+=1;
        }
    }


    let myChart = echarts.init(document.getElementById('machine_efficiency'));
    x_data = x_data.map(item=>item.toString())
    let option = {
        legend: {
            data: ['生产效率', '开机效率'],
            top:"46%",
            left:'10%',
            textStyle:{//图例文字的样式
                color:'dodgerblue',
                fontSize:16
            }
        },
        grid:{
            height:120,
            top: '55% '
        },
        tooltip: {
            trigger: 'axis',
            showDelay: 20,
            hideDelay: 20,
            transitionDuration:0,
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
        },
        xAxis: {
            type: 'category',
            data:x_data,
            axisLabel: {
                interval: 0,
                show: true, //默认为true，设为false后下面都没有意义了
            },
            axisLine:{
                lineStyle:{
                    color:'#22cab7',
                    width:2,
                }
            }
        },
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
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
            {
                name: '生产效率',
                type: 'bar',
                data: y_1,
                markLine: {
                    data: [
                        {
                            type: 'average',
                            name: '平均值',
                        },

                    ],
                    itemStyle:{
                        color:'orange'
                    }
                },
                itemStyle: {
                    normal: {
                        barBorderRadius: 2,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: "#dba547"
                        },
                            {
                                offset: 1,
                                color: "#cdab83"
                            }
                        ])
                    }
                },
            },
            {
                name: '开机效率',
                type: 'bar',
                data: y_2,
                itemStyle: {
                    normal: {
                        barBorderRadius: 2,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: "#C1B2EA"
                        },
                            {
                                offset: 1,
                                color: "#8362C6"
                            }
                        ])
                    }
                },
            },
            {
                name: '生产效率',
                type: 'pie',
                radius: '35%',
                center: ['50%', '25%'],
                data: [
                    {value: pie_data[0], name: '95%~100%:'},
                    {value: pie_data[1], name: '90%~95%:'},
                    {value: pie_data[2], name: '80%~90%:'},
                    {value: pie_data[3], name: '<80%:'},
                     ],
                label:{            //饼图图形上的文本标签
                normal:{
                        show:true,
                        position:'outside', //标签的位置
                        textStyle : {
                        fontSize : 16    //文字的字体大小
                        },
                    formatter:'{b} : {c} ({d}%)'
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
    }
        ]
    };
    myChart.clear();
    myChart.setOption(option);
    window.onresize = function(){
        myChart.resize();
    }
}

function secondsToHms(d) {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    let hDisplay = h > 9 ? h  : "0"+h;
    let mDisplay = m > 9 ? m  : "0"+m;
    let sDisplay = s > 9 ? s  : "0"+s;
    return hDisplay +'h:'+ mDisplay +'m:'+ sDisplay+'s';
}





// machine products chart
function realTime_machine_product(x_array,y_array,color){


    let total = 0;
    for (let m in y_array){
        total+=y_array[m]
    };
    //let color_map = ['#800080','#F08080','#00FFFF','#FF00FF','#0000FF']
    let unique = [...new Set(color)]
   // color = color.map(item=>color_map[unique.indexOf(item)])


    let seriesList = [];
    for (let i=0; i<unique.length;i++)
    {
        let init_data = []
        for(let j=0;j<color.length;j++){
            let obj = color[j];
            if (obj==unique[i]){
                init_data.push(y_array[j])
            }else{
                init_data.push(0)
            }
        }
        seriesList.push(
            {
                name:unique[i],
                type:'bar',
                stack: 'area',
                label: {
                    show: true,
                    position: 'insideTop',
                    formatter: function(params) {
                        if (params.value > 0) {
                            return params.value;
                        } else {
                            return ' ';
                        }
                    },
                },
                symbol: 'none',

                data:
                    init_data

            }
        );//end-push
    } //end-for-loop

    if (document.getElementById('product_style_chart') != null) {
        echarts.dispose(document.getElementById('product_style_chart'))
    }
    x_array = x_array.map(item=>item.toString())
    let myChart = echarts.init(document.getElementById('product_style_chart'));
    let option2 = {
            title: {
                left: 'center',
                text: '机器生产数量--型号分布 (生产总计：'+total+')',
                textStyle:{//标题内容的样式
                    color:'#FF5733',

                },
            },
            legend: {
                data:unique,
                top:"12%",
                bottom: '10%',
                textStyle:{//标题内容的样式
                    color:'dodgerblue',

                },
            },
            tooltip: {
                trigger: 'axis',
                showDelay: 20,
                hideDelay: 20,
                transitionDuration:0,
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data:x_array,
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
            },
            yAxis: [
                {
                    show:false,
                    type: 'value',
                    nameTextStyle:{
                        show:false,
                        color:['#ebf8ac']
                    },
                    axisLine: {
                        show:false,
                        lineStyle:{
                            color:'#ebf8ac',
                            width:2
                        }},
                    splitLine: {
                        show:false
                    }
                }
            ],
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: seriesList
        };
    console.log(seriesList)

    myChart.clear();
        myChart.setOption(option2);
        window.onresize = function(){
            myChart.resize();
        }
}
