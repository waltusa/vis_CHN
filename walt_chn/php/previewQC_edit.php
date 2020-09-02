<?php

$serverName = "D25W0333\\SQLEXPRESS";
$connectionInfo = array( "Database"=>"non_skip","UID"=>"Nautilus", "PWD"=>"MasterUser78");

$conn = sqlsrv_connect( $serverName, $connectionInfo);
if( $conn === false ) {

     die( print_r( sqlsrv_errors(), true));
}

$sql = "with cte as(
        SELECT TOP (1) [DateRec]
              ,[Name]
              ,[itemNum]
              ,[MachineId]
              ,[Weight]
              ,[FirstCheck]
              ,[SecondCheck]
              ,[ThirdCheck]
              ,[KnittedTime]
          FROM [non_skip].[dbo].[qc_weight]
          order by [DateRec] desc)
        delete from cte";
$stmt = sqlsrv_query( $conn, $sql);
if( $stmt === false ) {
     die( print_r( sqlsrv_errors(), true));
}

  ?>