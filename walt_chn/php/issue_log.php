<?php

require('db_info.php'); //数据库连接信息请在这个文件里改

$start_date = $_POST['start_date'];
$start_time = $_POST['start_time'];
$start = $start_date.' '.$start_time;

$conn = sqlsrv_connect( $serverName, $connectionInfo);

if( $conn === false )
        {
            echo "Could not connect.\n";
            die( print_r( sqlsrv_errors(), true));
        }else{
           $a=array();


            // enquire machine stopCode
            $sql= " SELECT  [sender]
                         ,[receiver]
                         ,[details]
                         ,[dateRec]
                         ,[machCode]
                         ,[stopCode]
                         ,[FileName]
                     FROM [operator_log].[dbo].[log_table]
                     WHERE [dateRec]>'$start'
                     order by dateRec";

        	$result = sqlsrv_query($conn, $sql);
            while($row = sqlsrv_fetch_array($result)) {
                 $new['sender'] = iconv("GBK","UTF-8",$row['sender']); //中文转码
                 $new['receiver'] = iconv("GBK","UTF-8",$row['receiver']); //中文转码
                 $new['details'] = iconv("GBK","UTF-8",$row['details']); //中文转码
                 $new['machCode'] = iconv("GBK","UTF-8",$row['machCode']); //中文转码
                 $new['stopCode'] = iconv("GBK","UTF-8",$row['stopCode']); //中文转码
                 $new['FileName'] = iconv("GBK","UTF-8",$row['FileName']); //中文转码

                 if($row['dateRec']){
                    $new['dateRec'] = $row['dateRec']->format('yy-m-d H:i:s');
                 }else{
                    $new['dateRec'] = '';
                 }
                 array_push($a, $new);;
             }
            echo json_encode($a);
            exit;

}
?>