<?php

$k_name = iconv("utf-8", "gbk",$_POST['k_name']);
$knitted_time = $_POST['knitted_time'];
$k_machineId = $_POST['k_machineId'];
$k_Toe_hole = $_POST['k_Toe_hole'];
$k_Broken_needle = $_POST['k_Broken_needle'];
$k_Missing_yarn = $_POST['k_Missing_yarn'];
$k_fan_yarn = $_POST['k_fan_yarn'];
$k_log_issue = $_POST['k_log_issue'];
$k_dirty = $_POST['k_dirty'];
$k_other = $_POST['k_other'];
$k_knitted_shift= $_POST['k_knitted_shift'];
$current_day= $_POST['current_day'];
$k_style = $_POST['k_style'];
$k_color = iconv("utf-8", "gbk",$_POST['k_color']);
$k_size = $_POST['k_size'];
$k_marks = iconv("utf-8", "gbk",$_POST['k_marks']);
$picture1 = $_POST['picture1'];
$defects_picture_name = $_POST['defects_picture_name'];


require('db_info.php'); //数据库连接信息请在这个文件里改

////转化图片
$base_img = str_replace('data:image/jpeg;base64,', '', $picture1);
$path = "../../defect_pictures/";
$output_file = $defects_picture_name."".rand(100,999).'.jpg';
$path = $path.$output_file;
file_put_contents($path, base64_decode($base_img));

$conn = sqlsrv_connect( $serverName, $connectionInfo_knit);
if( $conn === false ) {

     die( print_r( sqlsrv_errors(), true));
}
date_default_timezone_set('Asia/Shanghai');
$today = date('m/d/Y H:i:s', time());

$KnittedTime = str_replace('/', '-', $knitted_time);

$sql = "INSERT INTO [dbo].[knitCHN_pqc]
                                ([DateRec]
                                ,[Name]
                                ,[MachineId]
                                ,[ItemStyle]
                                ,[Size]
                                ,[Color]
                                ,[Knitted]
                                ,[Shift]
                                ,[toeHole]
                                ,[brokenNDL]
                                ,[missYarn]
                                ,[fanYarn]
                                ,[logoIssue]
                                ,[dirty]
                                ,[other]
                                ,[Comments])
             VALUES
             (?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?)";

$params = array($today, $k_name, $k_machineId,$k_style,$k_size,$k_color,$knitted_time,$k_knitted_shift,$k_Toe_hole,$k_Broken_needle,$k_Missing_yarn,$k_fan_yarn,$k_log_issue,$k_dirty,$k_other,$path);
$stmt = sqlsrv_query( $conn, $sql, $params);
if( $stmt === false ) {
echo $sql;
echo $params;
    die( print_r( sqlsrv_errors(), true));
}

$a = array();

$sql2 = "SELECT [DateRec]
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
          where DateRec >='$current_day'
          order by DateRec Desc";

$result = sqlsrv_query($conn,$sql2);
while($row = sqlsrv_fetch_array($result)){
    $new['DateRec'] = $row['DateRec']->format('m-d H:i:s');
    $new['Name'] = iconv( "gbk","utf-8",$row['Name']); //中文转码
    $new['MachineId'] = $row['MachineId'];
    $new['toeHole'] = $row['toeHole'];
    $new['brokenNDL'] = $row['brokenNDL'];
    $new['missYarn'] = $row['missYarn'];
    $new['fanYarn'] = $row['fanYarn'];
    $new['logoIssue'] = $row['logoIssue'];
    $new['dirty'] = $row['dirty'];
    $new['other'] = $row['other'];
    $new['ItemStyle'] = $row['ItemStyle'];
    $new['Size'] = $row['Size'];
    $new['Color'] = iconv( "gbk","utf-8",$row['Color']); //中文转码
    $new['Comments'] = iconv( "gbk","utf-8",$row['Comments']); //中文转码
    $new['Shift'] = $row['Shift'];
    if($row['Knitted'] === NULL){
        continue;
     }
    $new['Knitted'] = $row['Knitted']->format('m-d');
    array_push($a, $new);
}

    echo json_encode($a);

?>
