<?php
$start_date = $_POST['start_date'];
$start_time = $_POST['start_time'];
$machine = $_POST['machine'];
$defects_nums = $_POST['defects_nums'];
$defect_reasons = $_POST['defect_reasons'];
$textarea = $_POST['textarea'];


require('db_info.php'); //数据库连接信息请在这个文件里改

$start = $start_date.' '.$start_time;
$conn = sqlsrv_connect( $serverName, $connectionInfo);
if( $conn === false ) {
     die( print_r( sqlsrv_errors(), true));
}

date_default_timezone_set('Asia/Shanghai');
$today = date('m/d/Y H:i:s', time());

if($machine && $defects_nums && $defect_reasons){
$sql = "INSERT INTO [dbo].[kr_qc]
                  ([DateRec]
                  ,[MachId]
                  ,[Defect_nums]
                  ,[Defect_reason]
                  ,[Information])
            VALUES (?, ?, ?, ?,?)";
$params = array($today,$machine, $defects_nums, $defect_reasons,$textarea);
}


$stmt = sqlsrv_query( $conn, $sql, $params);
if( $stmt === false ) {
     die( print_r( sqlsrv_errors(), true));
}


           $a=array();

            // enquire machine stopCod
            $sql2 =   "select [MachId],count(*)Num from [operator_log].[dbo].[kr_qc]
                      where DateRec >'$start' and MachId IS NOT NULL
                      group by [MachId]";

            $result = sqlsrv_query($conn,$sql2);
            while($row = sqlsrv_fetch_array($result)){
                $new['MachId'] = $row['MachId'];
                $new['Num'] = $row['Num'];
                array_push($a, $new);
                }

    echo json_encode($a);


?>
