<?php
$start_date = $_POST['start_date'];
$start_time = $_POST['start_time'];
$serverName = "D25W0333\\SQLEXPRESS";
$connectionInfo = array( "Database"=>"operator_log","UID"=>"Nautilus", "PWD"=>"MasterUser78");

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
                 $new['sender'] = $row['sender'];
                 $new['receiver'] = $row['receiver'];
                 $new['details'] = $row['details'];
                 $new['machCode'] = $row['machCode'];
                 $new['stopCode'] = $row['stopCode'];
                 $new['FileName'] = $row['FileName'];

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