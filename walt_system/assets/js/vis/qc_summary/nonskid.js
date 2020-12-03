






//paring data summary
function nonSkid_qc(){
    let ns_name = $("#ns_name option:selected").text();
    let ns_knitted_time = $('#ns_time').val();
    let ns_knitted_shift = $('#ns_time_shift').val();
    let ns_machineId = $('#ns_machineId').val();
    let ns_Toe_hole = $('#ns_Toe_hole').val() ? $('#ns_Toe_hole').val():0
    let ns_Broken_needle = $('#ns_broken_needle').val()? $('#ns_broken_needle').val():0
    let ns_Missing_yarn = $('#ns_missing_yarn').val()? $('#ns_missing_yarn').val():0
    let ns_log_issue = $('#ns_logo_issue').val()? $('#ns_logo_issue').val():0
    let ns_dirty = $('#ns_dirty').val()? $('#ns_dirty').val():0
    let ns_other = $('#ns_other').val()? $('#ns_other').val():0
    let ns_product = $('#ns_product').val()? $('#ns_product').val():0
    let ns_style = $('#ns_style').val();
    let current_day = getCurrDate();

    let info_text = "You are going to submit:"+'\n'+
        'Name: '+ns_name +'\n'+
        'Style Code: '+ns_style+'\n'+
        'Machine ID: '+ ns_machineId+'\n'+
        'Knitted Date: '+ns_knitted_time+'\n'+
        'Knitted Shift: '+ns_knitted_shift+'\n'+
        'Toe Hole: ' + ns_Toe_hole+'\n'+
        'Broken_needle: ' + ns_Broken_needle+'\n'+
        'Missing_yarn: ' + ns_Missing_yarn+'\n'+
        'Logo_Issue: ' + ns_log_issue+'\n'+
        'other: ' + ns_other+'\n'+
        'dirty: ' + ns_dirty+'\n'+
        'Weights(kg): ' + ns_product+'\n';
    let r = confirm(info_text);
    if(r){
        $.ajax({
            url: '../assets/php/nonSkid_qc.php',
            type: 'POST',
            data:{ns_name:ns_name,ns_knitted_time:ns_knitted_time,ns_machineId:ns_machineId,ns_Toe_hole:ns_Toe_hole,
                ns_Broken_needle:ns_Broken_needle,ns_Missing_yarn:ns_Missing_yarn,ns_log_issue:ns_log_issue,ns_dirty:ns_dirty,ns_other:ns_other,ns_product:ns_product,ns_style:ns_style,ns_knitted_shift:ns_knitted_shift,current_day:current_day},
            success: function(data){
                let new_data = JSON.parse(data);
                //add record
               let content_html = "";
                for(let i =0; i <new_data.length;i++){
                    let tag = parseInt(i)+parseInt(1)
                    let content ='<tr><td>'+tag+'</td><td>'+new_data[i]['dateRec']+'</td><td>'+new_data[i]['name']+'</td><td>'+new_data[i]['styleCode']+'</td><td>' +new_data[i]['machineId'] + '</td><td>' + new_data[i]['knitted']+'</td><td>'+ new_data[i]['shift']+'</td><td>'+ new_data[i]['toeHole']+'</td><td>'+ new_data[i]['brokenNDL']+'</td><td>'+ new_data[i]['missYarn']+'</td><td>'+new_data[i]['logoIssue']+'</td><td>'+new_data[i]['dirty']+'</td><td>'+new_data[i]['other']+'</td><td>'+new_data[i]['weights']+'</td><td>';
                    content_html += content + '\n';
                }
                document.getElementById("nonSkid_table_database_body").innerHTML =content_html;
            },
            error: function(){
                alert('Error loading XML document');
            }
        });


        //reset
        $('#ns_machineId').val("");
        $('#ns_style').val("");
        $('#ns_product').val("");
        $('#ns_Toe_hole').val("");
        $('#ns_broken_needle').val("");
        $('#ns_missing_yarn').val("");
        $('#ns_logo_issue').val("");
        $('#ns_other').val("");
        $('#ns_dirty').val("");
    }

}



//nonSkid params reset
function nonSkid_reset(){
    var r = confirm("Warning! It's reset button not submit, still want to clear current records?");
    if(r){
        $('#ns_machineId').val("");
        $('#ns_style').val("");
        $('#ns_product').val("");
        $('#ns_Toe_hole').val("");
        $('#ns_broken_needle').val("");
        $('#ns_missing_yarn').val("");
        $('#ns_logo_issue').val("");
        $('#ns_other').val("");
        $('#ns_dirty').val("");
    }

}


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


