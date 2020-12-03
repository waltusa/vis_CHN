
<?php

$ns_name = $_POST['ns_name'];
$ns_knitted_time = $_POST['ns_knitted_time'];
$ns_machineId = $_POST['ns_machineId'];
$ns_Toe_hole = $_POST['ns_Toe_hole'];
$ns_Broken_needle = $_POST['ns_Broken_needle'];
$ns_Missing_yarn = $_POST['ns_Missing_yarn'];
$ns_log_issue = $_POST['ns_log_issue'];
$ns_dirty = $_POST['ns_dirty'];
$ns_other = $_POST['ns_other'];
$ns_product =  $_POST['ns_product'];
$ns_style = $_POST['ns_style'];
$ns_knitted_shift= $_POST['ns_knitted_shift'];
$current_day= $_POST['current_day'];

require('db_info.php'); //数据库连接信息请在这个文件里改

$conn = sqlsrv_connect( $serverName, $connectionInfo);
if( $conn === false ) {

     die( print_r( sqlsrv_errors(), true));
}
date_default_timezone_set('Asia/Shanghai');
$today = date('m/d/Y H:i:s', time());

$KnittedTime = str_replace('/', '-', $ns_knitted_time);

$sql = "INSERT INTO [dbo].[nonSkid]
                   ([name]
                   ,[styleCode]
                   ,[machineId]
                   ,[knitted]
                   ,[shift]
                   ,[toeHole]
                   ,[brokenNDL]
                   ,[missYarn]
                   ,[logoIssue]
                   ,[other]
                   ,[dirty]
                   ,[weights]
                   ,[dateRec])

             VALUES
                    (?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)";
$params = array($ns_name,$ns_style, $ns_machineId, $ns_knitted_time,$ns_knitted_shift,$ns_Toe_hole,$ns_Broken_needle,$ns_Missing_yarn,$ns_log_issue,$ns_other,$ns_dirty,$ns_product,$today);
$stmt = sqlsrv_query( $conn, $sql, $params);
if( $stmt === false ) {
     die( print_r( sqlsrv_errors(), true));
}

$a = array();

$sql2 = "SELECT [name]
                      ,[styleCode]
                      ,[machineId]
                      ,[knitted]
                      ,[shift]
                      ,[toeHole]
                      ,[brokenNDL]
                      ,[missYarn]
                      ,[logoIssue]
                      ,[other]
                      ,[dirty]
                      ,[weights]
                      ,[dateRec]
                  FROM [operator_log].[dbo].[nonSkid]
          where dateRec >='$current_day'
          order by dateRec Desc";

$result = sqlsrv_query($conn,$sql2);
while($row = sqlsrv_fetch_array($result)){
    $new['dateRec'] = $row['dateRec']->format('m-d H:i:s');;
    $new['name'] = $row['name'];
    $new['styleCode'] = $row['styleCode'];
    $new['machineId'] = $row['machineId'];
    $new['toeHole'] = $row['toeHole'];
    $new['brokenNDL'] = $row['brokenNDL'];
    $new['missYarn'] = $row['missYarn'];
    $new['logoIssue'] = $row['logoIssue'];
    $new['dirty'] = $row['dirty'];
    $new['other'] = $row['other'];
    $new['shift'] = $row['shift'];
    $new['weights'] = $row['weights'];
    if($row['knitted'] === NULL){
        continue;
     }
    $new['knitted'] = $row['knitted']->format('m-d');
    array_push($a, $new);;
}

    echo json_encode($a);

?>

