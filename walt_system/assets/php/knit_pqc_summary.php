<?php

$start_date = $_POST['start_date'];
$start_time = $_POST['start_time'];

require('db_info.php'); //数据库连接信息请在这个文件里改
$start = $start_date.' '.$start_time;

$conn = sqlsrv_connect( $serverName, $connectionInfo);

if( $conn === false )
        {
            echo "Could not connect.\n";
            die( print_r( sqlsrv_errors(), true));
        }else{


           $a=array();

            $sql = "SELECT [DateRec]
                           ,[Name]
                           ,[MachineId]
                           ,[ItemStyle]
                           ,[Size]
                           ,[Knitted]
                           ,[Shift]
                           ,[toeHole]
                           ,[brokenNDL]
                           ,[missYarn]
                           ,[fanYarn]
                           ,[logoIssue]
                           ,[dirty]
                           ,[other]
                           ,[Comments]
                           ,[Color]
                           FROM [operator_log].[dbo].[knitCHN_pqc]
                      --where  DATEDIFF ( s, '$start',[DateRec])<=43200 and DATEDIFF ( s, '$start',[DateRec])>0 \n
                      where [Knitted] = '$start_date' AND [Shift] = '$start_time' 
                      order by DateRec Desc";

            $result = sqlsrv_query($conn,$sql);
            while($row = sqlsrv_fetch_array($result)){
                    $new['DateRec'] = $row['DateRec']->format('m-d H:i:s');;
                    $new['Name'] = iconv("GBK","UTF-8",$row['Name']); //中文转码
                    $new['MachineId'] = $row['MachineId'];
                    $new['toeHole'] = $row['toeHole'];
                    $new['brokenNDL'] = $row['brokenNDL'];
                    $new['missYarn'] = $row['missYarn'];
                    $new['fanYarn'] = $row['fanYarn'];
                    $new['logoIssue'] = $row['logoIssue'];
                    $new['dirty'] = $row['dirty'];
                    $new['other'] = $row['other'];
                    $new['ItemStyle'] = $row['ItemStyle'];
                    $new['Size'] = $row['Size'];
                    $new['Color'] = iconv("GBK","UTF-8",$row['Color']); //中文转码
                    $new['Comments'] = iconv("GBK","UTF-8",$row['Comments']); //中文转码
                    $new['Shift'] = $row['Shift'];
                    if($row['Knitted'] === NULL){
                        continue;
                    }
                    $new['Knitted'] = $row['Knitted']->format('m-d');
                    array_push($a, $new);
                    }

    echo json_encode($a);
 }
?>
