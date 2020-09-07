<?php
//Connecting to sql db.

require('db_info.php'); //数据库连接信息请在这个文件里改

$serverName = "D25W0333\\SQLEXPRESS";
$connectionInfo = array( "Database"=>"operator_log","UID"=>"Nautilus", "PWD"=>"MasterUser78");
$conn = sqlsrv_connect( $serverName, $connectionInfo);
if( $conn === false ) {
     die( print_r( sqlsrv_errors(), true));
}

date_default_timezone_set('America/Denver');
$today = date('m/d/Y H:i:s', time());
$sql = "INSERT INTO [operator_log].[dbo].[log_table] ([sender],[receiver],[machCode],[stopCode],[details],[dateRec],[FileName]) VALUES (?, ?, ?, ?, ?, ?,?)";
$params = array($_POST['post_Sender'],$_POST['post_Receiver'], $_POST['post_MachineId'], $_POST['post_StopCode'], $_POST['post_details'],$today,$_POST['post_FileName']);

$stmt = sqlsrv_query( $conn, $sql, $params);
if( $stmt === false ) {
     die( print_r( sqlsrv_errors(), true));
}


?>