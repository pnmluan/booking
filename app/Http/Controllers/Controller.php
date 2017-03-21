<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
	public function toAscii($str, $replace=array(), $delimiter='-') {
		setlocale(LC_ALL, 'en_US.UTF8');
		$replace = [
			'đ' => 'd',
			'ỏ' => 'o',
			'õ' => 'o',
			'ọ' => 'o',
			'ổ' => 'o',
			'ỗ' => 'o',
			'ồ' => 'o',
			'ố' => 'o',
			'ộ' => 'o',
			'ở' => 'o',
			'ỡ' => 'o',
			'ờ' => 'o',
			'ớ' => 'o',
			'ợ' => 'o',
			'ế' => 'e',
			'ể' => 'e',
			'ễ' => 'e',
			'ề' => 'e',
			'ệ' => 'e',
			'ẻ' => 'e',
			'ẹ' => 'e',
			'ẩ' => 'a',
			'ẫ' => 'a',
			'ấ' => 'a',
			'ầ' => 'a',
			'ậ' => 'a',
			'ắ' => 'a',
			'ẳ' => 'a',
			'ẵ' => 'a',
			'ằ' => 'a',
			'ặ' => 'a',
			'ạ' => 'a',
			'ả' => 'a',
			'ử' => 'u',
			'ữ' => 'u',
			'ứ' => 'u',
			'ừ' => 'u',
			'ự' => 'u',
			'ũ' => 'u',
			'ủ' => 'u',
			'ư' => 'u',
			'ụ' => 'u',
			'ị' => 'i',
			'ỉ' => 'i',
			'ĩ' => 'i',
		];
		if( !empty($replace) ) {

			foreach($replace as $key=>$value) {
	    	    $str = str_replace($key, $value, $str);
	    	}
		}
		// $str = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖÙÚÛÜÝßàáâãäåæçèéêëìíîïðñòóôõöùúûüýÿ";
		$clean = iconv('UTF-8', 'ASCII//TRANSLIT', $str);
		$clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $clean);
		$clean = strtolower(trim($clean, '-'));
		$clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);
		return $clean;
	}
}
