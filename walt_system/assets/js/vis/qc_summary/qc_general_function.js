
// date type update
enquire_date_flag = 'paring_date';

function date_type(flag){
    if(flag=='paring'){
        enquire_date_flag ='paring_date'
        $("#p_start_date").css("display", "block");
        $("#p_end_date").css("display", "block");
        $("#k_start_date").css("display", "none");
        $("#k_end_date").css("display", "none");
    }else{
        $("#p_start_date").css("display", "none");
        $("#p_end_date").css("display", "none");
        $("#k_start_date").css("display", "block");
        $("#k_end_date").css("display", "block");
        if(flag=='knit_day'){
            $("#k_start_date").css('color','#ec0345')
            $("#k_end_date").css('color','#ec0345')
            enquire_date_flag ='paring_knit_day'

        }else{
            $("#k_start_date").css('color','black')
            $("#k_end_date").css('color','black')
            enquire_date_flag ='paring_knit_night'
        }
    }
}


//paring params reset
function paring_reset(){
    var r = confirm("Warning! It's reset button not submit, still want to clear current paring_table_database_bodyds?");
    if(r){
        $('#p_machineId').val("");
        $('#p_style').val("");
        $('#product').val("");
        $('#Toe_hole').val("");
        $('#broken_needle').val("");
        $('#missing_yarn').val("");
        $('#logo_issue').val("");
        $('#p_other').val("");
        $('#dirty').val("");
    }

}

/**
 * 获得当前日期（年-月-日）
 */
function getCurrDate() {
    let date = new Date();
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
    let currentdate = year + sep + month + sep + day+' 08:00:00';
    return currentdate;
}

//paring data summary
function paring_qc(){
    let p_name = $("#p_name option:selected").text();
    let p_knitted_name = $('#p_time').val();
    let p_knitted_shift = $('#p_time_shift').val();
    let p_machineId = $('#p_machineId').val();
    let Toe_hole = $('#Toe_hole').val() ? $('#Toe_hole').val():0
    let Broken_needle = $('#broken_needle').val()? $('#broken_needle').val():0
    let Missing_yarn = $('#missing_yarn').val()? $('#missing_yarn').val():0
    let log_issue = $('#logo_issue').val()? $('#logo_issue').val():0
    let dirty = $('#dirty').val()? $('#dirty').val():0
    let other = $('#p_other').val()? $('#p_other').val():0
    let product = $('#product').val()? $('#product').val():0
    let p_style = $('#p_style').val();
    let p_shift = $('#p_time_shift').val();

    let info_text = "You are going to submit:"+'\n'+
                    'Name: '+p_name +'\n'+
                    'Style Code: '+p_style+'\n'+
                    'Machine ID: '+ p_machineId+'\n'+
                    'Knitted Date: '+p_knitted_name+'\n'+
                    'Knitted Shift: '+p_knitted_shift+'\n'+
                    'Toe Hole: ' + Toe_hole+'\n'+
                    'Broken_needle: ' + Broken_needle+'\n'+
                    'Missing_yarn: ' + Missing_yarn+'\n'+
                    'other: ' + other+'\n'+
                    'dirty: ' + dirty+'\n'+
                    'Qualified: ' + product+'\n';
    let r = confirm(info_text);
    let current_date = getCurrDate();
    if(r){
        $.ajax({
            url: '../assets/php/paring_qc.php',
            type: 'POST',
            data:{p_name:p_name,p_knitted_name:p_knitted_name,p_machineId:p_machineId,Toe_hole:Toe_hole,
                Broken_needle:Broken_needle,Missing_yarn:Missing_yarn,log_issue:log_issue,dirty:dirty,other:other,product:product,p_item_number:p_style,p_shift:p_shift,current_date:current_date},
            success: function(data){
                let new_data = JSON.parse(data);
                console.log(new_data)
                //add record
                let content_html = "";
                for(let i =0; i <new_data.length;i++){
                    let tag = parseInt(i)+parseInt(1)
                    let content ='<tr><td>'+tag+'</td><td>'+new_data[i]['DateRec']+'</td><td>'+new_data[i]['Name']+'</td><td>'+new_data[i]['itemNum']+'</td><td>' +new_data[i]['MachineId'] + '</td><td>' + new_data[i]['KnittedTime']+'</td><td>'+ new_data[i]['shift']+'</td><td>'+ new_data[i]['toeHole']+'</td><td>'+ new_data[i]['brokenNeedle']+'</td><td>'+ new_data[i]['missingYarn']+'</td><td>'+new_data[i]['logoIssue']+'</td><td>'+new_data[i]['dirty']+'</td><td>'+new_data[i]['other']+'</td><td>'+new_data[i]['products']+'</td><td>';
                    content_html += content + '\n';
                }
                document.getElementById("paring_table_database_body").innerHTML =content_html;
            },
            error: function(){
                alert('Error loading XML document');
            }
        });


        //reset
        $('#p_machineId').val("");
        $('#p_style').val("");
        $('#product').val("");
        $('#Toe_hole').val("");
        $('#broken_needle').val("");
        $('#missing_yarn').val("");
        $('#logo_issue').val("");
        $('#p_other').val("");
        $('#dirty').val("");
    }

}



//global variable for date type; flag--paring_date;knit_day; knit_nigh
function summary_enquire(){
    let start_date;
    let end_date;
    start_date = $("#p_start").val();
    end_date = $("#p_end").val();

    if(start_date && end_date){
        $.ajax({
            url: '../assets/php/QC_summary.php',
            type: 'POST',
            data:{start_date:start_date,end_date:end_date,start_time:'00:00:00',end_time:'23:59:59'},
            success: function(data){
                let new_data = JSON.parse(data);

                // data is paring date or knitted date
                let data_paring = new_data['paring']

                //add option to select box
                var b=$("#paring_style_menu option:first").text();
                $("#paring_style_menu").html('<option>'+b+'</option>');

                let style_list = [...new Set(data_paring.map(d=>d['itemNum'].toUpperCase()))]

                style_list.forEach(function(d){
                    $("#paring_style_menu").append("<option value='"+d+"'>"+d+"</option>");
                })

                //selected option changed
                $('#paring_style_menu').on('change', function() {
                    if(this.value =='All Styles Item'){
                        paring_summary(data_paring,start_date,end_date);
                    }else{

                        let style_paring = data_paring.filter(d=>d['itemNum'].toUpperCase()==this.value)
                        paring_summary(style_paring,start_date,end_date);
                    }

                });

                //draw graph
                paring_summary(data_paring,start_date,end_date);


                //add data to table
                let content_html = "";
                for(let i =0; i <data_paring.length;i++){
                    let tag = parseInt(i)+parseInt(1)
                    let content ='<tr><td>'+tag+'</td><td>'+data_paring[i]['DateRec']+'</td><td>'+data_paring[i]['Name']+'</td><td>'+data_paring[i]['itemNum']+
                        '</td><td>' +data_paring[i]['MachineId'] + '</td><td>' + data_paring[i]['KnittedTime']+'</td><td>'+ data_paring[i]['shift']+
                        '</td><td>'+ data_paring[i]['toeHole']+'</td><td>'+ data_paring[i]['brokenNeedle']+'</td><td>'+ data_paring[i]['missingYarn']+
                        '</td><td>'+data_paring[i]['logoIssue']+'</td><td>'+data_paring[i]['dirty']+'</td><td>'+data_paring[i]['other']+'</td><td>'+
                        data_paring[i]['products']+'</td><td>';
                    content_html += content + '\n';
                }
                document.getElementById("paring_table_database_body").innerHTML =content_html;
                ///download file
                $('#save-btn').click(function (){
                    file_download(start_date,end_date,new_data);
                })
                $('#table_to_cvs').click(function (){
                    tableToExcel(data_paring);
                })


            },
            error: function(){
                alert('Error loading XML document');
            }
        });
    }else{
        alert('Start Time or End Time is incorrect! Please re-select')
    }


}

//table to csv file
function tableToExcel(data) {
    console.log(data)
        // 要导出的json数据
        let jsonData =  [];
        data.forEach(function(d){
            let obj = {Recorded_Date:d['DateRec'],Name:d['Name'],Item_Style_Code:d['itemNum'],Machine_ID:d['MachineId'].substr(2),Knitted_Date:d['KnittedTime'],
                Knitted_Shift:d['shift'],Toe_Hole:d['toeHole'],Broken_Needle:d['brokenNeedle'],
                Missing_Yarn:d['missingYarn'],Logo_Issue:d['logoIssue'],Other:d['other'],Qualified:d['products']}
            jsonData.push(obj)
        })

        // 列标题
        let str = '<tr><td>Recorded_Date</td><td>Name</td><td>Item_Style_Code</td><td>Machine_ID</td><td>Knitted_Date</td><td>Knitted_Shift</td><td>Toe_Hole</td><td>Broken_Needle</td><td>Missing_Yarn</td><td>Logo_Issue</td><td>Other</td><td>Dirty</td><td>Qualified</td></tr>';
        // 循环遍历，每行加入tr标签，每个单元格加td标签
        for(let i = 0 ; i < jsonData.length ; i++ ){
            str+='<tr>';
            for(const key in jsonData[i]){
                // 增加\t为了不让表格显示科学计数法或者其他格式
                str+=`<td>${ jsonData[i][key] + '\t'}</td>`;
            }
            str+='</tr>';
        }
        // Worksheet名
        const worksheet = 'Sheet1'
        const uri = 'data:application/vnd.ms-excel;base64,';

        // 下载的表格模板数据
        const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
        xmlns:x="urn:schemas-microsoft-com:office:excel" 
        xmlns="http://www.w3.org/TR/REC-html40">
        <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body><table>${str}</table></body></html>`;
        // 下载模板
        window.location.href = uri + base64(template);
    }

// 输出base64编码
const base64 = s => window.btoa(unescape(encodeURIComponent(s)));


////write text file for download

function file_download(sd,ed,raw_data){
    let file_name = sd+'_to_'+ed+'.txt'

    let tab = '          ';
    console.log(raw_data)
    let data = raw_data['paring'];
    let name = [...new Set(data.map(d=>d['Name']))]
    let name_data = "";
    let total = 0;
    let defects = 0;
    let qualified = 0;
    let toe_hole = 0;
    let broken_needle = 0;
    let missing_yarn = 0;
    let logo_issue = 0;
    let dirty = 0;
    let other = 0;

    name.forEach(function(d){
        let n_data = data.filter(item=>item['Name'] == d)
        let amounts = 0;
        n_data.forEach(function(d){
            amounts +=(parseFloat(d['brokenNeedle'])+parseFloat(d['dirty'])+parseFloat(d['logoIssue'])+parseFloat(d['missingYarn'])+parseFloat(d['other'])+parseFloat(d['products'])+parseFloat(d['toeHole']))
            broken_needle+= parseFloat(d['brokenNeedle']);
            toe_hole += parseFloat(d['toeHole']);
            missing_yarn +=parseFloat(d['missingYarn'])
            logo_issue +=parseFloat(d['logoIssue'])
            dirty +=parseFloat(d['dirty'])
            other +=parseFloat(d['other'])
            qualified +=(parseFloat(d['products'])+parseFloat(d['dirty']))
        })

        total+=amounts;
        name_data+=(tab+'Name: '+d+' ------ '+amounts+'\n')
    })

    defects = parseFloat(broken_needle)+parseFloat(toe_hole)+parseFloat(missing_yarn)+parseFloat(logo_issue)+parseFloat(other);


    let qualification_text = tab+'Qualified (pairs): '+qualified + ' (Dirty: '+dirty+')' +'\n'+
        tab+'Defects(pairs): '+defects+' ( Defective Rate: '+ (parseFloat(defects)/(parseFloat(defects)+parseFloat(qualified))*100).toFixed(2)+'%)'+'\n'+
        tab+tab+'broken_needle: '+broken_needle+'\n'+
        tab+tab+'missing_yarn: '+missing_yarn+'\n'+
        tab+tab+'logo_issue: '+logo_issue+'\n'+
        tab+tab+'toe_hole: '+toe_hole+'\n'+
        tab+tab+'other: '+other+'\n';




    ///////////////////style code text
    let style_List  = [...new Set(data.map(d=>d['itemNum']))]
    let style_text = text('itemNum',style_List,data);
    let machine_text = machine_text_write(data);

    let text_data = "-----------  Pairing Date: "+sd+'~'+ed+'----------------'+'\n\n'+
        "Total Paring(pairs): "+total+'\n'+
        name_data+'\n\n'+
        qualification_text+'\n'+
        '.............................................................'+'\n'+
        style_text+'\n'+
        '.............................................................'+'\n'+
        machine_text+'\n';

    var blob = new Blob([text_data],
        {type:"text/plain;charset=utf-8"});
    saveAs(blob,file_name);
}

function text(flag,array,data){
    let tab = '          ';
    let flag_text = "";
    array.forEach(function(d){
        let total = 0;
        let defects = 0;
        let qualified = 0;
        let toe_hole = 0;
        let broken_needle = 0;
        let missing_yarn = 0;
        let logo_issue = 0;
        let dirty = 0;
        let other = 0;
        let n_data = data.filter(item=>item[flag] == d)
        n_data.forEach(function(d){
            broken_needle+= parseFloat(d['brokenNeedle']);
            toe_hole += parseFloat(d['toeHole']);
            missing_yarn +=parseFloat(d['missingYarn'])
            logo_issue +=parseFloat(d['logoIssue'])
            dirty +=parseFloat(d['dirty'])
            other +=parseFloat(d['other'])
            qualified +=(parseFloat(d['products'])+parseFloat(d['dirty']))
        })
        defects = parseFloat(broken_needle)+parseFloat(toe_hole)+parseFloat(missing_yarn)+parseFloat(logo_issue)+parseFloat(other);
        total = parseFloat(qualified)+parseFloat(defects);

        flag_text+=(d+'---------------Total Pairs: '+total+'\n'+
            tab+'Qualified (pairs): '+qualified + ' (Dirty: '+dirty+')' +'\n'+
            tab+'Defects(pairs): '+defects+' ( Defective Rate: '+ (parseFloat(defects)/(parseFloat(defects)+parseFloat(qualified))*100).toFixed(2)+'%)'+'\n'+
            tab+tab+'broken_needle: '+broken_needle+'\n'+
            tab+tab+'missing_yarn: '+missing_yarn+'\n'+
            tab+tab+'logo_issue: '+logo_issue+'\n'+
            tab+tab+'toe_hole: '+toe_hole+'\n'+
            tab+tab+'other: '+other+'\n')

    })
    return flag_text

}


//font-size
function fontSize(res){
    let docEl = document.documentElement,
        clientWidth = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
    if (!clientWidth) return;
    let fontSize = 100 * (clientWidth / 1920);
    return res*fontSize;
}


//function machine text
function machine_text_write(data){
   let machine_data =  [...new Set(data.map(d=>d['MachineId'].substr(2)))];
    machine_data = machine_data.sort((a, b) => parseInt(a) - parseInt(b));

    let content ="";
   for(let i in machine_data){
       console.log(machine_data[i])
       content+=('---------------------------------------------------------------------------'+'\n')
       content+=('|------------------------------------------Machine ID: '+machine_data[i]+''+'\n')
       content+=('---------------------------------------------------------------------------'+'\n')
       let obj = data.filter(d=>d['MachineId'].substr(2)==machine_data[i]);
       let obj_date = [...new Set(obj.map(d=>d['KnittedTime']))];
        console.log(obj_date)
       obj_date.sort((a, b) => new Date (b) - new Date (a))
       for(let j in obj_date){
           let date = obj_date[j];
           content+=('#############Knitted Date: '+date+'\n');
           let obj_date_data = obj.filter(d=>d['KnittedTime']==date);
           let defects = 0;
           let qualified = 0;
           let toe_hole = 0;
           let broken_needle = 0;
           let missing_yarn = 0;
           let logo_issue = 0;
           let dirty = 0;
           let other = 0;
           let amounts = 0;
           obj_date_data.forEach(function(d){
               amounts +=(parseFloat(d['brokenNeedle'])+parseFloat(d['dirty'])+parseFloat(d['logoIssue'])+parseFloat(d['missingYarn'])+parseFloat(d['other'])+parseFloat(d['products'])+parseFloat(d['toeHole']))
               broken_needle+= parseFloat(d['brokenNeedle']);
               toe_hole += parseFloat(d['toeHole']);
               missing_yarn +=parseFloat(d['missingYarn'])
               logo_issue +=parseFloat(d['logoIssue'])
               dirty +=parseFloat(d['dirty'])
               other +=parseFloat(d['other'])
               qualified +=(parseFloat(d['products'])+parseFloat(d['dirty']))
               defects+=(parseFloat(d['brokenNeedle'])+parseFloat(d['logoIssue'])+parseFloat(d['missingYarn'])+parseFloat(d['other'])+parseFloat(d['toeHole']))
           })
           defects =
               content+=(
                   'Total Pairs: '+amounts+';'+'Qualified (pairs): '+qualified+'(Dirty: '+dirty+')'+'\n'+
                   'Defects(pairs): '+defects+' (Defective Rate:'+(parseFloat(defects)/parseFloat(amounts)*100).toFixed(2)+'%)'+'\n'+
                   'broken_needle:'+broken_needle+'\n'+
                   'missing_yarn:'+missing_yarn+'\n'+
                   'logo_issue:'+logo_issue+'\n'+
                   'toe_hole:'+toe_hole+'\n'+
                   'other:'+other+'\n'
               )
       }

   }
   return content
}