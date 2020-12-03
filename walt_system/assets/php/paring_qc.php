<?php

$p_name = $_POST['p_name'];
$p_knitted_name = $_POST['p_knitted_name'];
$p_machineId = $_POST['p_machineId'];
$Toe_hole = $_POST['Toe_hole'];
$Broken_needle = $_POST['Broken_needle'];
$Missing_yarn = $_POST['Missing_yarn'];
$log_issue = $_POST['log_issue'];
$dirty = $_POST['dirty'];
$other = $_POST['other'];
$product =  $_POST['product'];
$p_item_number = $_POST['p_item_number'];
$p_shift= $_POST['p_shift'];
$current_date= $_POST['current_date'];

require('db_info.php'); //数据库连接信息请在这个文件里改

$conn = sqlsrv_connect( $serverName, $connectionInfo);
if( $conn === false ) {

     die( print_r( sqlsrv_errors(), true));
}
date_default_timezone_set('Asia/Shanghai');
$today = date('m/d/Y H:i:s', time());

$KnittedTime = str_replace('/', '-', $p_knitted_name);

$sql = "INSERT INTO [dbo].[paringQC]
                  ([Name]
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
                  ,[shift])

             VALUES
                    (?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)";
$params = array($p_name,$KnittedTime, $p_machineId, $today,$p_item_number,$Toe_hole,$Broken_needle,$Missing_yarn,$log_issue,$dirty,$other,$product,$p_shift);
$stmt = sqlsrv_query( $conn, $sql, $params);
if( $stmt === false ) {
     die( print_r( sqlsrv_errors(), true));
}

$a = array();

$sql2 = "SELECT [Name]
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
          where DateRec >='$current_date'
          order by DateRec Desc";

$result = sqlsrv_query($conn,$sql2);
while($row = sqlsrv_fetch_array($result)){
    $new['DateRec'] = $row['DateRec']->format('m-d H:i:s');;
    $new['Name'] = $row['Name'];
    $new['itemNum'] = $row['itemNum'];
    $new['MachineId'] = $row['MachineId'];
    $new['toeHole'] = $row['toeHole'];
    $new['brokenNeedle'] = $row['brokenNeedle'];
    $new['missingYarn'] = $row['missingYarn'];
    $new['logoIssue'] = $row['logoIssue'];
    $new['dirty'] = $row['dirty'];
    $new['other'] = $row['other'];
    $new['shift'] = $row['shift'];
    $new['products'] = $row['products'];
    if($row['KnittedTime'] === NULL){
        continue;
     }
    $new['KnittedTime'] = $row['KnittedTime']->format('m-d');
    array_push($a, $new);;
}

    echo json_encode($a);

?>

