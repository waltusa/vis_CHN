<?php error_reporting(0); ?>
<?php
$start_date = $_POST['start_date'];
$start_time = $_POST['start_time'];
$machine_start = $_POST['machine_start'];
$machine_end = $_POST['machine_end'];

require('db_info.php'); //数据库连接信息请在这个文件里改

$start = $start_date.' '.$start_time;
$conn = sqlsrv_connect( $serverName, $connectionInfo);
$conn_knit = sqlsrv_connect( $serverName, $connectionInfo_knit);

if( $conn === false || $conn_knit === false)
        {
            echo "Could not connect.\n";
            die( print_r( sqlsrv_errors(), true));
        }else{
           $a['error']=array();
           $a['machine']=array();
           $a['product'] = array();
           $a['defects'] = array();

           //enquire real time defects
            $sql4 = "SELECT [DateRec]
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
                      where  DATEDIFF ( hh, '$start',[DateRec])<12 and DATEDIFF ( hh, '$start',[DateRec])>=0 and [MachineId]>='$machine_start' and [MachineId]<='$machine_end'
                      order by DateRec Desc";

            $result4 = sqlsrv_query($conn_knit,$sql4);
            while($row4 = sqlsrv_fetch_array($result4)){
                $new4['DateRec'] = $row4['DateRec']->format('m-d H:i:s');;
                $new4['Name'] = iconv("GBK","UTF-8",$row4['Name']); //中文转码
                $new4['MachineId'] = $row4['MachineId'];
                $new4['toeHole'] = $row4['toeHole'];
                $new4['brokenNDL'] = $row4['brokenNDL'];
                $new4['missYarn'] = $row4['missYarn'];
                $new4['fanYarn'] = $row4['fanYarn'];
                $new4['logoIssue'] = $row4['logoIssue'];
                $new4['dirty'] = $row4['dirty'];
                $new4['other'] = $row4['other'];
                $new4['ItemStyle'] = $row4['ItemStyle'];
                $new4['Size'] = $row4['Size'];
                $new4['Color'] = iconv("GBK","UTF-8",$row4['Color']); //中文转码
                $new4['Comments'] = iconv("GBK","UTF-8",$row4['Comments']); //中文转码
                $new4['Shift'] = $row4['Shift'];
                    if($row4['Knitted'] === NULL){
                        continue;
                    }
                    $new4['Knitted'] = $row4['Knitted']->format('m-d');
                    array_push($a['defects'], $new4);
                        array_push($a['defects'], $new4);
                    }


            // enquire machine stopCode
          $sql= " SELECT  [STOPS_MONITOR].[StopCode]
                         ,[description]
                         ,[DateRec]
                         ,[MachCode]
                         ,[LastStopCode]
                         ,[DateEndStop]
                         ,[StyleCode]
                     FROM [dbNautilus].[dbo].[STOPS_MONITOR]
                     JOIN [dbNautilus].[dbo].[STOPS] on [STOPS_MONITOR].StopCode = [dbNautilus].[dbo].[STOPS].StopCode
                     WHERE [STOPS_MONITOR].[StopCode] <> 0 and [DateRec]>'$start' and [MachCode]>='$machine_start' and [MachCode]<='$machine_end'
                     order by [STOPS_MONITOR].DateRec";

        	$result = sqlsrv_query($conn, $sql);
            while($row = sqlsrv_fetch_array($result)) {
                 $new['StopCode'] = $row['StopCode'];
                 $new['description'] = iconv("GBK","UTF-8",$row['description']); //中文转码
                 $new['DateRec'] = $row['DateRec']->format('yy-m-d H:i:s');
                 $new['MachCode'] = $row['MachCode'];
                 $new['LastStopCode'] = $row['LastStopCode'];
                 $new['StyleCode'] = $row['StyleCode'];
                 if($row['DateEndStop']){
                    $new['DateEndStop'] = $row['DateEndStop']->format('yy-m-d H:i:s');
                 }else{
                    $new['DateEndStop'] = '';
                 }
                 array_push($a['error'], $new);;
            }

            // enquire current machine status
          $sql2= " SELECT
                        [MachCode]
                         ,[State]
                         ,[TimeOn]
                         ,[TimeOff]
                         ,[LastTimeOn]
                         ,[LastTimeOff]
                         ,[Pieces]
                         ,[LastCycle]
                         ,[LastStopCode]
                         ,[Step]
                         ,[WorkEfficiency]
                         ,[TimeEfficiency]
                         ,[StyleCode]
                         ,[ShiftPieces]
                     FROM [dbNautilus].[dbo].[MACHINES]
                     where [MachCode]>='$machine_start' and [MachCode]<='$machine_end' ORDER BY [MachCode]";

        	$result2 = sqlsrv_query($conn, $sql2);
            while($row = sqlsrv_fetch_array($result2)) {
                 $new2['MachCode'] = $row['MachCode'];
                 $new2['State'] = $row['State'];
                 $new2['TimeOn'] = $row['TimeOn'];
                 $new2['TimeOff'] = $row['TimeOff'];
                 $new2['LastTimeOn'] = $row['LastTimeOn'];
                 $new2['LastTimeOff'] = $row['LastTimeOff'];
                 $new2['Pieces'] = $row['Pieces'];
                 $new2['LastCycle'] = $row['LastCycle'];
                 $new2['LastStopCode'] = $row['LastStopCode'];
                 $new2['Step'] = $row['Step'];
                 $new2['WorkEfficiency'] = $row['WorkEfficiency'];
                 $new2['TimeEfficiency'] = $row['TimeEfficiency'];
                 $new2['ShiftPieces'] = $row['ShiftPieces'];
                 $new2['StyleCode'] = $row['StyleCode'];

                 array_push($a['machine'], $new2);;
            }

            //enquire production details
          $sql3= " SELECT [DateRec]
                         ,[MachCode]
                         ,[StyleCode]
                         ,[TimeOn]
                         ,[TimeOff]
                         ,[Pieces]
                         ,[Cycle]
                         ,[DateStartShift]
                     FROM [dbNautilus].[dbo].[PRODUCTIONS_MONITOR]
                     WHERE [DateRec] >'$start' and [MachCode]>='$machine_start' and [MachCode]<='$machine_end'
                     order by DateRec";

        	$result3 = sqlsrv_query($conn, $sql3);
            while($row2 = sqlsrv_fetch_array($result3)) {
                     $new3['DateRec'] = $row2['DateRec']->format('yy-m-d H:i:s');
                     $new3['MachCode'] = $row2['MachCode'];
                     $new3['StyleCode'] = $row2['StyleCode'];
                     $new3['TimeOn'] = $row2['TimeOn'];
                     $new3['TimeOff'] = $row2['TimeOff'];
                     $new3['Pieces'] = $row2['Pieces'];
                     $new3['Cycle'] = $row2['Cycle'];
                     $new3['DateStartShift'] = $row2['DateStartShift']->format('yy-m-d H:i:s');
                     array_push($a['product'], $new3);
            }

            echo json_encode($a);
            exit;

        }
?>
