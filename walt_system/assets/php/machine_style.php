<?php error_reporting(0); ?>
<?php


require('db_info.php'); //数据库连接信息请在这个文件里改

$conn = sqlsrv_connect($serverName, $connectionInfo_log);

if ($conn === false) {
    echo "Could not connect.\n";
    die(print_r(sqlsrv_errors(), true));
} else {
    $a = array();
    $sql = "SELECT CONVERT(int, b.FNote) AS machine, c.FShortName as style, CASE charindex(' ',d.FName) WHEN 0 THEN d.FName ELSE SUBSTRING(d.FName, 1, charindex(' ',d.FName)-1) END AS color, c.FSize as size
            FROM [MES].[HUAER_SFP].[DBO].[ODK_DISPATCH] a 
                LEFT JOIN [MES].[HUAER_SFP].[DBO].[ODK_EQUIPMENT] b ON a.FMachineID = b.FItemID 
                LEFT JOIN [MES].[HUAER_SFP].[DBO].[ODK_MATERIAL] c ON a.FItemID = c.FItemID
                LEFT JOIN [MES].[HUAER_SFP].[DBO].[ODK_SUBMESSAGE] d ON c.FColorID = d.FItemID
            WHERE FDate = ?
            ORDER BY machine";
    // $sql = "SELECT  [machine]
    //                      ,[sku]
    //                      ,[style]
    //                      ,[color]
    //                      ,[size]
    //                  FROM [operator_log].[dbo].[machine_info]";
    date_default_timezone_set('Asia/Shanghai');
    $today = time();
    if (date('H') < 8) {
        $today = $today - 8*60*60;
    }
    $paras = array(date('Y/m/d', $today));
    
    $result = sqlsrv_query($conn, $sql, $paras);
    while ($row = sqlsrv_fetch_array($result)) {
        $new['machine'] = iconv("gbk", "utf-8", $row['machine']); //中文转码
        $new['style'] = iconv("gbk", "utf-8", $row['style']); //中文转码
        $new['color'] = iconv("gbk", "utf-8", $row['color']); //中文转码
        $new['size'] = iconv("gbk", "utf-8", $row['size']); //中文转码
        array_push($a, $new);
    }
    echo json_encode($a);
}
?>
