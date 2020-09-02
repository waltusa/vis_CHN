<?php
$start_date = $_POST['start_date'];
$start_time = $_POST['start_time'];
$machine_start = $_POST['machine_start'];
$machine_end = $_POST['machine_end'];

$serverName = "D25W0333\\SQLEXPRESS";
$connectionInfo = array( "Database"=>"dbNautilus","UID"=>"Nautilus", "PWD"=>"MasterUser78");
$start = $start_date.' '.$start_time;
$conn = sqlsrv_connect( $serverName, $connectionInfo);
if( $conn === false )
        {
            echo "Could not connect.\n";
            die( print_r( sqlsrv_errors(), true));
        }else{
           $a['error']=array();
           $a['machine']=array();
           $a['product'] = array();

            // enquire machine stopCode
          $sql= " SELECT  [STOPS_MONITOR].[StopCode]
                         ,[description]
                         ,[DateRec]
                         ,[MachCode]
                         ,[LastStopCode]
                         ,[DateEndStop]
                     FROM [dbNautilus].[dbo].[STOPS_MONITOR]
                     JOIN [dbNautilus].[dbo].[STOPS] on [STOPS_MONITOR].StopCode = [dbNautilus].[dbo].[STOPS].StopCode
                     WHERE [STOPS_MONITOR].[StopCode] <> 0 and [DateRec]>'$start' and [MachCode]>='$machine_start' and [MachCode]<='$machine_end'
                     order by [STOPS_MONITOR].DateRec";

        	$result = sqlsrv_query($conn, $sql);
            while($row = sqlsrv_fetch_array($result)) {
                 $new['StopCode'] = $row['StopCode'];
                 $new['description'] = $row['description'];
                 $new['DateRec'] = $row['DateRec']->format('yy-m-d H:i:s');
                 $new['MachCode'] = $row['MachCode'];
                 $new['LastStopCode'] = $row['LastStopCode'];
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
                     where [MachCode]>='$machine_start' and [MachCode]<='$machine_end'";

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