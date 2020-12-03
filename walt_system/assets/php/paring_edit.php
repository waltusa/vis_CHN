<?php

require('db_info.php'); //数据库连接信息请在这个文件里改

$conn = sqlsrv_connect( $serverName, $connectionInfo);
if( $conn === false ) {

     die( print_r( sqlsrv_errors(), true));
}

$sql = "with cte as(
        SELECT TOP (1) [Name]
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
                  order by DateRec Desc)
        delete from cte";
$stmt = sqlsrv_query( $conn, $sql);
if( $stmt === false ) {
     die( print_r( sqlsrv_errors(), true));
}
?>
