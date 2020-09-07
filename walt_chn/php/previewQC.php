<?php

require('db_info.php'); //数据库连接信息请在这个文件里改

$DateRec = $_POST['DateRec'];
$Name = $_POST['Name'];
$itemNum = $_POST['styleCode'];
$MachineId = $_POST['machineId'];
$FirstCheck = $_POST['FirstCheck'];
$SecondCheck = $_POST['SecondCheck'];
$ThirdCheck = $_POST['ThirdCheck'];
$Weight = $_POST['Weight'];
$KnittedTime = $_POST['KnittedTime'];

$conn = sqlsrv_connect( $serverName, $connectionInfo);
if( $conn === false ) {

     die( print_r( sqlsrv_errors(), true));
}
date_default_timezone_set('America/Denver');
$today = date('m/d/Y H:i:s', time());

$KnittedTime = str_replace('/', '-', $KnittedTime);

$sql = "INSERT INTO [dbo].[qc_weight]([DateRec],[Name],[itemNum],[MachineId],[FirstCheck],[SecondCheck],[ThirdCheck],[KnittedTime],[Weight]) VALUES (?, ?, ?, ?, ?, ?,?,?,?)";
$params = array($today,$Name, $itemNum, $MachineId, $FirstCheck,$SecondCheck,$ThirdCheck,$KnittedTime,$Weight);
$stmt = sqlsrv_query( $conn, $sql, $params);
if( $stmt === false ) {
     die( print_r( sqlsrv_errors(), true));
}

$a = array();

$sql2 = "SELECT [DateRec]
              ,[Name]
              ,[itemNum]
              ,[MachineId]
              ,[Weight]
              ,[FirstCheck]
              ,[SecondCheck]
              ,[ThirdCheck]
              ,[KnittedTime]
          FROM [non_skip].[dbo].[qc_weight]
          where DateRec >= '$DateRec'
          order by DateRec DESC";

$result = sqlsrv_query($conn,$sql2);
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
    array_push($a, $new);;
}

    echo json_encode($a);
?>