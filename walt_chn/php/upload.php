<?php

/* Getting file name */
$filename = $_FILES['file']['name'];
$imageFileType = pathinfo($filename,PATHINFO_EXTENSION); // 获取后缀名
$filename = uniqid().'.'.$imageFileType; // 文件名自动改为Uniq ID，避免重复

/* Location */
$location = "../upload/".$filename;
$uploadOk = 1;

/* Valid Extensions */
$valid_extensions = array("jpg","jpeg","png");
/* Check file extension */
if( !in_array(strtolower($imageFileType),$valid_extensions) ) {
   $uploadOk = 0;
}


if($uploadOk == 0){
   echo 0;
}else{
   /* Upload file */
   if(move_uploaded_file($_FILES['file']['tmp_name'],$location)){
      echo $filename;  // returns the new filename with uniq id
   }else{
      echo 0;
   }
}

?>