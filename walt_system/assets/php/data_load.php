<?php error_reporting(0); ?>
<?php
$start_date = $_POST['start_date'];
$start_time = $_POST['start_time'];
$start_machine = $_POST['start_machine'];
$end_machine = $_POST['end_machine'];



// $serverName = "D25W0333\\SQLEXPRESS";
// $connectionInfo = array( "Database"=>"dbNautilus","UID"=>"Nautilus", "PWD"=>"MasterUser78");
// $connectionInfo_paring = array( "Database"=>"paring","UID"=>"Nautilus", "PWD"=>"MasterUser78");
// $connectionInfo_log = array( "Database"=>"operator_log","UID"=>"Nautilus", "PWD"=>"MasterUser78");


require('db_info.php'); //数据库连接信息请在这个文件里改

$start = $start_date.' '.$start_time;

$conn = sqlsrv_connect( $serverName, $connectionInfo);
$conn_paring = sqlsrv_connect( $serverName, $connectionInfo_paring);
$conn_log = sqlsrv_connect( $serverName, $connectionInfo_log);

if( $conn === false || $conn_paring === false || $conn_log===false)
        {
            echo "Could not connect.\n";
            die( print_r( sqlsrv_errors(), true));
        }else{

           $a['error']=array();
           $a['product']=array();
           $a['knit_pqc'] = array();
           $a['paring'] = array();

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
                     WHERE [STOPS_MONITOR].[StopCode] <> 0 and DATEDIFF ( hh, '$start',[DateRec])<=11 and DATEDIFF ( hh, '$start',[DateRec])>-1  and [MachCode]>='$start_machine' and [MachCode]<='$end_machine'
                     order by [STOPS_MONITOR].DateRec";

        	$result = sqlsrv_query($conn, $sql);
            while($row = sqlsrv_fetch_array($result)) {
                 $new['StopCode'] = $row['StopCode'];
                 $new['description'] = iconv("GBK","UTF-8",$row['description']); //中文转码
                 $new['DateRec'] = $row['DateRec']->format('yy-m-d H:i:s');
                 $new['MachCode'] = $row['MachCode'];
                 $new['LastStopCode'] = $row['LastStopCode'];
                 $new['StyleCode'] = $row['StyleCode'];
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
                    where  DATEDIFF ( s, '$start',[DateRec])<=43200 and DATEDIFF ( s, '$start',[DateRec])>0 and [StyleCode]<>'PCAGHI        01        ' and [MachCode]>='$start_machine' and [MachCode]<='$end_machine'
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

        //enquire paring log
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
                    where [KnittedTime]='$start_date' and [shift]='$start_time' and SUBSTRING( [MachineId],3,len([MachineId]))>='$start_machine' and SUBSTRING( [MachineId],3,len([MachineId]))<='$end_machine'
                    order by DateRec";

        	$result3 = sqlsrv_query($conn_paring, $sql3);
            while($row = sqlsrv_fetch_array($result3)) {
                 $new3['Name'] = iconv("GBK","UTF-8",$row['Name']); //中文转码
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
                 array_push($a['paring'], $new3);
            }


        //enquire knit_pqc log
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
                     where  DATEDIFF ( s, '$start',[DateRec])<=43200 and DATEDIFF ( s, '$start',[DateRec])>0 and [MachineId]>= CONVERT(int, '$start_machine') and [MachineId]<=CONVERT(int, '$end_machine')
                     order by DateRec Desc";

            $result4 = sqlsrv_query($conn_log,$sql4);
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
                    array_push($a['knit_pqc'], $new4);
                    }

            echo json_encode($a);
        }
?>
