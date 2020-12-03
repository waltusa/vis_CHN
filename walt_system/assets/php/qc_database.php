<?php

$start_date = $_POST['start_date'];
$start_time = $_POST['start_time'];
$end_date = $_POST['end_date'];
$end_time = $_POST['end_time'];

require('db_info.php'); //数据库连接信息请在这个文件里改

$start = $start_date.' '.$start_time;
$end = $end_date.' '.$end_time;

$conn = sqlsrv_connect( $serverName, $connectionInfo);

if( $conn === false )
        {
            echo "Could not connect.\n";
            die( print_r( sqlsrv_errors(), true));
        }else{


           $a=array();

            // enquire machine stopCod
            $sql = "SELECT [DateRec]
                          ,[Name]
                          ,[itemNum]
                          ,[MachineId]
                          ,[Weight]
                          ,[FirstCheck]
                          ,[SecondCheck]
                          ,[ThirdCheck]
                          ,[KnittedTime]
                      FROM [non_skip].[dbo].[qc_weight]
                      where [DateRec]>='$start' and [DateRec]<='$end'
                      order by DateRec DESC";

            $result = sqlsrv_query($conn,$sql);
            while($row = sqlsrv_fetch_array($result)){
                $new['DateRec'] = $row['DateRec']->format('m-d H:i:s');;
                $new['Name'] = $row['Name'];
                $new['itemNum'] = $row['itemNum'];
                $new['MachineId'] = $row['MachineId'];
                $new['Weight'] = $row['Weight'];
                $new['FirstCheck'] = $row['FirstCheck'];
                $new['SecondCheck'] = $row['SecondCheck'];
                $new['ThirdCheck'] = $row['ThirdCheck'];
                if($row['KnittedTime'] === NULL){
                    continue;
                 }
                $new['KnittedTime'] = $row['KnittedTime']->format('m-d');
                array_push($a, $new);
                }

    echo json_encode($a);
 }
?>

