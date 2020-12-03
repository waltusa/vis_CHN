<?php

$start_date = $_POST['start_date'];
$start_time = $_POST['start_time'];
$end_date = $_POST['end_date'];
$end_time = $_POST['end_time'];

$start = $start_date.' '.$start_time;
$end = $end_date.' '.$end_time;

require('db_info.php'); //数据库连接信息请在这个文件里改




$conn_paring = sqlsrv_connect( $serverName, $connectionInfo_paring);


if( $conn_paring === false )
        {
            echo "Could not connect.\n";
            die( print_r( sqlsrv_errors(), true));
        }else{
        $a['paring']=array();
        $a['knit_date']=array();

        //enquire paring log-----paring date
          $sql= " SELECT [Name]
                        ,[KnittedTime]
                        ,[MachineId]
                        ,[DateRec]
                        ,[itemNum]
                        ,[toeHole]
                        ,[brokenNeedle]
                        ,[missingYarn]
                        ,[logoIssue]
                        ,[dirty]
                        ,[other]
                        ,[products]
                        ,[shift]
                    FROM [paring].[dbo].[paringQC]
                    where [DateRec]>='$start' and [DateRec]<='$end'
                    order by DateRec desc";

        	$result = sqlsrv_query($conn_paring, $sql);
            while($row = sqlsrv_fetch_array($result)) {
                 $new['Name'] = $row['Name'];
                 $new['MachineId'] = $row['MachineId'];
                 $new['DateRec'] = $row['DateRec']->format('yy-m-d H:i:s');
                 $new['itemNum'] = $row['itemNum'];
                 $new['toeHole'] = $row['toeHole'];
                 $new['brokenNeedle'] = $row['brokenNeedle'];
                 $new['missingYarn'] = $row['missingYarn'];
                 $new['logoIssue'] = $row['logoIssue'];
                 $new['dirty'] = $row['dirty'];
                 $new['other'] = $row['other'];
                 $new['products'] = $row['products'];
                 $new['shift'] = $row['shift'];
                 if($row['KnittedTime'] === NULL){
                    continue;
                 }
                 $new['KnittedTime'] = $row['KnittedTime']->format('yy-m-d');
                 array_push($a['paring'], $new);;
            }

         //enquire paring log-----knit day shift
          $sql3= " SELECT [Name]
                        ,[KnittedTime]
                        ,[MachineId]
                        ,[DateRec]
                        ,[itemNum]
                        ,[toeHole]
                        ,[brokenNeedle]
                        ,[missingYarn]
                        ,[logoIssue]
                        ,[dirty]
                        ,[other]
                        ,[products]
                        ,[shift]
                    FROM [paring].[dbo].[paringQC]
                    where [KnittedTime]>='$start_date' and [KnittedTime]<='$end_date'
                    order by DateRec";

        	$result3 = sqlsrv_query($conn_paring, $sql3);
            while($row = sqlsrv_fetch_array($result3)) {
                 $new3['Name'] = $row['Name'];
                 $new3['MachineId'] = $row['MachineId'];
                 $new3['DateRec'] = $row['DateRec']->format('yy-m-d H:i:s');
                 $new3['itemNum'] = $row['itemNum'];
                 $new3['toeHole'] = $row['toeHole'];
                 $new3['brokenNeedle'] = $row['brokenNeedle'];
                 $new3['missingYarn'] = $row['missingYarn'];
                 $new3['logoIssue'] = $row['logoIssue'];
                 $new3['dirty'] = $row['dirty'];
                 $new3['other'] = $row['other'];
                 $new3['products'] = $row['products'];
                 $new3['shift'] = $row['shift'];
                 if($row['KnittedTime'] === NULL){
                    continue;
                 }
                 $new3['KnittedTime'] = $row['KnittedTime']->format('yy-m-d');
                 array_push($a['knit_date'], $new3);;
            }


    echo json_encode($a);
 }
?>

