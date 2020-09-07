<?php

require('db_info.php'); //数据库连接信息请在这个文件里改

// $start_date = "2020-09-01";
// $start_time = "8:00";
// $end_date = "2020-09-02";
// $end_time = "8:00";
// $machine_start= 1;
// $machine_end= 40;

$start_date = $_POST['start_date'];
$start_time = $_POST['start_time'];
$end_date = $_POST['end_date'];
$end_time = $_POST['end_time'];
$machine_start= $_POST['machine_start'];
$machine_end= $_POST['machine_end'];

$start = $start_date.' '.$start_time;
$end = $end_date.' '.$end_time;

$conn = sqlsrv_connect( $serverName, $connectionInfo);
if( $conn === false )
        {
            echo "Could not connect.\n";
            die( print_r( sqlsrv_errors(), true));
        }else{


           $a['error']=array();
           $a['product']=array();

            // enquire machine stopCode
          $sql= " SELECT  [STOPS_MONITOR].[StopCode]
                         ,[description]
                         ,[DateRec]
                         ,[MachCode]
                         ,[LastStopCode]
                         ,[DateEndStop]
                     FROM [dbNautilus].[dbo].[STOPS_MONITOR]
                     JOIN [dbNautilus].[dbo].[STOPS] on [STOPS_MONITOR].StopCode = [dbNautilus].[dbo].[STOPS].StopCode
                     WHERE [STOPS_MONITOR].[StopCode] <> 0 and [DateRec]>'$start' and [DateRec]<='$end' and [MachCode]>='$machine_start' and [MachCode]<='$machine_end'
                     order by [STOPS_MONITOR].DateRec";

        	$result = sqlsrv_query($conn, $sql);
            while($row = sqlsrv_fetch_array($result)) {
                 $new['StopCode'] = $row['StopCode'];
                 $new['description'] = iconv("GBK","UTF-8",$row['description']); //中文转码
                 $new['DateRec'] = $row['DateRec']->format('yy-m-d H:i:s');
                 $new['MachCode'] = $row['MachCode'];
                 $new['LastStopCode'] = $row['LastStopCode'];
                 if($row['DateEndStop'] === NULL){
                    continue;
                 }
                 $new['DateEndStop'] = $row['DateEndStop']->format('yy-m-d H:i:s');
                 array_push($a['error'], $new);;
            }

            //enquire machine production
            $sql2= " SELECT  [DateRec]
                           ,[MachCode]
                           ,[StyleCode]
                           ,[TimeOn]
                           ,[TimeOff]
                           ,[Pieces]
                           ,[Cycle]
                           ,[DateStartShift]
                    FROM [dbNautilus].[dbo].[PRODUCTIONS_MONITOR]
                    WHERE [DateRec] >'$start' and [DateRec]<='$end' and [MachCode]>='$machine_start' and [MachCode]<='$machine_end'
                    order by DateRec";

            $result2 = sqlsrv_query($conn, $sql2);
            while($row2 = sqlsrv_fetch_array($result2)) {
                     $new2['DateRec'] = $row2['DateRec']->format('yy-m-d H:i:s');
                     $new2['MachCode'] = $row2['MachCode'];
                     $new2['StyleCode'] = $row2['StyleCode'];
                     $new2['TimeOn'] = $row2['TimeOn'];
                     $new2['TimeOff'] = $row2['TimeOff'];
                     $new2['Pieces'] = $row2['Pieces'];
                     $new2['Cycle'] = $row2['Cycle'];
                     $new2['DateStartShift'] = $row2['DateStartShift']->format('yy-m-d H:i:s');
                     array_push($a['product'], $new2);
             }
            echo json_encode($a);
        }
?>