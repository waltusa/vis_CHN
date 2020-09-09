<?php
//Connecting to sql db.

require('db_info.php'); //数据库连接信息请在这个文件里改

// $serverName = "D25W0333\\SQLEXPRESS";
// $connectionInfo = array( "Database"=>"operator_log","UID"=>"Nautilus", "PWD"=>"MasterUser78");
$conn = sqlsrv_connect( $serverName, $connectionInfo);
if( $conn === false ) {
     die( print_r( sqlsrv_errors(), true));
}

date_default_timezone_set('Asia/Shanghai');  //设置时区
$today = date('m/d/Y H:i:s', time());
$sql = "INSERT INTO [operator_log].[dbo].[log_table] ([sender],[receiver],[machCode],[stopCode],[details],[dateRec],[FileName]) VALUES (?, ?, ?, ?, ?, ?,?)";

//中文转码
$sender=iconv("UTF-8","GBK",$_POST['post_Sender']);
$receiver=iconv("UTF-8","GBK",$_POST['post_Receiver']);
$machCode=iconv("UTF-8","GBK",$_POST['post_MachineId']);
$stopCode=iconv("UTF-8","GBK",$_POST['post_StopCode']);
$details=iconv("UTF-8","GBK",$_POST['post_details']);
$dateRec=$today;
$FileName=iconv("UTF-8","GBK",$_POST['post_FileName']);

$params = array($sender,$receiver, $machCode,$stopCode, $details,$dateRec,$FileName);

$stmt = sqlsrv_query( $conn, $sql, $params);
if( $stmt === false ) {
     die( print_r( sqlsrv_errors(), true));
}


?>