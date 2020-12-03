<?php
$Im_in_USA = false; //在美国调试时，将这个值改为true即可



//$serverName = "D25W0333\\SQLEXPRESS";
//$connectionInfo = array( "Database"=>"dbNautilus","UID"=>"Nautilus", "PWD"=>"MasterUser78");
//$connectionInfo_paring = array( "Database"=>"paring","UID"=>"Nautilus", "PWD"=>"MasterUser78");
//$connectionInfo_log = array( "Database"=>"operator_log","UID"=>"Nautilus", "PWD"=>"MasterUser78");
//$connectionInfo_knit = array( "Database"=>"operator_log","UID"=>"Nautilus", "PWD"=>"MasterUser78");

$serverName = "113.31.103.248,11432";
$connectionInfo = array( "Database"=>"dbNautilus","UID"=>"nmonitor", "PWD"=>"1");
$connectionInfo_paring = array( "Database"=>"paring","UID"=>"nmonitor", "PWD"=>"1");
$connectionInfo_log = array( "Database"=>"operator_log","UID"=>"nmonitor", "PWD"=>"1");
$connectionInfo_knit = array( "Database"=>"operator_log","UID"=>"nmonitor", "PWD"=>"1");


if (!$Im_in_USA) {
    $serverName = "192.168.32.200";
}
?>