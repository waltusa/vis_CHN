function TimeGenerate(start_time) {

    let x = 30; //minutes interval
    let times = []; // time array
    let tt = start_time; // start time
    let limit = Math.floor(tt / 60)+12;
//loop to increment the time and push results in array
    for (let i = 0; tt <= limit * 60; i++) {
        let hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
        let mm = (tt % 60); // getting minutes of the hour in 0-55 format
        times[i] = ("0" + (hh%24)).slice(-2) + ':' + ("0" + mm).slice(-2); // pushing data in array in [00:00 - 12:00 AM/PM format]
        tt = tt + x;
    }
    return times
}




function Generator(start_time,data){
    let result = []
    let time_line = TimeGenerate(start_time);
    let new_line = []

    let date1 = data[0]['DateRec'].toLocaleDateString();
    let date2 = data[data.length-1]['DateRec'].toLocaleDateString();


    let standard_time;
    if(start_time==1140){

    }else{
        standard_time = date2+' '+'07:00';
        standard_time = new Date(Date.parse(standard_time));
        date1 = date2;

    }
    time_line.forEach(function(d,i){
        result[d] = [];
        if(i>=10){
            d=date2+" "+d;
        }else{
            d=date1+" "+d;
        }

        d = new Date(Date.parse(d));
        new_line.push(d);
    })

    let data_array = [];
    for(let m = 0; m < new_line.length-1;m++){
        let test_data = data.filter(item=>item['DateRec']>=new_line[m] && item['DateRec']< new_line[m+1])
        test_data.forEach(function(d){
            result[time_line[m]].push(d)
        })

    }

    return result;
}

function clean_load_data(start_time,data) {
    let summary_dict = {}
    for (let i in start_time) {
        let time = start_time[i];
        for (let j in data[time]) {
            let obj = data[time][j];
            if (obj['MachCode'] in summary_dict) {
                let s_time = obj['DateRec'];
                let e_time = obj['DateEndStop']
                let duration = e_time.getTime() - s_time.getTime()
                summary_dict[obj['MachCode']]['duration'] += duration
                summary_dict[obj['MachCode']]['count'] += 1;
            } else {
                let s_time = obj['DateRec'];
                let e_time = obj['DateEndStop']
                let duration = e_time.getTime() - s_time.getTime()
                duration = Math.floor(duration / (1000))
                summary_dict[obj['MachCode']] = {'MachCode': obj['MachCode'], 'count': 1, 'duration': duration}
            }
        }
    }


    return summary_dict;
}


function shifts_machine_data(data){
    let summary_dict = {}
    for (let i in data){
        let obj = data[i];
        if(obj['MachCode'] in summary_dict){
            let s_time = obj['DateRec'];
            let e_time = obj['DateEndStop']
            let duration = e_time.getTime()-s_time.getTime()
            if(duration){
                summary_dict[obj['MachCode']]['duration']+=duration
            }
            summary_dict[obj['MachCode']]['count']+=1;
        }else{
            let s_time = obj['DateRec'];
            let e_time = obj['DateEndStop']
            let duration = e_time.getTime()-s_time.getTime()
            if(duration){
                duration = 0
            }
            duration=Math.floor(duration/(1000))
            summary_dict[obj['MachCode']] = {'MachCode':obj['MachCode'],'count':1,}
            summary_dict[obj['MachCode']] = {'MachCode':obj['MachCode'],'count':1,'duration':duration}

        }
    }
    return summary_dict;
}


function clean_charts(){
    if (document.getElementById('stop_chart') != null) {
        echarts.dispose(document.getElementById('stop_chart'))
    }

    if (document.getElementById('efficiency_chart') != null) {
        echarts.dispose(document.getElementById('efficiency_chart'))
    }

    if (document.getElementById('machine_product') != null) {
        echarts.dispose(document.getElementById('machine_product'))
    }
    if (document.getElementById('machine_product') != null) {
        echarts.dispose(document.getElementById('machine_product'))
    }
    if (document.getElementById('error_summary_line') != null) {
        echarts.dispose(document.getElementById('error_summary_line'))
    }
    if (document.getElementById('sankey_diagram') != null) {
        echarts.dispose(document.getElementById('sankey_diagram'))
    }
    if (document.getElementById('error_summary_bar') != null) {
        echarts.dispose(document.getElementById('error_summary_bar'))
    }
    if (document.getElementById('table_chart_shifts_time') != null) {
        echarts.dispose(document.getElementById('table_chart_shifts_time'))
    }
    if (document.getElementById('table_chart_shifts') != null) {
        echarts.dispose(document.getElementById('table_chart_shifts'))
    }
}

function text_clean(){
    document.getElementById("text_id").innerHTML = '机器编号：';
    document.getElementById("text_open").innerHTML = '开机时间：';
    document.getElementById("text_stop").innerHTML = '关机时间：';
    document.getElementById("text_timeE").innerHTML = '开机效率：';
    document.getElementById("text_cycle").innerHTML = '最大周期：';
    document.getElementById("text_pieces").innerHTML = '生产数量：';
    document.getElementById("text_workE").innerHTML = '生产效率：';
}

function vSort(dict){
    let result = []
    let dic = dict;
    let res_counts = Object.keys(dic).sort(function(a,b){
        return dic[b]['counts']-dic[a]['counts'];
    });
    result.push(res_counts);
    let res_down = Object.keys(dic).sort(function(a,b){
        return dic[b]['downtime']-dic[a]['downtime'];
    });
    result.push(res_down);
    return result;
}

function time_transfer(date){
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    if(h<10){
        h = "0"+h.toString();
    }
    if(m<10){
        m = "0"+m.toString();
    }
    if(s<10){
        s = "0"+s.toString();
    }
    let time = h+":"+m+":"+s;
    return time;
}

function calculate_duration(duration){

    let time = Math.floor(duration / 1000);
    let h = Math.floor(time / 3600);
    let m = Math.floor(time / 60 % 60);
    let s = Math.floor(time % 60);
    if (h < 10) {
        h = "0" + h.toString();
    }
    if (m < 10) {
        m = "0" + m.toString();
    }
    if (s < 10) {
        s = "0" + s.toString();
    }
    time = h + ":" + m + ":" + s
    return time
}
