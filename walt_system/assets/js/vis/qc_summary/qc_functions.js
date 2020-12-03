
/////////////paring function and graph

function paring_summary(data,start,end){

    let test_summary = 0
    data.forEach(function(d){
            test_summary+=(parseFloat(d['products'])+parseFloat(d['toeHole'])+parseFloat(d['brokenNeedle'])+parseFloat(d['missingYarn'])+parseFloat(d['logoIssue'])+parseFloat(d['dirty'])+parseFloat(d['other']))
        }
    )

    let staff_data = {}
    let knitted_day = [];
    for(let i in data){
        let obj = data[i];
        knitted_day.push(obj['KnittedTime'].substr(5,))
        if(obj['Name'] in staff_data){
            staff_data[obj['Name']]['toeHole']+=parseFloat(obj['toeHole'])
            staff_data[obj['Name']]['brokenNeedle']+=parseFloat(obj['brokenNeedle'])
            staff_data[obj['Name']]['missingYarn']+=parseFloat(obj['missingYarn'])
            staff_data[obj['Name']]['logoIssue']+=parseFloat(obj['logoIssue'])
            staff_data[obj['Name']]['dirty']+=parseFloat(obj['dirty'])
            staff_data[obj['Name']]['other']+=parseFloat(obj['other'])
            staff_data[obj['Name']]['product']+=parseFloat(obj['products'])
        }else{
            staff_data[obj['Name']] = {Name:obj['Name'],toeHole:parseFloat(obj['toeHole']),brokenNeedle:parseFloat(obj['brokenNeedle']),missingYarn:parseFloat(obj['missingYarn']),
                logoIssue:parseFloat(obj['logoIssue']),dirty:parseFloat(obj['dirty']),product:parseFloat(obj['products']),other:parseFloat(obj['other'])}
        }
    }




    let knitted_date = ""
    let unique_date = [...new Set(knitted_day)];
    for(let i in unique_date){
        if(i%7==6){
            knitted_date+=("\n"+unique_date[i])
        }else{
            knitted_date+=(";"+unique_date[i])
        }
    }

    let staff_data_pie = []
    let total = 0;
    let defects = 0;
    let qualified = 0;
    let toe_hole = 0;
    let broken_needle = 0;
    let missing_yarn = 0;
    let logo_issue = 0;
    let dirty = 0;
    let other = 0;

    for(let j in staff_data){
        let staff = staff_data[j];
        let i_defects = parseFloat(staff['toeHole'])+parseFloat(staff['brokenNeedle'])+parseFloat(staff['missingYarn'])+parseFloat(staff['logoIssue'])+parseFloat(staff['other'])
        total +=((parseFloat(staff['product']))+parseFloat(staff['dirty'])+i_defects)
        staff_data_pie.push({value:((parseFloat(staff['product']))+parseFloat(staff['dirty'])+i_defects),name:staff['Name']})
        defects+=i_defects
        qualified+=(parseFloat(staff['product'])+parseFloat(staff['dirty']));
        toe_hole+=parseFloat(staff['toeHole'])
        broken_needle+=parseFloat(staff['brokenNeedle'])
        missing_yarn+=parseFloat(staff['missingYarn'])
        logo_issue+=parseFloat(staff['logoIssue'])
        dirty+=parseFloat(staff['dirty'])
        other+=parseFloat(staff['other'])
    }

    let defects_data_pie = [{value:qualified,name:'Qualified'},{value:other,name:'Other'},{value:toe_hole,name:'Toe Hole'},{value:broken_needle,name:'Broken Needle'},
        {value:missing_yarn,name:'Missing Yarn'},{value:logo_issue,name:'Logo Issue'}]



    if (document.getElementById('paring_chart_1') != null) {
        echarts.dispose(document.getElementById('paring_chart_1'))
    }
    let myChart = echarts.init(document.getElementById('paring_chart_1'));
    let colorPalette = ['#e94040', '#f3f37d','#6091f3','#79c6e0','#ff8000', '#8000ff'];
    let colorPalette2 = ['#3db005','#9B59B6', '#2471A3','#138D75','#D68910','#FF5733'];

    let option = {
        title: {
            text: 'Total Pairs:'+total,
            left: 'center',
            textStyle:{
                fontFamily:'Arial',
                fontSize:fontSize(0.15),
                color:'#45d2b2'
            }
        },
        grid: {
            top:'10%',
            left: '12%',
            right: '16%',
            bottom:'24%'
        },

        legend: {
            top:"15%",
            textStyle:{
                color:'white',
                fontSize:fontSize(0.13),
            }
        },
        tooltip: {
            formatter: '{b}<br/> {c} ({d}%)',
            transitionDuration:0
        },

        series: [{
            type: 'pie',
            radius: '40%',
            center: ['55%', '58%'],
            labelLine: {
                length:3
            },
            data: staff_data_pie,
            color:colorPalette,
            label:{            //饼图图形上的文本标签
                normal:{
                    show:true,
                    textStyle : {
                        fontSize : fontSize(0.12),   //文字的字体大小
                    },
                    formatter:'{c}'+'\n'+'({d}%)'
                }
            },
            // No encode specified, by default, it is '2012'.
        }
        ]
    };
    myChart.clear();
    myChart.setOption(option);


    ///////////pie chart2
    if (document.getElementById('paring_chart_2') != null) {
        echarts.dispose(document.getElementById('paring_chart_2'))
    }
    let myChart2 = echarts.init(document.getElementById('paring_chart_2'));
    let option2 = {
        title: {
            text: 'Defects:'+defects+'('+((defects/total)*100).toFixed(2)+'%);'+'\n\n'+' Qualified:'+ (total-defects)+' (Dirty:'+dirty+')',
            left: 'center',
            textStyle:{
                fontFamily:'Arial',
                fontSize:fontSize(0.15),
                color:'#86b51a'
            }
        },
        tooltip: {
            formatter: '{b}<br/> {c} ({d}%)',

            transitionDuration:0,

        },
        legend: {
            show:false,
            orient: 'horizontal',
            top:'13%',
            left: "2%",
            data: [ 'Other', 'Toe Hole', 'Broken Needle', 'Missing Yarn', 'Logo Issue','Qualified'],
            selected:{
                'Qualified':false
            },
            textStyle:{
                fontSize:fontSize(0.12),
                color:function(d,i){
                    return colorPalette2[i]
                }
            }
        },
        series: [
            {
                name: 'Products',
                type: 'pie',
                center: ['45%', '55%'],
                radius: ['25%', '35%'],
                avoidLabelOverlap: false,
                label: {
                    normal:{
                        show:true,
                        textStyle : {
                            fontSize : fontSize(0.12),   //文字的字体大小
                        },
                        formatter:'{b}'+'\n'+'{c}'+'({d}%)'
                    }
                },

                labelLine: {
                    show:true,
                    normal:{
                        length:10
                    }

                },
                data: defects_data_pie,
                color: colorPalette2,
            }
        ]
    };


    myChart2.clear();
    myChart2.setOption(option2);



    ////chart 3

    let bar_data = date_transfer(start,end,data);
    let x= [];
    let y_amount = [];
    let y_rate = [];

    for(let i in bar_data) {
        x.push(i)
        let i_defects = 0;
        let qualified = 0;
        bar_data[i].forEach(function (d) {
            i_defects += (parseFloat(d['toeHole']) + parseFloat(d['brokenNeedle']) + parseFloat(d['missingYarn']) + parseFloat(d['logoIssue'])  + parseFloat(d['other']))
            qualified += (parseFloat(d['products'])+ parseFloat(d['dirty']))

        })

        y_rate.push(((qualified/(qualified+i_defects))* 100).toFixed(2))
        y_amount.push(qualified+i_defects)
    }

    if (document.getElementById('paring_chart_3') != null) {
        echarts.dispose(document.getElementById('paring_chart_3'))
    }
    let myChart3 = echarts.init(document.getElementById('paring_chart_3'));
    let option3 = {
        title:{
            text:enquire_date_flag.toUpperCase()+' Statistics',
            left:'center',
            textStyle:{
                fontFamily:'Arial',
                color:'#d4642f',
                fontSize:fontSize(0.15),
            }

        },

        legend: {
            top:'10%',
            data: [ 'Paring Amounts','Good Rate'],
            textStyle:{
                fontFamily:'Arial',
                fontSize:fontSize(0.12),
                color:'white'
            }
        },
        tooltip: {
            trigger: 'axis',
            transitionDuration:0,

        },
        grid: {
            left: '14%',
            right: '10%',
            bottom:'24%'
        },
        xAxis: [
            {
                type: 'category',
                data: x,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: 'white',
                        fontSize:fontSize(0.12)
                    }
                },
                splitLine: {//显示分割线
                    show: true
                }
            }

        ],
        yAxis: [
            {
                name:'pair',
                nameTextStyle:{
                    color: 'white',
                    fontSize:fontSize(0.12)
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: 'white',
                        fontSize:fontSize(0.12)
                    }
                },
                type: 'value',
                splitLine: {//不显示分割线
                    show: false
                },
            },
            {
                splitLine: {//不显示分割线
                    show: false
                },
                name:'%',
                nameTextStyle:{
                    color: 'white',
                    fontSize:fontSize(0.12)
                },
                type: 'value',
                min: Math.min(...y_rate),
                max: 100,
                interval: 10,
                axisLabel: {
                    formatter: '{value} %',
                    textStyle: {
                        color: 'white',
                        fontSize:fontSize(0.12)
                    }
                }
            }

        ],
        series: [

            {
                name: 'Paring Amounts',
                type: 'bar',
                data: y_amount,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: "#14f1be"
                },
                    {
                        offset: 1,
                        color: "#8ae5e5"
                    }
                ]),
                label: {
                    textStyle:{
                        fontSize:fontSize(0.11),
                        color:'white'
                    },
                    show: true,
                    position: 'top',
                    formatter: function(params) {
                        if (params.value > 0) {
                            return params.value;
                        } else {
                            return ' ';
                        }
                    },
                },
            },
            {
                name: 'Good Rate',
                type: 'line',
                yAxisIndex: 1,
                data: y_rate
            }
        ]
    };


    myChart3.clear();
    myChart3.setOption(option3);


    // chart 4
    let style_qualified = []
    let style_defects = []
    let totalData = []
    let style_list = [...new Set(data.map(d=>d['itemNum'].toUpperCase()))];
    let x_style = [];
    for(let item in style_list){
        let defects_style = 0;
        let qualified_style = 0;
        let style_data = data.filter(it=>it['itemNum']==style_list[item])
        style_data.forEach(function (d){
            defects_style+=((parseFloat(d['toeHole']) + parseFloat(d['brokenNeedle']) + parseFloat(d['missingYarn']) + parseFloat(d['logoIssue'])  + parseFloat(d['other'])))
            qualified_style += (parseFloat(d['products'])+ parseFloat(d['dirty']));
        })
        if((qualified_style+defects_style)!=0){
            x_style.push(style_list[item])
            style_defects.push(defects_style)
            style_qualified.push(qualified_style)
            totalData.push(defects_style+qualified_style)
        }

    }
    if (document.getElementById('paring_chart_4') != null) {
        echarts.dispose(document.getElementById('paring_chart_4'))
    }
    let myChart4 = echarts.init(document.getElementById('paring_chart_4'));
    let option4 = {
        title:{
            text:'Style Statistics',
            left:'center',
            textStyle:{
                fontFamily:'Arial',
                fontSize:fontSize(0.15),
                color:'#d161ea'
            }
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
            top:'15%',
            data: ['Qualified', 'Defects'],
            textStyle:{
                color:'white',
                fontSize:fontSize(0.12)
            }
        },
        grid: {
            left: '3%',
            right: '10%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            axisLabel: {
                show: false,
                textStyle: {
                    color: 'white',

                }
            },
            splitLine: {
                show:false,
                lineStyle: {
                    color:['#dda587']
                }
            },
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: x_style,
            axisLabel: {
                show: true,
                textStyle: {
                    color: 'white',
                    fontSize:fontSize(0.12)
                }
            },
        },
        series: [
            {
                name: 'Qualified',
                type: 'bar',
                stack: '总量',
                label: {
                    show: false
                },
                data: style_qualified,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                    offset: 0,
                    color: "#19a748"
                },
                    {
                        offset: 1,
                        color: "#93efad"
                    }
                ]),
            },
            {
                name: 'Defects',
                type: 'bar',
                stack: '总量',
                label: {
                    show: false
                },
                data: style_defects,
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                    offset: 0,
                    color: "#db1c39"
                },
                    {
                        offset: 1,
                        color: "#ec8ea2"
                    }
                ]),
            },
            {
                name: 'Total',
                type: 'bar',
                stack: '',
                color:'#93efad',
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        color: '#f3eded',
                        fontSize:fontSize(0.12)
                    }
                },
                z: -1,
                //不同系列的柱间距离，为百分比,如果想要两个系列的柱子重叠，可以设置 barGap 为 '-100%'。
                barGap: '-100%',
                data: totalData
            }
        ]
    };
    myChart4.clear();
    myChart4.setOption(option4);




    //chart 5 defects distribution on machine
    let colorPalette3 = ['#9B59B6', '#2471A3','#138D75','#D68910','#34495E','#FF5733'];

    let machine_id = [... new Set(data.map(item=>item['MachineId']))]
    let defects_data = ['other','toeHole','brokenNeedle','missingYarn','dirty','logoIssue']
    let series_data = []
    for (let s in defects_data){
        let defect_reason = defects_data[s];
        let series_machine_data = machine_id.map(item=>0)
        for(let j =0; j< machine_id.length;j++){
            let select_data = data.filter(item=>item['MachineId']==machine_id[j])
            for(let da in select_data){
                series_machine_data[j]+=parseFloat(select_data[da][defect_reason])
            }
        }

        let defect_series = {
            name:defect_reason,
            type:'bar',
            stack:'总量',
            label:{
                show:false,
                position:'insideTop',
                formatter: function(params) {
                    if (params.value > 0) {
                        return params.value;
                    } else {
                        return ' ';
                    }
                },
            },
            data:series_machine_data,
            color:colorPalette3[s]
        }
        series_data.push(defect_series)
    }

    machine_id = machine_id.map(item=>item.substr(2))
    if (document.getElementById('machine_defects') != null) {
        echarts.dispose(document.getElementById('machine_defects'))
    }
    let myChart5 = echarts.init(document.getElementById('machine_defects'));
    let option5 = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: defects_data,
            textStyle:{

              color:function (d,i){
                  return colorPalette3[i]
              },
                fontSize:fontSize(0.12)

            },
            selected: {
                'dirty':false
            }
        },
        grid: {
            left: '3%',
            right: '12%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                show: true,
                textStyle: {
                    color: 'white',
                    fontSize:fontSize(0.12)
                }
            },
            name:'pair',
            nameTextStyle:{
                color: 'white',
                fontSize:fontSize(0.12)
            },
            splitLine: {
                show:true,
                lineStyle: {
                    color:['#e07848','#445aec'],
                    type:'dashed',
                }
            },
        },
        xAxis: {
            type: 'category',
            name:'Machine#',
            nameTextStyle:{
                color: 'white',
                fontSize:fontSize(0.12)
            },
            axisLabel:{
                show:true,
                interval:0,
                textStyle: {
                    color: 'white',
                    fontSize:fontSize(0.12)
                }
            },
            data: machine_id
        },
        series: series_data
    };
    myChart5.clear();
    myChart5.setOption(option5);
    window.onresize = function(){
        myChart.resize();
        myChart2.resize();
        myChart3.resize();
        myChart4.resize();
        myChart5.resize();
    }

        //pie charts click function
        myChart.on('click', function (params){
            let click_data = staff_data[params['data']['name']];
            let single_defects = parseFloat(click_data['toeHole'])+parseFloat(click_data['brokenNeedle'])+parseFloat(click_data['missingYarn'])+parseFloat(click_data['logoIssue'])+parseFloat(click_data['other'])
            let single_qualified =  (parseFloat(click_data['product']));

            let defects_data_pie = [{value:single_qualified,name:'Qualified'},,{value:click_data['other'],name:'Other'},{value:click_data['toeHole'],name:'Toe Hole'},{value:click_data['brokenNeedle'],name:'Broken Needle'},
                {value:click_data['missingYarn'],name:'Missing Yarn'},{value:click_data['logoIssue'],name:'Logo Issue'}]
            myChart2.setOption({
                title: {
                    text: 'Defects(pair):'+single_defects+'('+((single_defects/(parseFloat(click_data['product']+single_defects)))*100).toFixed(2)+'%);'
                        +'Qualified: '+single_qualified,
                    subtext:params['data']['name']+'(total:'+parseFloat(parseFloat(single_qualified)+parseFloat(single_defects))+')',
                    left: 'center',
                    textStyle:{//标题内容的样式
                        color:'dodgerblue',
                    },
                },
                series: [{
                    data: defects_data_pie
                }]
            });

            // click change mychart 3

            let x_staff= [];
            let y_amount_staff = [];
            let y_rate_staff = [];
            for(let i in bar_data) {
                x_staff.push(i)
                let i_defects = 0;
                let qualified = 0;
                let staff_bar_data = bar_data[i].filter(item=>item['Name']==params['data']['name'])
                staff_bar_data.forEach(function (d) {
                    i_defects += (parseFloat(d['toeHole']) + parseFloat(d['brokenNeedle']) + parseFloat(d['missingYarn']) + parseFloat(d['logoIssue']) + parseFloat(d['other']))
                    qualified += (parseFloat(d['products'])+ parseFloat(d['dirty']) )
                })
                y_rate_staff.push((((qualified) / (qualified+i_defects)) * 100).toFixed(2))
                y_amount_staff.push((qualified+i_defects))
            }
            myChart3.setOption({
                yAxis: [
                    {
                        type: 'value',
                        name: 'Pieces',
                        splitLine: {//不显示分割线
                            show: false
                        },
                    },
                    {
                        splitLine: {//不显示分割线
                            show: false
                        },
                        type: 'value',
                        textStyle:{
                            fontSize:fontSize(0.11),
                            color:'white'
                        },
                        show: true,
                        position: 'top',
                        name: 'Good Rate(%)',
                        min: Math.min(...y_rate_staff),
                        max: 100,
                        interval: 10,
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }

                ],
                series: [

                    {
                        name: 'Paring Amounts',
                        type: 'bar',
                        data: y_amount_staff,
                        label: {
                            show: true,
                            textStyle:{
                                fontSize:fontSize(0.11),
                                color:'white'
                            },
                            show: true,
                            position: 'top',
                            formatter: function(params) {
                                if (params.value > 0) {
                                    return params.value;
                                } else {
                                    return ' ';
                                }
                            },
                        },
                    },
                    {
                        name: 'Good Rate(%)',
                        type: 'line',
                        yAxisIndex: 1,
                        data: y_rate_staff
                    }
                ]
            });

            // click change mychart 4
            let style_qualified = []
            let style_defects = []
            let style_total = [];
            let style_select_data = data.filter(item=>item['Name']==params['data']['name'])
            style_list = [...new Set(style_list)];
            let x_style = [];
            for(let item in style_list){
                let defects_style = 0;
                let qualified_style = 0;

                let style_data = style_select_data.filter(it=>it['itemNum']==style_list[item])
                style_data.forEach(function (d){
                    defects_style+=((parseFloat(d['toeHole']) + parseFloat(d['brokenNeedle']) + parseFloat(d['missingYarn']) + parseFloat(d['logoIssue'])  + parseFloat(d['other'])))
                    qualified_style += (parseFloat(d['products'])+ parseFloat(d['dirty']));

                })
                if((defects_style+qualified_style)!=0){
                    x_style.push(style_list[item])
                    style_defects.push(defects_style)
                    style_qualified.push(qualified_style)
                    style_total.push(parseFloat(defects_style)+parseFloat(qualified_style))
                }

            }
            myChart4.setOption({
                yAxis: {
                    type: 'category',
                    data: x_style
                },
                series: [

                    {
                        data: style_qualified
                    },
                    {
                        data: style_defects
                    },
                    {
                        data:style_total
                    }
                ]
            });

        });

        //machine defects click
        myChart5.on('click',function(params){
            let machine_select_data = data.filter(d=>d['MachineId'].substr(2)==params['name'].substr(1))
            let log = ""
            machine_select_data.forEach(function(d){
                let log_defects= parseFloat(d['brokenNeedle'])+parseFloat(d['dirty'])+parseFloat(d['logoIssue'])+parseFloat(d['missingYarn'])+parseFloat(d['other'])+parseFloat(d['toeHole'])
                let log_str = '-------------------'+d['KnittedTime'].substr(5)+' '+d['shift']+'----------------------------'+'\n'+'brokenNeedle:'+parseFloat(d['brokenNeedle'])+'\n'
                    +'dirty:'+parseFloat(d['dirty'])+'\n'
                    +'logoIssue:'+parseFloat(d['logoIssue'])+'\n'
                    +'missingYarn:'+parseFloat(d['missingYarn'])+'\n'
                    +'other:'+parseFloat(d['other'])+'\n'
                    + 'toeHole:'+parseFloat(d['toeHole'])+'\n';
                log+=(log_str)

            })
            alert(log)
        })

}


function date_transfer(start_date,end_date,data){

    let date = []
    let test_date = getNextDate(start_date,0)
    end_date = getNextDate(end_date,0)
    let i = 1;
    while(test_date <= end_date){
        date.push(test_date.substr(5,5))
        test_date = getNextDate(start_date,i);
        i+=1;
    }

    let reg;
    if(enquire_date_flag=='paring_date'){
        reg = 'DateRec';
    }else{
        reg = 'KnittedTime'
    }
    let data_date = {}
    for(let i in date){
        data_date[date[i]] = data.filter(item=>item[reg].includes(date[i]))
    }

    return data_date
}

function getNextDate(date,day) {
    let dd = new Date(date);
    dd.setDate(dd.getDate() + day);
    let y = dd.getFullYear();
    let m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
    let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    return y + "-" + m + "-" + d;
};