function create_log_table(data){
    let new_data = JSON.parse(data);

    $("#log_table_body").empty();
    let content_html = '';
    for(let i = 0;i<new_data.length;i++){
        let date = new_data[i]['dateRec'].slice(10, new_data[i]['dateRec'].length)
        let content ='<tr><td>'+date+'</td><td>' + new_data[i]['sender'] + '</td><td>' + new_data[i]['receiver'] + '</td><td>' + new_data[i]['machCode'] + '</td><td>'+ new_data[i]['stopCode']+'</td></tr>';
        content_html += content + '\n';
    }
    document.getElementById("log_table_body").innerHTML =content_html;

    var table = document.getElementById('log_table');
    var cells = table.getElementsByTagName('td');
    for (let i = 0; i < cells.length; i++) {
        // Take each cell
        var cell = cells[i];
        // do something on onclick event for cell
        cell.onclick = function () {
            // Get the row id where the cell exists
            var rowId = this.parentNode.rowIndex;
            let text = new_data[rowId-1]['details']
            document.getElementById('details').innerText = text;
            let pic_name = 'upload/'+new_data[rowId-1]['FileName']
            if(new_data[rowId-1]['FileName']){
                document.getElementById("pic").src = pic_name;
            }else{
                $("#pic_div").empty();
            }

        }
    }
}