<?php
$Im_in_USA = false; //在美国调试时，将这个值改为true即可




$serverName = "D25W0333\\SQLEXPRESS";
$connectionInfo = array( "Database"=>"dbNautilus","UID"=>"Nautilus", "PWD"=>"MasterUser78");

if (!$Im_in_USA) {
    $serverName = "192.168.32.200";
    $connectionInfo = array( "Database"=>"dbNautilus","UID"=>"nmonitor", "PWD"=>"1");
}
?>